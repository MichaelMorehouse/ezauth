const secret = process.env.SECRET

const jwt = require('jsonwebtoken')

module.exports.tokenForUserAsync = function (user, cb) {
	jwt.sign({ sub: user.id, iat: Date.now() }, secret, { algorithm: 'HS256' },
		function (err, token) {
			if (err) cb(err)
			cb(null, token)
		})
}