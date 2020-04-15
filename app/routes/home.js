const Router = require('koa-router')
const router = new Router({prefix: '/home'})
const HomeController = require('../controllers/home')

router.get('/', ctx=>{
  HomeController.showIndexPage(ctx)
})

module.exports = router