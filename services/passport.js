const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../db/models/user')

// For dev, set the env var SECRET in the start script
const secret = process.env.SECRET

// Create a local strategy
const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions,
	// passport-local authentication function  
	// accepts username, password args
	// returns err, user args to done callback function
	function (email, password, done) {
		User.findOne({ email: email })
			.then(user => {
				// If no user with provided email 
				// exists return false w null error
				if (!user) done(null, false)
				// Otherwise compare provided password
				// with stored hashed user password
				user.verifyPassword(password, function (err, isMatch) {
					if (err) done(err)
					if (!isMatch) done(null, false)
					done(null, user)
				})
			})
			.catch(err => done(err))
	}
)

// Setup options for JWT strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
	secretOrKey: secret,
}

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
	// See if the user ID in the payload exists in our database
	User.findById(payload.sub, function (err, user) {
		if (err) done(err, false)
		if (!user) done(null, false)
		done(null, user)
	})
})

// Tell passport to use these strategies
passport.use(jwtLogin)
passport.use(localLogin)
