// This is copied from the main project. We need to figure out how to not do that...

import KeySignatures from './KeySignatures'
import Intervals from './Intervals'
import {offsetSeconds} from './offsetSeconds'

export class Theory {
  get keySignatures(){
    return new KeySignatures()
  }

  get intervals(){
    return new Intervals()
  }

  offsetSeconds = offsetSeconds
}
