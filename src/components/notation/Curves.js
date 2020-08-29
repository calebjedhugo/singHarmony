import {Theory} from '../../Theory'
const {notationDistance} = (new Theory()).intervals

export default class Curves {
  constructor(VF){
    this.VF = VF
    this.to = null
    this.from = null
    this.lastResult = null
  }

  get extract() {
    //Do we have what we need to make a curve?
    if(!this.from || !this.to) return null
    console.log(notationDistance(this.from.keys[0], this.to.keys[0]))
    this.lastResult = new this.VF.Curve(this.from, this.to, {
      cps: [{x: 10, y: 30}, {x: 10, y: 20}],
      invert: true,
      x_shift: 2
    })

    this.to = null
    this.from = null

    return this.lastResult
  }

  insert = (note) => {
    if(!note) throw new Error(`Curves.insert requires a 'note' object`)
    if(this.from){
      this.to = note
    } else {
      this.from = note
    }
  }
}
