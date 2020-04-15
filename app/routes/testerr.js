const Router = require('koa-router')
const router = new Router({prefix: '/testerr'})

router.get('/', ctx=>{
  ctx.body = `<h1>这是测试错误的页面</h1>`
})

router.get('/412', ctx=>{
  ctx.throw(412)
})

router.get('/500', ctx=>{
  a.b
  ctx.body = 'haha'
})

module.exports = router