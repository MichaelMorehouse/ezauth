const router = require('express').Router()
const auth = require('./controllers/auth')
const passport = require('passport')
// import strategies from passport service
require('./services/passport')

const requireSignin = passport.authenticate('local', {session: false})
const requireToken = passport.authenticate('jwt', {session: false})

router.post('/signup', auth.signup)
router.post('/signin', requireSignin, auth.signin)

router.use(/\/.*/, requireToken)

module.exports = router