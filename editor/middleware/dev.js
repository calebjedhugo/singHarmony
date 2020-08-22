/*Environment variables: (Make a .env file that includes: env=dev)

This file will only be active if `process.env.env` is set to 'dev'
*/

const router = require('express').Router()

//cors for developement environment.
const cors = require('cors')
var corsInstance = cors({
  exposedHeaders: 'Authorization'
})
router.options('*', corsInstance)
router.use(/.*/, corsInstance)

//A production environment should already have this.
require('dotenv').config();

module.exports = router
