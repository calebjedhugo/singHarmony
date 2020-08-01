import {Staff} from './Staff.js'

export default class Measure extends Staff {
  constructor(props){
    super(props, {padding: -2})
  }

  draw = () => {
    this.initStaff()
    this.voices = []
    const {voices, data, idx} = this.props
    if(!data) throw new Error('The Measure component requires the prop, "data"')

    try{
      //create voices
      for(let voice in voices){
        this.voices.push(new this.VF.Voice({num_beats: data.ts[0],  beat_value: data.ts[1]}))
        let clef = voice === 's' || voice === 'a' ? 'treble' : 'bass'
        let tickables = this.createTickables(data[voice], clef, voices[voice], voice)
        this.voices[this.voices.length - 1].addTickables(tickables)
        this.voices[this.voices.length - 1].clef = this[`${clef}Staff`]
      }

      // Format and justify the notes to props.width.
      this.formatter = new this.VF.Formatter().joinVoices(this.voices).formatToStave(this.voices, this.stave);
      // Render voice
      //The 'this.stave' in the Staff class needs to be in the constructor to be accessible.
      this.voices.forEach(voice => {
        voice.draw(this.context, voice.clef);
      })
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
