const mongoose = require('mongoose')
const Schema = mongoose.Schema
const argon2 = require('argon2')

var UserSchema = new Schema({
	username: {
		type: String,
		required: 'You must provide a username',
	},
	email: {
		type: String,
		required: 'You must use an email address',
	},
	password: {
		type: String,
		required: 'You must provide a password',
	},
	dateRegistered: {
		type: Date,
		default: Date.now,
	},
	roles: {
		type: [String],
		default: 'User',
		enum: ['Admin', 'User'],
	},
})

// On save hook, encrypt password
// Before saving a model, run this function
UserSchema.pre('save', function (next) {
	// access user model
	const user = this

	// generates a salt, hashes password and
	// replaces user password with password hash
	argon2.hash(user.password)
		.then(hash => {
			user.password = hash
			next()
		})
		.catch(err => { next(err) })
})

UserSchema.methods.verifyPassword = function (providedPassword, cb) {
	argon2.verify(this.password, providedPassword)
		.then(isMatch => {
			cb(null, isMatch)
		})
		.catch(err => cb(err))
}

module.exports = mongoose.model('User', UserSchema)