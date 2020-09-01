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
    this.curves = []
    const {voices, idx, keySignature, data} = this.props

    this.alteredNotes = (theory.keySignatures).alteredNotes(keySignature)

    if(!data) throw new Error('The Measure component requires the prop, "data"')

    try{
      //create voices
      for(let voice in voices){
        if(!data.ts[1]) throw new Error(`invalid value in time signature denominator: ${data.ts[1]}`)
        let currentVoice = new this.VF.Voice({num_beats: data.ts[0], beat_value: data.ts[1]})
        this.voices.push(currentVoice)
        let clef = voice === 's' || voice === 'a' ? 'treble' : 'bass'
        let tickables = this.createTickables(data[voice], clef, voices[voice], voice)

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

      this.curves.forEach(curve => {
        curve.setContext(this.context).draw()
      })

    }
    catch(e){
      console.error(e.message, data, `Measure ${idx}`)
    }
  }

  createTickables = (data, clef, active, voice) => {
    this.curveCreator = new Curves(this.VF)
    this.tying = false
    let f = data.map(note => {
      let vfNote = this.vfNote({...note, clef: clef, voice: voice})
      if(!active) vfNote.setStyle(disabledVoiceStyle);
      return vfNote
    })
    let lastNote = f[f.length - 1]
    if(lastNote.duration === '2' && f.length > 1){
      lastNote.setXShift(lastNote.x_shift + 30)
      if(lastNote.accidental){
        //Vexflow doesn't move the accidentals for us, and I don't know what it's negitive.
        lastNote.accidental.setXShift(-lastNote.x_shift)
      }
    }
    if(this.tying){
      this.pushTie(this.tying, null, voice)
    }
    return f
  }

  createLyrics = data => {
    return data.map((verse, idx) => {
      let f = verse.map(word => {
        let textNote = new this.VF.TextNote({text: word.value + ' ', duration: word.duration})
        textNote
          .setContext(this.context)
          .setJustification(this.VF.TextNote.Justification.LEFT)
          .setLine(14 + (idx * 1.75))
        return textNote
      })
      let lastNote = f[f.length - 1]
      if(lastNote.duration === '2' && f.length > 1) lastNote.text = ('     ' + lastNote.text)
      return f
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

    this.curves.push(staveTie)
    this.tying = undefined
  }

  stemDirection = voice => {
    return /^(a|b)$/.test(voice) ? -1 : 1
  }

  vfNote = (data) => {
    const {manuallyOffset, tie, noBeam, fermata, slur, duration, rest, dotted, breathMark} = durationMods(data.duration)
    const {voice, value, clef, offset} = data
    const {voices} = this.props
    let stemDirection = this.stemDirection(voice)

    let note = new this.VF.StaveNote({
      clef: clef,
      keys: [value],
      duration: duration,
      stem_direction: stemDirection
    })

    //Add dots
    if(dotted){
      note.addDotToAll()
    }

    //Accidentals
    let accidental = this.accidental(value)
    if(accidental && !rest){
      note.addAccidental(...accidental)
      note.accidental = accidental[1] //So we can modify it later if needed.
    }

    //*** Custom modifiers (not in Vexflow) ***
    //offset comes from algorithms working on the data on import.
    if(offset) note.setXShift(15)

    //manuallyOffset comes from the data being hard coded with one or more 'o's
    if(manuallyOffset) note.setXShift(note.x_shift + manuallyOffset)

    //Now that we know what the xShift is, we (ugh...) have to set the accidenal's xShift too


    if(noBeam){
      note.setBeam('noBeam')
    }

    if(fermata){
      note.addArticulation(0, (new this.VF.Articulation('a@a')).setPosition(3))
    }

    if(this.tying && voices[voice]){
      this.pushTie(this.tying, note, voice)
    }
    if(tie && voices[voice]){
      this.tying = note
    }

    if(slur || this.curveCreator.from && voices[voice]){
      this.curveCreator.insert(note)
      if(!slur){ //if the slur is ending
        this.curves.push(this.curveCreator.extract)
      }
    }

    if(breathMark && stemDirection > 0){ //Only mark s and t
      let breathMarkString = '   ’'
      let annotation = new this.VF.Annotation(breathMarkString)
      annotation.setFont('Times', 40)
      annotation.setVerticalJustification(this.VF.Annotation.VerticalJustify.CENTER);
      annotation.setJustification(1);
      note.addModifier(0, annotation)
    }

    return note
  }
}
