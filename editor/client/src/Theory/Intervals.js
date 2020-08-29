import {noteValidation} from './validation'

export default class Intervals{
  letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

  notationDistance = (note1, note2) => {
    let letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    noteValidation(note1, note2)
    note1 = note1.split('/')
    note2 = note2.split('/')

    //We don't need to know the accidenal here and it will throw of the algorithm.
    note1[0] = note1[0][0]
    note2[0] = note2[0][0]

    let zeroBase1 = (note1[1] * 7) + letters.indexOf(note1[0])
    let zeroBase2 = (note2[1] * 7) + letters.indexOf(note2[0])

    let interval = Math.abs(zeroBase1 - zeroBase2)
    return interval + 1 //intervals are 1 based counting
  }
}
