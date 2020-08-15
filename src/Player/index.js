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

  //holds the promises returned by "this.queueVoice"
  voices = {'s': undefined, 'a': undefined, 't': undefined, 'b': undefined}

  play = (data) => {
    console.log('playing', data)
    this.ts = data.ts
    return new Promise(async (resolve, reject) => {
      this.resolve = resolve //exposing this for "this.pause".

      //Get all four voices going.
      for(let voice in this.voices){
        this.voices[voice] = this.queueVoice(data[voice])
      }

      //Wait for all four voices to finish (should be all at the same time if the data is correct).
      for(let voice in this.voices){
        await this.voices[voice]
      }

      //Playback has completed!
      resolve()
    })
  }

  queueVoice = notesArray => {
    return new Promise(async resolve => {
      for(let i = 0; i < notesArray.length; i++){
        await this.piano.play(
          notesArray[i].value,
          notesArray[i].dynamic || 'mf',
          this.lengthTranslate(notesArray[i].duration, this.ts[1] || 4)
        )
      }
      resolve()
    })
  }

  lengthTranslate = (duration, denominator) => {
    let beats = denominator / duration
    let secondsPerBeat = 60 / this.tempo
    return beats * secondsPerBeat
  }

  pause = () => {
    clearTimeout(this.nextSonority)
    this.resolve() //Playback is done, so we'll resolve the promise here.
    console.log('paused')
  }
}
