const { Schema, model } = require('mongoose')

const TopicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  introduction: { type: String, select: false, default: '大家好~' }
})

const TopicModel = model('Topic', TopicSchema)

module.exports = TopicModel
