const Router = require('koa-router')
const router = new Router({prefix: '/users'})
const users = require('../controllers/users')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../../config')
// const jwt = require('koa-jwt')

const auth = async (ctx, next)=>{
  // 从请求头中获取token
  const { authorization='' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  try {
    // 解析认证token
    const user = jsonwebtoken.verify(token, secret)
    // 通过 设置用户信息
    ctx.state.user = user
  }catch (err) {
    // 不通过
    ctx.throw(401, err.message) //未登录
  }

  await next()
}

router.get('/', users.findByQuery, users.find)

router.get('/:id', users.findById)

router.patch('/:id', auth, users.checkOwner, users.updateById)

router.post('/', users.create)

router.delete('/:id', auth, users.checkOwner, users.deleteById)

router.post('/login', users.login)

module.exports = router