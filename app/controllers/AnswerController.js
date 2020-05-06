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
      ...(q ? {content: { $regex: new RegExp(`${q}`,'ig') }} : null)
    })
    .limit(perPage)
    .skip(perPage * (page - 1))

    if(!answers.length) ctx.throw(404, '该问题没有找到答案')

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

  async checkAnswerExist(ctx, next){
    const answer = await AnswerModel.findById(ctx.params.id).select('+answerer')
    if(!answer) ctx.throw(404, '答案不存在')
    if(ctx.params.questionId && ctx.params.questionId !== answer.questionId){
      ctx.throw(404, '该问题下没有此答案')
    }
    ctx.state.answer = answer
    await next()
  }
}

module.exports = new AnswerController()
