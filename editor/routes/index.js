const router = require('express').Router()

router.use('/songData', require('./songData.js'))
router.use('/lyricImport', require('./lyricImport.js'))
router.use('/timeSignature', require('./timeSignature.js'))

module.exports = router
