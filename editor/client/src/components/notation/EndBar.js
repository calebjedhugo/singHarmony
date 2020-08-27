import {Staff} from './Staff.js'

export default class EndBar extends Staff {
  constructor(props){
    super(props, {width: width(), padding: 10, stafSpace: props.stafSpace})
  }

  componentDidMount(){
    this.draw()
  }

  draw = () => {
    this.initStaff()
    let barVoice = new this.VF.Voice({num_beats: 0, beat_value: 4})
    let finalBarline = new this.VF.BarNote(3)

    barVoice.addTickables([finalBarline])

    this.formatter = new this.VF.Formatter().formatToStave([barVoice], this.stave);

    barVoice.draw(this.context, this.trebleStaff);
    barVoice.draw(this.context, this.bassStaff);
    this.canvasElement.style.position = 'relative'
    this.canvasElement.style.left = '-18px'
  }
}

const width = () => {
  return .001 //0 means default and that should probably stay that way.
}
