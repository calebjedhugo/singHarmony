const router = require('express').Router()
const TimeSignature = require('../classes/TimeSignatures')

router.route('/:song').all((req, res, next) => {
  if(!req.params.song){
    return res.status(400).json('A title is required')
  }
  next()
}).patch(async (req, res) => {
  const timeSignature = new TimeSignature(req.params.song)

  try{
    let data = await timeSignature.update(req.body.timeSignature)
    res.json(data)
  } catch(e){
    res.status(500).json(e.message || e)
  }
})

module.exports = router
