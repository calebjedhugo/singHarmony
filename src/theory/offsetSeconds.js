//adds prop {offset: true} to notes in top voice if the notes are an interval of a second.
import Intervals from './Intervals'
const intervals = new Intervals()

export function offsetSeconds(measure){
  try{
    measure.a = modifyFirstVoice(measure.a, measure.s, measure.ts[1])
    measure.b = modifyFirstVoice(measure.b, measure.t, measure.ts[1])
  } catch(e){
    console.error(`Something went wrong in './src/Theory/offsetSeconds' with this data:`, measure, e)
  }
  return measure
}

function modifyFirstVoice(voice1, voice2, denom){
  let nextNotes = [0, 0]
  let i2 = 0
  for(let i = 0; i < voice1.length; i++){
    if(nextNotes[0] === nextNotes[1]){
      let interval = intervals.notationDistance(voice1[i].value, voice2[i2].value)
      if(interval === 2){
        voice1[i].offset = true
      }
    }
    let duration1 = voice1[i].duration
    let rest1 = false
    if(duration1.slice(duration1.length - 1) === 'r'){
      duration1 = duration1.slice(0, duration1.length - 1)
      rest1 = true
    }
    nextNotes[0] += translateDuration(duration1, denom)

    while(nextNotes[1] < nextNotes[0]){
      let duration2 = voice2[i2].duration
      let rest2 = false
      if(duration2.slice(duration2.length - 1) === 'r'){
        duration2 = duration2.slice(0, duration2.length - 1)
        rest2 = true
      }
      nextNotes[1] += translateDuration(duration2, denom)
      i2++
    }
  }
  return voice1
}

function translateDuration(value, denom){
  let f = 0
  //check for dot
  let dotted = false
  if(value.slice(value.length - 1) === 'd'){
    value = value.slice(0, value.length - 1)
    dotted = true
  }

  f = denom / Number(value)
  if(dotted){
    f = f * 1.5
  }

  return f
}
