const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
  name: String,
  age: { type: Number, required: true },
  password: { type: String, required: true, select: false },
  __v: { type: Number, select: false },
  avatarUrl: { type: String },
  locations: { type: [{ type: String }], select: false },
  business: { type: String, select: false },
  employments: {
    type: [
      {
        company: { type: String },
        job: { type: String }
      }
    ],
    select: false
  },
  educations: {
    type: [
      {
        school: { type: String },
        major: { type: String },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entranceYear: { type: Number },
        graduationYear: { type: Number }
      }
    ],
    select: false
  }
})

const UserModel = model('Users', UserSchema)

module.exports = UserModel
