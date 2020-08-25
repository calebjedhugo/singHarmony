//If you use this class in an app, use the audio conxtext created here.
//Do not create a seperate one, you will be sorry! (Player.soundManager.soundscape)

import SoundManager from './soundManager'

export default class Player {
  constructor(){
    this.soundManager = new SoundManager()
    this.piano = this.soundManager.sampledInstrument('piano')
    console.log('A new player was constructed')
  }

  tempo = 100
  ts = [4, 4]
  state = 'paused'

  //holds the promises returned by "this.queueVoice"
  voicePromises = {'s': undefined, 'a': undefined, 't': undefined, 'b': undefined}
  voicesActive = {'s': true, 'a': true, 't': true, 'b': true}

  play = (data) => {
    const {tempoChanges, tempoChangeResolution} = data

    this.state = 'playing'
    this.ts = data.ts
    return new Promise(async (resolve, reject) => {
      this.resolve = resolve //exposing this for "this.pause".

      //Get all four voices going.
      for(let voice in this.voicePromises){
        this.voicePromises[voice] = this.queueVoice(data[voice], voice, [tempoChanges, tempoChangeResolution])
      }

      //Wait for all four voices to finish (should be all at the same time if the data is correct).
      for(let voice in this.voicePromises){
        await this.voicePromises[voice]
      }

      //Playback has completed!
      resolve()
    })
  }

  //We passed in the voice name in order to check it against voicesActive before playing the next note.
  //If voicesActive[voice] is false, dynamic is set to 'n'
  queueVoice = (notesArray, voice, tempoChanges) => {
    return new Promise(async resolve => {
      let framesElapsed = 0
      for(let i = 0; i < notesArray.length; i++){
        if(this.state === 'paused'){
          break;
        }

        let duration = notesArray[i].duration

        //A 't' at the end of a duration value indicates a tie.
        let tie = duration.slice(duration.length - 1) === 't'
        if(tie){
          //remove the 't'. handling playback for ties will be very complicated. Consider this to be tech debt.
          //For now, it'll just play the note again.
          duration = duration.slice(0, duration.length - 1)
        }

        let noBeam = duration.slice(duration.length - 1) === 'b'
        if(noBeam){
          //remove the 'b'. It doesn't matter for playback
          duration = duration.slice(0, duration.length - 1)
        }

        let fermata = duration.slice(duration.length - 1) === 'f'
        if(fermata){
          //Not relavent to playback.
          duration = duration.slice(0, duration.length - 1)
        }

        let resting = false
        if(duration[duration.length - 1] === 'r'){
          resting = true
          duration = duration.slice(0, duration.length - 1) //get rid of the 'r'. this.lengthTranslate doesn't handle it.
        }

        let durationInFrames = this.durationToFrames(duration, tempoChanges[1])

        let dynamic = notesArray[i].dynamic || this.defaultDynamic
        let length = this.lengthTranslate(
          duration,
          this.ts[1] || 4,
          tempoChanges[0].slice(framesElapsed, framesElapsed + durationInFrames)
        )

        //Is this a rest? Is the voice active?
        if(!resting && this.voicesActive[voice]) {
          await this.piano.play(notesArray[i].value, dynamic, length)
        } else { //This shouldn't be played. Just tell me when it's over...
          await new Promise(resolve => {
            setTimeout(resolve, length * 1000)
          })
        }
        framesElapsed += durationInFrames
      }
      resolve()
    })
  }

  get defaultDynamic(){
    let voiceCount = 0
    for(let voice in this.voicesActive){
      if(this.voicesActive[voice]) voiceCount++
    }

    switch(voiceCount){
      case 1: return 'f';
      case 2: return 'mf';
      case 3: return 'mp';
      case 4: return 'p';
    }
  }

  lengthTranslate = (duration, denominator, tempoAlterations) => {
    let tempoAlteration = 1
    if(tempoAlterations){
      tempoAlteration = tempoAlterations.reduce((a, b) => {return a + b}) / tempoAlterations.length
    }

    let dotted = false
    if(duration[duration.length - 1] === 'd'){
      dotted = true
      duration = duration.slice(0, duration.length - 1)
    }

    let beats = denominator / duration
    if(dotted){
      beats += (denominator / (duration * 2))
    }

    let secondsPerBeat = 60 / (this.tempo * tempoAlteration)
    return beats * secondsPerBeat
  }

  durationToFrames(duration, tempoChangeResolution){
    let dotted = false
    if(duration[duration.length - 1] === 'd'){
      dotted = true
      duration = duration.slice(0, duration.length - 1)
    }
    let f = tempoChangeResolution / duration
    if(dotted){
      f *= 1.5
    }
    return f
  }

  pause = () => {
    this.state = 'paused'
    this.resolve() //Playback is done, so we'll resolve the promise here.
  }
}
