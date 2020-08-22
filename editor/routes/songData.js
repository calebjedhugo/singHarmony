const router = require('express').Router()
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const Song = require('../classes/Song.js')
const {dataPath} = require('../config.js')

router.route('/:song?').all((req, res, next) => {
  if(req.method.toLowerCase() !== 'get' && !req.params.song){
    return res.status(400).json('A title is required')
  }
  next()
}).get(async (req, res) => {
  const {song} = req.params
  let resJSON

  //Did the user pass in a title?
  if(song){
    try {
      resJSON = await (new Song(song)).data
    } catch(e){
      return res.status(500).json(e.message)
    }
  } else { //send over the list of files
    try {
      resJSON = await new Promise((resolve, reject) => {
        glob(`${dataPath}**/*`, (e, res) => {
          if(e) {reject(e)}
          resolve(res)
        })
      })
      resJSON = resJSON.map(file => {
        return path.basename(file).replace('.json', '')
      })
    } catch(e){
      return res.status(500).json(e.message)
    }
  }
  res.json(resJSON)
}).post(async (req, res) => {
  const song = new Song(req.params.song)

  //Does it already exist?
  if(song.exists){
    return res.status(400).json(`${song.title} already exists.`)
  }

  try{
    let data = await song.create()
    res.json(data)
  } catch(e){
    res.status(500).json(e.message)
  }

}).patch(async (req, res) => {
  const song = new Song(req.params.song)

  if(!song.exists){
    return res.status(400).json(`${song.title} does not exist.`)
  }

  try{
    let data = await song.update(req.body)
    res.json(data)
  } catch(e){
    res.status(500).json(e.message)
  }
})

module.exports = router
