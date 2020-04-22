const QuestionModel = require('../models/QuestionModel')
const UserModel = require('../models/UserModel')
const TopicModel = require('../models/TopicModel')

class QuestionController {
  async createQuestion(ctx){
    const question = await new QuestionModel({...ctx.request.body, questioner: ctx.state.user._id}).save()
    ctx.body = question
  }

  async getQuestions(ctx){
    let { page=1, perPage=5 } = ctx.query
    page = Math.max(page, 1)
    perPage = Math.max(perPage, 1)

    delete ctx.query.page
    delete ctx.query.perPage

    const questions = await QuestionModel.find(ctx.query).limit(perPage).skip(perPage*(page-1)).select(ctx.state.select)

    if(!questions) ctx.throw(404, '目前还没有提问哦')
    const count = await QuestionModel.estimatedDocumentCount()
    ctx.body = {
      questions,
      page,
      haveMore: perPage*page < count
    }
  }

  async filterFields(ctx, next) {
    const { fields = '' } = ctx.query
    const select = '+' + fields.replace(/\;/g, ' +')
    ctx.state.select = select
    delete ctx.query.fields
    await next()
  }

  async deleteQuestion(ctx){
    const question = await QuestionModel.findByIdAndDelete(ctx.params.id)
    if(!question) ctx.throw(404, '该提问不存在')
    ctx.status = 204
  }

  async getTopics(ctx){
    const {topics} = await QuestionModel.findById(ctx.params.id).populate('topics')
    
    if(topics&&topics.length){
      ctx.body = topics
    }else {
      ctx.throw(404, '该提问没有添加话题')
    }
  }
}

module.exports = new QuestionController()