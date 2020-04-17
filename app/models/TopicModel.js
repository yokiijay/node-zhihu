const { Schema, Model } = require('mongoose')

const TopicSchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  avatarUrl: {type: String},
  introduction: {type: String, select: false}
})

const TopicModel = new Model('Topic', TopicSchema)

module.export = TopicModel