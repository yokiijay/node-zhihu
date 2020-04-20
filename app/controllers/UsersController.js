const UserModel = require('../models/UserModel')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../../config')

class UsersController {
  async getAllUsers(ctx) {
    ctx.body = await UserModel.find()
  }

  async getUserById(ctx) {
    try {
      const populate = ctx.state.select.replace('+', '')
      const user = await UserModel.findById(ctx.params.id).select(ctx.state.fields).populate(populate)
      if (!user) ctx.throw(404, '用户不存在')
      ctx.body = user
    } catch (err) {
      ctx.throw(404, '用户不存在')
    }
  }

  async filterFields(ctx, next) {
    const { fields = '' } = ctx.query
    const select = '+' + fields.replace(/\;/g, ' +')
    ctx.state.select = select
    delete ctx.query.fields
    await next()
  }

  async getUserByQuery(ctx) {
    const populate = ctx.state.select.replace(/\+/g, '')
    const users = await UserModel.find(ctx.query)
    .select(ctx.state.select)
    .populate(populate)
    ctx.body = users
  }

  async updateUser(ctx) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body
      )
      if (!user) {
        ctx.throw(404, '用户不存在')
      }
      ctx.body = user
    } catch (err) {
      ctx.throw(403, err.message)
    }
  }

  async createUser(ctx) {
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
    const { name } = ctx.request.body
    const userExist = await UserModel.findOne({ name })
    if (userExist) ctx.throw(409, '该用户名已存在')
    const user = await new UserModel(ctx.request.body).save()
    ctx.body = user
  }

  async deleteUserById(ctx) {
    try {
      const user = await UserModel.findByIdAndDelete(ctx.params.id)
      if (!user) {
        ctx.throw(404, '用户不存在')
      }
      ctx.status = 204
    } catch (err) {
      ctx.throw(404, '用户不存在')
    }
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })

    const user = await UserModel.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名或密码不正确')

    const token = jsonwebtoken.sign(
      { _id: user._id, name: user._name },
      secret,
      { expiresIn: '1d' }
    )

    ctx.body = { token }
  }

  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }

  async checkUserExist(ctx, next) {
    const user = await UserModel.findById(ctx.params.id)
    if (!user) ctx.throw(403, '用户不存在')
    await next()
  }

  async getFollowings(ctx) {
    try {
      const user = await UserModel.findById(ctx.params.id)
        .select('+following')
        .populate('following')
      ctx.body = user.following
    } catch (err) {
      ctx.throw(404, '用户不存在')
    }
  }

  async follow(ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+following')
    const isExist = me.following.find((item) => {
      return item.toString() === ctx.params.id
    })
    const isUser = await UserModel.findById(ctx.params.id)
    if (!isExist && isUser) {
      me.following.push(ctx.params.id)
      await me.save()
      ctx.status = 204
    } else if (!isUser) {
      ctx.throw(403, '要关注的用户不存在')
    } else {
      {
        ctx.throw(403, '不能重复关注')
      }
    }
  }

  async unfollow(ctx) {
    const user = await UserModel.updateOne(
      { _id: ctx.state.user._id },
      { $pull: { following: ctx.params.id } }
    )
    if (user.nModified) {
      ctx.status = 204
    } else {
      ctx.throw(403, '用户不存在')
    }
  }

  async getFollowers(ctx) {
    const users = await UserModel.find({ following: ctx.params.id })
    ctx.body = users
  }
}

module.exports = new UsersController()
