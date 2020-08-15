import {Staff} from './Staff.js'

export default class Measure extends Staff {
  constructor(props){
    const {data, width} = props
    let maxNotes = Math.max(data.s.length, data.a.length, data.t.length, data.b.length, 1)
    super(props, {padding: 0, stafSpace: 215, width: width || (maxNotes * 70)})
  }

  draw = () => {
    this.initStaff()
    this.voices = []
    this.verses = []
    this.beams = []
    const {voices, data, idx} = this.props
    if(!data) throw new Error('The Measure component requires the prop, "data"')
    try{
      //create voices
      for(let voice in voices){
        let currentVoice = new this.VF.Voice({num_beats: data.ts[0], beat_value: data.ts[1]})
        this.voices.push(currentVoice)
        let clef = voice === 's' || voice === 'a' ? 'treble' : 'bass'
        let tickables = this.createTickables(data[voice], clef, voices[voice], voice)
        currentVoice.addTickables(tickables)
        currentVoice.clef = this[`${clef}Staff`]

        this.beams.push(this.VF.Beam.applyAndGetBeams(currentVoice, /^(a|b)$/.test(voice) ? -1 : 1))
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
        voice.draw(this.context, voice.clef);
      })

      this.verses.forEach(verse => {
        verse.draw(this.context, this.voices[0].clef)
      })

      this.beams.forEach(beamGroup => {
        beamGroup.forEach(beam => {
          return beam.setContext(this.context).draw();
        })
      });
    }
    catch(e){
      console.error(e.message, data, `Measure ${idx}`)
    }
  }

  createTickables = (data, clef, active, voice) => {
    return data.map(note => {
      let vfNote = this.vfNote({...note, clef: clef, voice: voice})
      if(!active) vfNote.setStyle({fillStyle: "#0000004a"});
      return vfNote
    })
  }

  createLyrics = data => {
    return data.map((verse, idx) => {
      return verse.map(word => {
        let textNote = new this.VF.TextNote({text: word.value, duration: word.duration})
        textNote.setContext(this.context).setJustification(this.VF.TextNote.Justification.LEFT)
        textNote.setLine(13 + (idx * 1.75))
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
    let acc = note.split('/')[0].slice(1)
    if(acc) return [0, new this.VF.Accidental(acc)]
    else return false
  }

  vfNote = (data) => {
    let note = new this.VF.StaveNote({
      clef: data.clef,
      keys: [data.value],
      duration: data.duration,
      stem_direction: /^(a|b)$/.test(data.voice) ? -1 : 1
    })
    if(/d/.test(data.duration)) note.addDotToAll()
    let accidental = this.accidental(data.value)
    if(accidental) note.addAccidental(...accidental)
    return note
  }
}
