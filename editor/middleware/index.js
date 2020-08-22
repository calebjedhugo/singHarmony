const router = require('express').Router()

//Special things just for running locally.
const {env} = process.env
if(!env){
  console.log(`Global variable 'env' is not set. Running in dev mode.`)
  router.use(require('./dev.js'))
}

//Just the stuff production needs.
router.use(require('./util.js'))

module.exports = router
