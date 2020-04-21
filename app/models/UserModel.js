const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { Types: {ObjectId} } = Schema

const UserSchema = new Schema({
  name: String,
  age: { type: Number, required: true },
  password: { type: String, required: true, select: false },
  __v: { type: Number, select: false },
  avatarUrl: { type: String },
  locations: { type: [{ type: ObjectId, ref: 'Topic' }], select: false },
  business: { type: ObjectId, select: false, ref: 'Topic' },
  employments: {
    type: [
      {
        company: { type: ObjectId, ref: 'Topic' },
        job: { type: ObjectId, ref: 'Topic' }
      }
    ],
    select: false
  },
  educations: {
    type: [
      {
        school: { type: ObjectId, ref: 'Topic' },
        major: { type: ObjectId, ref: 'Topic' },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entranceYear: { type: Number },
        graduationYear: { type: Number }
      }
    ],
    select: false
  },
  following: {
    type: [{type: ObjectId, ref: 'User'}],
    select: false
  },
  followingTopics: {
    type: [{type: ObjectId, ref: 'Topic'}],
    select: false
  }
})

const UserModel = model('User', UserSchema)

module.exports = UserModel
