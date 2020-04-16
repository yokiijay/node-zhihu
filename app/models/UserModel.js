const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
  name: String,
  age: { type: Number, required: true },
  password: {type: String, required: true, select: false},
  __v: {type: Number, select: false}
})

const UserModel = model('Users', UserSchema)

module.exports = UserModel