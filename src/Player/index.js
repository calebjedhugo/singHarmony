import SoundManager from './soundManager'

export default class Player {
  constructor(globalSongData){
    console.log('A new player was constructed', globalSongData)
  }

  play = (data) => {
    console.log('playing', data)
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.nextSonority = setTimeout(() => {
        resolve()
      }, 100)
    })
  }

  pause = () => {
    clearTimeout(this.nextSonority)
    this.resolve() //Playback is done, so we'll resolve the promise here.
    console.log('paused')
  }

  piano = (new SoundManager()).sampledInstrument('piano')
}
