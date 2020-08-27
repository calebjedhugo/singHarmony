import {Staff} from './Staff.js'

export default class Meta extends Staff {
  constructor(props){
    console.log(keyWidth(props.keySignature) + tsWidth(props.ts))
    super(props, {width: keyWidth(props.keySignature) + tsWidth(props.ts), clef: true, padding: -2, stafSpace: props.stafSpace})
  }

  draw = () => {
    this.initStaff()
  }
}

const keyWidth = key => {
  switch(key){
    case 'G':
    case 'F':
      return 60
    case 'Bb':
    case 'D':
      return 70
    case 'Eb':
    case 'A':
      return 80
    case 'Ab':
    case 'E':
      return 90
    case 'Db':
    case 'B':
      return 100
    case 'Gb':
    case 'F#':
      return 110
    default: return 50
  }
}

const tsWidth = ts => {
  return ts ? 30 : 0
}
