const Router = require('koa-router')
const router = new Router({prefix: '/user'})
const userController = require('../controllers/user')
const UserModel = require('../models/UserModel')

router.get('/', userController.find)

router.get('/:id', ctx=>{
  userController.findById(ctx)
})

router.put('/:id', ctx=>{
  userController.put(ctx)
})

router.post('/', userController.create)

router.delete('/:id', ctx=>{
  userController.deleteById(ctx)
})

module.exports = router