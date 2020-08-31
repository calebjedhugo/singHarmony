import {Theory} from '../../Theory'
const {notationDistance} = (new Theory()).intervals
const xMult = 1.5
const yMultUp = 5
const yMultDown = 3

export default class Curves {
  constructor(VF){
    this.VF = VF
    this.to = null
    this.from = null
    this.lastResult = null
  }

  get yMin(){
    return this.notesInMiddle ? 50 : 0
  }

  get xMax(){

  }

  get extract() {
    //Do we have what we need to make a curve?
    if(!this.from || !this.to) return null
    let interval = notationDistance(this.from.keys[0], this.to.keys[0])
    interval = interval.value * (interval.direction ? 1 : -1)
    this.lastResult = new this.VF.Curve(this.from, this.to, {
      cps: [
        {
          x: (interval * xMult),
          y: Math.max(Math.abs(interval) * (interval < 0 ? yMultDown:  yMultUp), this.yMin)
        }, {
          x: (interval * xMult),
          y: Math.max(Math.abs(interval) * (interval < 0 ? yMultUp : yMultDown), this.yMin)
        }
      ],
      invert: true,
      x_shift: 2,
      y_shift: this.notesInMiddle ? 20 : 10,
      style: {fillStyle: "#0000004a", strokeStyle: "#0000004a"},
      thickness: .001
    })
    this.lastResult.setStyle({fillStyle: "#0000004a", strokeStyle: "#0000004a"})

    this.to = null
    this.from = null
    this.notesInMiddle = false

    return this.lastResult
  }

  insert = (note) => {
    if(!note) throw new Error(`Curves.insert requires a 'note' object`)
    if(this.from){
      if(this.to){
        this.notesInMiddle = true
      }
      this.to = note
    } else {
      this.from = note
    }
  }
}
