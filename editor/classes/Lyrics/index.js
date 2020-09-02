const fs = require('fs')
const path = require('path')
const {dataPath, dataTemplate, lyricsPath} = require('../../config.js')
const Song = require('../Song')

class Lyrics {
  constructor(songTitle){
    this.title = songTitle
    this.fileName = `${this.title}.txt`
    this.dataPath = path.join(lyricsPath, this.fileName)
    this.rewriteLyrics = require('./rewriteLyrics')
  }

  get data(){
    return new Promise((resolve, reject) => {
      if(!fs.existsSync(this.dataPath)){
        return reject(new Error(`'${this.title}' does not exist.`))
      }
      fs.readFile(this.dataPath, 'utf8', (e, data) => {
        if(e) reject(e)
        resolve(data)
      })
    })
  }

  get exists(){
    return fs.existsSync(this.dataPath)
  }

  update(newContent) {
    if(!this.exists){
      throw new Error(`${this.title} does not exist.`)
    }

    return new Promise(async (resolve, reject) => {
      try {
        let song = new Song(this.title)
        let songData = await song.data
        var newData = this.rewriteLyrics(newContent, songData)
        song.update(newData)
      } catch(e){
        return reject(e.message)
      }

      fs.writeFile(this.dataPath, newContent, e => {
        if(e) reject(e)
        else resolve(newData)
      })
    })
  }
}

module.exports = Lyrics
