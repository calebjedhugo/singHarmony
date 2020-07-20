import {Staff} from './Staff.js'

export default class Meta extends Staff {
  constructor(props){
    super(props, {width: 50, clef: true, padding: 0})
  }

  draw = () => {
    this.initStaff()
  }
}
