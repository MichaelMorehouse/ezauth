const secret = process.env.SECRET

const jwt = require('jsonwebtoken'),
	expMinutes = 60

module.exports.tokenForUser = async function (user) {
	try {
		return jwt.sign({
			sub: user.id,
			// Token times in seconds since epoch
			iat: Math.floor(Date.now() / 1000),
			nbf: Math.floor(Date.now() / 1000) - (2 * 60),
			// Set token to expire in 1 hour
			exp: Math.floor(Date.now() / 1000) + (expMinutes * 60),
		},
		secret, { algorithm: 'HS256' })
	} catch (err) {
		return err
	}
}