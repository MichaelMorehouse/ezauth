
const crypto = require('crypto')

const algorithm = 'aes-192-cbc',
	secret = process.env.SECRET

exports.decipherService = (req, res, next) => {
	console.log(req.headers.authorization)
	next()
}

exports.cipherService = (req, res, next) => {
	let token = res.body.token
	if (token) {
		cipher(token)
			.then(token => {
				res.send({ token })
			})
			.catch(err => next(err))
	}
	res.send(res.body)
}

async function cipher(data) {
	try {
		let salt = crypto.randomBytes(16),
			key = crypto.scryptSync(secret, salt, 24),
			iv = crypto.randomBytes(16),
			cipher = crypto.createCipheriv(algorithm, key, iv)

		let ciphered = salt.toString('hex') + '.' + iv.toString('hex') + '.'
		ciphered += cipher.update(data, 'utf8', 'hex')
		ciphered += cipher.final('hex')
		return ciphered
	} catch (err) {
		return err
	}
}

async function decipher(data) {
	try {
		let arr = data.split('.')
		let salt = Buffer.from(arr[0], 'hex'),
			iv = Buffer.from(arr[1], 'hex'),
			key = crypto.scryptSync(secret, salt, 24),
			decipher = crypto.createDecipheriv(algorithm, key, iv)

		let deciphered = decipher.update(arr[2], 'hex', 'utf8')
		deciphered += decipher.final('utf8')
		return deciphered
	} catch (err) {
		return err
	}
}