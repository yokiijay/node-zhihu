const { Schema, model, SchemaTypes:{ObjectId} } = require('mongoose')

const AnswerModel = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  answerer: { type: ObjectId, required: true, ref: 'User', required: true, select: false },
  questionId: { type: String, required: true }
})

module.exports = model('Answer', AnswerModel)