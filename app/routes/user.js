const Router = require('koa-router')
const router = new Router({prefix: '/user'})
const UserController = require('../controllers/user')

router.get('/', ctx=>{
  UserController.find(ctx)
})

router.get('/:id', ctx=>{
  UserController.findById(ctx)
})

router.put('/:id', ctx=>{
  UserController.put(ctx)
})

router.post('/', ctx=>{
  UserController.create(ctx)
})

router.delete('/:id', ctx=>{
  UserController.deleteById(ctx)
})

module.exports = router