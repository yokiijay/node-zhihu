const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { Types: {ObjectId} } = Schema

const UserSchema = new Schema({
  name: String,
  age: { type: Number, required: true },
  password: { type: String, required: true, select: false },
  __v: { type: Number, select: false },
  avatarUrl: { type: String },
  locations: { type: [{ type: ObjectId }], select: false },
  business: { type: ObjectId, select: false },
  employments: {
    type: [
      {
        company: { type: ObjectId },
        job: { type: ObjectId }
      }
    ],
    select: false
  },
  educations: {
    type: [
      {
        school: { type: ObjectId },
        major: { type: ObjectId },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entranceYear: { type: Number },
        graduationYear: { type: Number }
      }
    ],
    select: false
  },
  following: {
    type: [{type: ObjectId, ref: 'Users'}],
    select: false
  }
})

const UserModel = model('Users', UserSchema)

module.exports = UserModel
