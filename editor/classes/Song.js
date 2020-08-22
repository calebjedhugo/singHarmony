const fs = require('fs')
const path = require('path')

class Song {
  constructor(songTitle){
    this.title = songTitle
  }

  get data(){
    const currentPath = path.dirname(require.main.filename)
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(currentPath, `../src/staticData/songData/`, `${this.title}.json`), 'utf8', (e, data) => {
        if(e) reject(e)
        resolve(JSON.parse(data))
      })
    })
  }
}

module.exports = Song
