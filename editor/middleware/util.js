const router = require('express').Router()

//bodyParser
const bodyParser = require('body-parser')
router.use(bodyParser.json())

module.exports = router
