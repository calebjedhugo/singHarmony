import {Staff} from './Staff.js'
import durationMods from './durationMods'
import Curves from './Curves'
import {Theory} from '../../Theory'

const theory = new Theory()

const disabledVoiceStyle = {fillStyle: "#0000004a", strokeStyle: "#0000004a"}

export default class Measure extends Staff {
  constructor(props){
    const {data, width, stafSpace, keySignature} = props
    let maxNotes = Math.max(data.s.length, data.a.length, data.t.length, data.b.length, 1)

    super(props, {
      padding: 0,
      stafSpace: stafSpace,
      width: width || (maxNotes * 72)
    })
  }

  draw = () => {
    this.initStaff()
    this.voices = []
    this.verses = []
    this.beams = []
    this.ties = {s: [], a: [], t: [], b: []}
    this.curves = []
    const {voices, idx, keySignature, data, final} = this.props

    this.alteredNotes = (theory.keySignatures).alteredNotes(keySignature)

    if(!data) throw new Error('The Measure component requires the prop, "data"')

    try{
      //create voices
      for(let voice in voices){
        if(!data.ts[1]) throw new Error(`invalid value in time signature denominator: ${data.ts[1]}`)
        let currentVoice = new this.VF.Voice({num_beats: data.ts[0], beat_value: data.ts[1]})
        this.voices.push(currentVoice)
        let clef = voice === 's' || voice === 'a' ? 'treble' : 'bass'
        let tickables = this.createTickables(data[voice], clef, voices[voice], voice, final)

        currentVoice.addTickables(tickables)
        currentVoice.clef = this[`${clef}Staff`]

        let localBeams = this.VF.Beam.generateBeams(currentVoice.getTickables().filter(note => {
          if(note.beam !== 'noBeam'){
            return true
          } else {
            note.setBeam(null)
          }
        }), {
          stem_direction: /^(a|b)$/.test(voice) ? -1 : 1,
          groups: [new this.VF.Fraction(2, 8), new this.VF.Fraction(2, 8), new this.VF.Fraction(2, 8)]
        })
        if(!voices[voice]){
          localBeams.forEach(beam => {
            beam.setStyle(disabledVoiceStyle);
          })
        }
        this.beams.push(localBeams)
      }

      //prepare lyrics
      let lyrics = data.lyrics ? this.createLyrics(data.lyrics) : false
      if(lyrics){
        lyrics.forEach(verse => {
          let currentVerse = new this.VF.Voice({num_beats: data.ts[0], beat_value: data.ts[1]})
          currentVerse.addTickables(verse)
          this.verses.push(currentVerse)
        })
      }

      // Format and justify the notes to props.width.
      let voicesAndLyrics = [...this.voices, ...this.verses]
      this.formatter = new this.VF.Formatter().formatToStave(voicesAndLyrics, this.stave);
      // Render voice
      //The 'this.stave' in the Staff class needs to be in the constructor to be accessible.
      this.voices.forEach(voice => {
        voice.draw(this.context, voice.clef)
      })

      this.verses.forEach(verse => {
        verse.draw(this.context, this.voices[0].clef)
      })

      this.beams.forEach(beamGroup => {
        beamGroup.forEach(beam => {
          return beam.setContext(this.context).draw();
        })
      });

      for(let tieVoice in this.ties){
        this.ties[tieVoice].forEach(tie => {
          if(voices[tieVoice]){
            tie.setContext(this.context).draw(this.context)
          }
        })
      }

      this.curves.forEach(curve => {
        curve.setContext(this.context).draw()
      })

    }
    catch(e){
      console.error(e.message, data, `Measure ${idx}`)
    }
  }

  createTickables = (data, clef, active, voice, final) => {
    this.curveCreator = new Curves(this.VF)
    this.tying = false
    let f = data.map(note => {
      let vfNote = this.vfNote({...note, clef: clef, voice: voice})
      if(!active) vfNote.setStyle(disabledVoiceStyle);
      return vfNote
    })
    if(this.tying){
      this.pushTie(this.tying, null, voice)
    }
    return f
  }

  createLyrics = data => {
    return data.map((verse, idx) => {
      return verse.map(word => {
        let textNote = new this.VF.TextNote({text: word.value + ' ', duration: word.duration})
        textNote
          .setContext(this.context)
          .setJustification(this.VF.TextNote.Justification.LEFT)
          .setLine(14 + (idx * 1.75))
        return textNote
      })
    })
  }

  componentDidMount(){
    this.draw()
  }

  componentDidUpdate(){
    this.draw()
  }

  accidental = (note) => {
    let noteArray = note.split('/')
    let acc = noteArray[0].slice(1, 2)
    let letter = noteArray[0].slice(0, 1)

    let partOfKey = this.alteredNotes[letter] === noteArray[0]

    if(!partOfKey){
      this.alteredNotes[letter] = letter + acc
      return [0, new this.VF.Accidental(acc || 'n')]
    }
    else return false
  }

  pushTie = (from, to, voice) => {
    let stemDirection = this.stemDirection(voice)
    let staveTie = new this.VF.StaveTie({
      first_note: from,
      last_note: to
    })
    .setDirection(-stemDirection)

    this.ties[voice].push(staveTie)
    this.tying = undefined
  }

  stemDirection = voice => {
    return /^(a|b)$/.test(voice) ? -1 : 1
  }

  vfNote = (data) => {
    const {manuallyOffset, tie, noBeam, fermata, slur, duration, rest, dotted} = durationMods(data.duration)
    const {voice, value, clef, offset} = data
    let stemDirection = this.stemDirection(voice)

    let note = new this.VF.StaveNote({
      clef: clef,
      keys: [value],
      duration: duration,
      stem_direction: stemDirection
    })

    //Accidentals
    let accidental = this.accidental(value)
    if(accidental && !rest){
      note.addAccidental(...accidental)
    }

    if(offset || manuallyOffset){
      note.setXShift(15)
    }

    //Add dots
    if(dotted){
      note.addDotToAll()
    }

    //Custom modifiers (not in Vexflow)
    if(noBeam){
      note.setBeam('noBeam')
    }

    if(fermata){
      note.addArticulation(0, (new this.VF.Articulation('a@a')).setPosition(3))
    }

    //ties
    if(this.tying){
      this.pushTie(this.tying, note, voice)
    }
    if(tie){
      this.tying = note
    }

    if(slur || this.curveCreator.from){
      this.curveCreator.insert(note)
      if(!slur){ //if the slur is ending
        this.curves.push(this.curveCreator.extract)
      }
    }

    return note
  }
}
