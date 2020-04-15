const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
  name: String,
  age: {
    type: Number,
    required: true
  }
})

const UserModel = model('User', UserSchema)

module.exports = UserModel