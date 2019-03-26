const secret = process.env.SECRET

const jwt = require('jsonwebtoken'),
	expMinutes = 60

module.exports.tokenForUserAsync = function (user, cb) {
	jwt.sign({
		sub: user.id,
		// Token times in seconds since epoch
		iat: Math.floor(Date.now() / 1000),
		nbf: Math.floor(Date.now() / 1000) - (2 * 60),
		// Set token to expire in 1 hour
		exp: Math.floor(Date.now() / 1000) + (expMinutes * 60),
	},
	secret, { algorithm: 'HS256' },
	function (err, token) {
		if (err) cb(err)
		cb(null, token)
	})
}