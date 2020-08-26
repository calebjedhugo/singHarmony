const fs = require('fs')
const path = require('path')
const {dataPath, dataTemplate, lyricsPath} = require('../../config.js')
const Song = require('../Song')

class TimeSignature {
  constructor(songTitle){
    this.title = songTitle
    this.fileName = `${this.title}.txt`
    this.dataPath = path.join(lyricsPath, this.fileName)
    this.rewriteTimeSignatures = require('./rewriteTimeSignatures')
  }

  update(newTimeSignature) {
    return new Promise(async (resolve, reject) => {
      try {
        let song = new Song(this.title)
        let songData = await song.data
        var newData = this.rewriteTimeSignatures(newTimeSignature, songData)
        song.update(newData)
      } catch(e){
        return reject(e.message)
      }

      resolve(newData)
    })
  }
}

module.exports = TimeSignature
