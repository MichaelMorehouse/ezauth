const jwt = require('jwt-simple')
const User = require('../models/user')

const secret = process.env.SECRET

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({sub: user.id, iat: timestamp}, secret)
}

exports.signin = function(req, res, next) { 
    // User has already has username/password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user)})
}

exports.signup = function(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return res.status(422).send({error: "You must provide email and password"})
    }

    // See if a user with the given email exist
    User.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(422).send({error: 'Email is in use'})
            }
            // If not create a new user with passed credentials
            const user = new User({
                email: email,
                password: password
            })
            // Respond to successful save with jwt token
            user.save() 
                .then(res.send({ token: tokenForUser(user) }))
                .catch(err=>next(err))
        })
        .catch(err=>next(err))
}