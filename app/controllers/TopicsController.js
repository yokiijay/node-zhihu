const TopicModel = require('../models/TopicModel')

class TopicsController {
  async getTopicsByQuery(ctx) {
    const topics = await TopicModel.find(ctx.query)
    if (!topics) ctx.throw(404, '话题不存在')
    ctx.body = topics
  }

  async getTopicById(ctx) {
    const { fields } = ctx.query
    const select = fields.replace(/\;/g,' +')
    const topic = await TopicModel.findById(ctx.params.id).select('+'+select)
    if (!topic) ctx.throw(404, '话题不存在')
    ctx.body = topic
  }

  async checkTopicExist(ctx, next) {
    const topic = await TopicModel.findById(ctx.params.id)
    if (!topic) ctx.throw(403, '话题不存在')
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
}

module.exports = new TopicsController()
