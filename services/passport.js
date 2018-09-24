const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/user')

// For dev, set the env var SECRET in the start script
const secret = process.env.SECRET

// Create a local strategy
const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions,
    // passport-local authentication function  
    // accepts username, password args
    // returns err, user args to done callback function
    function(email, password, done) {
        User.findOne({ email: email })
        .then(user => {
            // If no user with provided email 
            // exists return false w null error
            if(!user) {return done(null, false)}
            // Otherwise compare provided password
            // with stored user password hashed w bcrypt
            user.comparePassword(password, function(err, isMatch) {
                if (err) {return done(err)}
                if (!isMatch) {return done(null, false)}
    
                return done(null, user)
            })
        })
        .catch(err=> {if (err) return done(err)})
    }
)

// Setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: secret
}

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
    // See if the user ID in the payload exists in our database
    User.findById(jwt_payload.sub, function(err, user) {
        if (err) {return done(err, false)}
        // If yes, call 'done' with that user
        // If no, call 'done' without a user object
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

// Tell passport to use these strategies
passport.use(jwtLogin)
passport.use(localLogin)
