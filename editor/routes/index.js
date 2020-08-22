const router = require('express').Router()

router.use('/songData', require('./songData.js'))

module.exports = router
