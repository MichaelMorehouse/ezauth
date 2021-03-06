
const User = require('../db/models/user'),
	jwt = require('../services/jwt')

exports.login = function (req, res) {
	// User has already been authenticated by passport
	// We just need to give them a token
	jwt.tokenForUserAsync(req.user, function (err, token) {
		if (err) res.send(err)
		res.send({ token: token })
	})
}

exports.signup = function (req, res, next) {
	const email = req.body.email,
		password = req.body.password

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password' })
	}

	// See if a user with the given email exist
	User.findOne({ email: email })
		.then(existingUser => {
			if (existingUser) {
				return res.status(422).send({ error: 'Email is in use' })
			}
			// If not create a new user with passed credentials
			const user = new User(req.body)
			// Respond to successful save with jwt token
			user.save()
				.then(user => {
					jwt.tokenForUserAsync(user, function (err, token) {
						if (err) next(err)
						res.send({ token: token })
					})
				})
				.catch(err => next(err))
		})
		.catch(err => next(err))
}

exports.changePassword = function (req, res, next) {
	const password = req.body.password,
		newPassword = req.body.newPassword

	if (!password || !newPassword) {
		return res.status(422).send({ error: 'You must provide old and new passwords' })
	}

	// with stored hashed user password
	req.user.verifyPassword(password, function (err, isMatch) {
		if (err) next(err)
		if (!isMatch) return res.status(422).send({ error: 'Incorrect credentials' })
		req.user.password = newPassword
		req.user.save()
			.then(user => {
				jwt.tokenForUserAsync(user, function (err, token) {
					if (err) next(err)
					res.send({ token: token })
				})
			})
			.catch(err => next(err))
	})
}