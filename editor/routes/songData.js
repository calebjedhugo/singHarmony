const router = require('express').Router()
const fs = require('fs')
const Song = require('../classes/Song.js')

router.route('/:song?').all((req, res, next) => {
  if(req.method.toLowerCase() !== 'get' && !req.params.song){
    return res.status(400).json('A title is required')
  }
  next()
}).get(async (req, res) => {
  const {song} = req.params
  let resJSON
  if(song){
    try {
      resJSON = await (new Song(song)).data
    } catch(e){
      return res.status(500).json(e.message)
    }
  } else {
    resJSON = 'Code to send song list'
  }
  res.json(resJSON)
}).post((req, res) => {
  res.json(res.resObj)
}).patch((req, res) => {
  res.json(res.resObj)
}).delete((req, res) => {
  res.json(res.resObj)
})

module.exports = router
