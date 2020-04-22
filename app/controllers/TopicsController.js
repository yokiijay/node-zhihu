const TopicModel = require('../models/TopicModel')
const UserModel = require('../models/UserModel')

class TopicsController {
  async getTopicsByQuery(ctx) {
    let { fields = '', perPage=5, page=1 } = ctx.query
    // 字段过滤
    const select = fields.replace(/\;/g, ' +')
    delete ctx.query.fields
    delete ctx.query.perPage
    delete ctx.query.page

    // 页面计数
    perPage = Math.max(perPage, 1)
    page = Math.max(page, 1)

    const topics = await TopicModel.find(ctx.query).limit(perPage).skip(perPage*(page-1)).select('+' + select)

    if (!topics) ctx.throw(404, '话题不存在')
    const count = await TopicModel.estimatedDocumentCount()
    ctx.body = {
      topics,
      page,
      haveMore: perPage*page < count
    }
  }

  async getAllTopics(ctx, next){
    const {fields='', q, perPage, page} = ctx.query
    if(q || perPage || page){
      await next()
    }else {
      const select = '+'+fields.replace(';', ' +')
      const topics = await TopicModel.find().select(select)
      ctx.body = topics
    }
  }

  async searchAllTopics(ctx,next){
    const {fields='', q, perPage, page} = ctx.query
    const select = '+'+fields.replace(';', ' +')

    const regex = new RegExp(`${q}`, 'g')

    if(q){
      const topics = await TopicModel.find({$or: [
        {name: {$regex: regex}},
        {introduction: {$regex: regex}}
      ]}).select(select)

      ctx.body = topics
    }else {
      await next()
    }

  }

  async getTopicById(ctx) {
    const { fields = '' } = ctx.query
    const select = fields.replace(/\;/g, ' +')
    const topic = await TopicModel.findById(ctx.params.id).select('+' + select)
    if (!topic) ctx.throw(404, '话题不存在')
    ctx.body = topic
  }

  async checkTopicExist(ctx, next) {
    const topic = await TopicModel.findById(ctx.params.id)
    if (!topic) ctx.throw(404, '话题不存在')
    await next()
  }

  async checkTopicDuo(ctx, next) {
    const topic = await TopicModel.findOne({ name: ctx.request.body.name })
    if (topic) ctx.throw(409, '该话题已存在')
    await next()
  }

  async createTopic(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      }
    })
    const topic = await new TopicModel(ctx.request.body).save()
    ctx.body = topic
  }

  async deleteTopic(ctx) {
    await TopicModel.findByIdAndDelete(ctx.params.id)
    ctx.status = 204
  }

  async updateTopic(ctx) {
    const topic = await TopicModel.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    )
    ctx.body = topic
  }

  async getFollowers(ctx){
    const users = await UserModel.find({ followingTopics: ctx.params.id })
    if(!users||!users.length) return ctx.throw(404, '目前没有人关注该话题')
    ctx.body = users
  }

  async getFollowedTopics(ctx){
    const users = await UserModel.find({ followingTopics: {  $exists: true, $not: {$size: 0} } }).populate('followingTopics')
    const topics = []
    users.forEach(item=>{
      item.followingTopics.forEach(item=>{
        topics.push(item)
      })
    })

    if(!users||!users.length) ctx.throw(404, '没有被关注的话题')
    ctx.body = topics
  }
}

module.exports = new TopicsController()
