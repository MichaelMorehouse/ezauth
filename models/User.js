const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
})

// On save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
    // access user model
    const user = this
    // generates a salt, hashes password and
    // replaces user password with password hash
    bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(user.password, salt)
                .then(hash => {
                    user.password = hash
                    next()
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
})
// Hashes provided password credentials 
// and compares to stored password hash
userSchema.methods.comparePassword = function(providedPassword, callback) { 
    bcrypt.compare(providedPassword, this.password, function(err, isMatch) {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)