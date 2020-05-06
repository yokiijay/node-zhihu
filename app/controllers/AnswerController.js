const AnswerModel = require('../models/AnswerModel')
const QuestionModel = require('../models/QuestionModel')
const UserModel = require('../models/UserModel')

class AnswerController {
  async getAnswers(ctx) {
    let { page = 1, perPage = 10 } = ctx.query
    const { q = '' } = ctx.query

    page = Math.max(page, 1)
    perPage = Math.max(perPage, 1)

    const answers = await AnswerModel.find({
      questionId: ctx.params.questionId,
      ...(q ? {content: { $regex: new RegExp(`${q}`,'g') }} : null)
    })
    .limit(perPage)
    .skip(perPage * (page - 1))

    const count = await AnswerModel.estimatedDocumentCount()
    ctx.body = {
      answers,
      page,
      hasMore: page * perPage < count
    }
  }

  async createAnswer(ctx) {
    const { content } = ctx.request.body
    const anwser = await new AnswerModel({
      content,
      answerer: ctx.state.user._id,
      questionId: ctx.params.questionId
    }).save()
    ctx.body = anwser
  }
}

module.exports = new AnswerController()
