const router = require('express').Router()
const Lyrics = require('../classes/Lyrics')

router.route('/:song?').all((req, res, next) => {
  if(!req.params.song){
    return res.status(400).json('A title is required')
  }
  next()
}).get(async (req, res) => {
  const {song} = req.params
  try {
    resJSON = await (new Lyrics(song)).data
  } catch(e){
    return res.status(500).json(e.message)
  }
  res.json(resJSON)
}).put(async (req, res) => {
  const lyrics = new Lyrics(req.params.song)

  try{
    let data = await lyrics.update(req.body.text)
    res.json(data)
  } catch(e){
    res.status(500).json(e.message || e)
  }
})

module.exports = router
