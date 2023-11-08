const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  userName: {type: String, required: true, min: 4, unique: true},
  password: {type: String, required: true}
})

const UserModel = mongoose.model('UserModel', UserSchema)


module.exports = UserModel
