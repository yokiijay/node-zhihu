const path = require('path')
const Router = require('koa-router')
const router = new Router({ prefix: '/upload' })

router.post('/', (ctx) => {
  const file = ctx.request.files.file
  const basename = path.basename(file.path)
  ctx.body = { path: `${ctx.origin}/uploads/${basename}` }
})

module.exports = router
