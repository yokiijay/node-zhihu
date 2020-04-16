const UserModel = require('../models/UserModel')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../../config')

class UsersController {

  async find(ctx){
    ctx.body = await UserModel.find()
  }

  async findById(ctx){
    try {
      const user = await UserModel.findById(ctx.params.id)
      if(!user) ctx.throw(404, '用户不存在')
      ctx.body = user
    }catch (err){
      ctx.throw(404, '用户不存在')
    }
  }

  async findByQuery(ctx){
    const users = await UserModel.find(ctx.query)
    ctx.body = users
  }

  async updateById(ctx){
    try {
      const user = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      if(!user) { ctx.throw(404, '用户不存在') }
      ctx.body = user
    }catch (err){
      ctx.throw(404, '用户不存在')
    }
  }

  async create(ctx){
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      age: {
        type: 'number',
        required: true
      }
    })
    const {name} = ctx.request.body
    const userExist = await UserModel.findOne({name})
    if(userExist) ctx.throw(409, '该用户名已存在')
    const user = await new UserModel(ctx.request.body).save()
    ctx.body = user
  }

  async deleteById(ctx){
    try {
      const user = await UserModel.findByIdAndDelete(ctx.params.id)
      if(!user) { ctx.throw(404, '用户不存在') }
      ctx.status = 204
    } catch(err) {
      ctx.throw(404, '用户不存在')
    }
  }

  async login(ctx){
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })

    const user = await UserModel.findOne(ctx.request.body)
    if(!user) ctx.throw(401, '用户名或密码不正确')

    const token = jsonwebtoken.sign({_id: user._id, name: user._name}, secret, {expiresIn: '1d'})

    ctx.body = { token }
  }

  async checkOwner(ctx, next){
    if(ctx.params.id !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }
  
}

module.exports = new UsersController()