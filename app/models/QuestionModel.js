const { Schema, model, SchemaTypes:{ObjectId} } = require('mongoose')

const QuestionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String },
  questioner: { type: ObjectId, required: true, ref: 'User', required: true, select: false },
  topics: {
    type: [{ type: ObjectId, ref: 'Topic' }],
    select: false
  }
})

module.exports = model('Question', QuestionSchema)