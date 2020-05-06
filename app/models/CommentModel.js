const { Schema, model, SchemaTypes: { ObjectId } } = require('mongoose')

const CommentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  commentator: { type: ObjectId, ref: 'User', required: true },
  questionId: { type: String, required: true },
  answerId: { type: String, required: true },
  rootCommentId: { type: String },
  replyTo: { type: ObjectId, ref: 'User' }
})

module.exports = model('Comment', CommentSchema)