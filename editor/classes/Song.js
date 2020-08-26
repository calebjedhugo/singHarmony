const fs = require('fs')
const path = require('path')
const {dataPath, dataTemplate} = require('../config.js')

class Song {
  constructor(songTitle){
    this.title = songTitle
    this.fileName = `${this.title}.json`
    this.dataPath = path.join(dataPath, this.fileName)
  }

  get data(){
    return new Promise((resolve, reject) => {
      if(!fs.existsSync(this.dataPath)){
        return reject(new Error(`'${this.title}' does not exist.`))
      }
      fs.readFile(this.dataPath, 'utf8', (e, data) => {
        if(e) reject(e)
        resolve(JSON.parse(data))
      })
    })
  }

  get exists(){
    return fs.existsSync(this.dataPath)
  }

  create() {
    if(this.exists){
      throw new Error(`${this.title} already exists.`)
    }

    //Create new song from template
    let newTemplate = dataTemplate()
    newTemplate.metaData.fileName = this.fileName
    newTemplate.metaData.prettyTitle = this.title
      .split('_')
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ')

    //Try to make it. I can't imagine why this would fail, but to be safe...
    return new Promise((resolve, reject) => {
      fs.writeFile(this.dataPath, JSON.stringify(newTemplate), e => {
        if(e) reject(e)
        else resolve(newTemplate)
      })
    })
  }

  update(newContent) {
    if(!this.exists){
      throw new Error(`${this.title} does not exist.`)
    }

    //Try to make it. I can't imagine why this would fail, but to be safe...
    return new Promise((resolve, reject) => {
      fs.writeFile(this.dataPath, JSON.stringify(newContent), e => {
        if(e) reject(e)
        else resolve(newContent)
      })
    })
  }
}

module.exports = Song
