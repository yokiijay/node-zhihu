const Router = require('koa-router')
const router = new Router({prefix: '/users'})
const users = require('../controllers/users')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../../config')
const jwt = require('koa-jwt')

const auth = jwt({secret})

router.get('/', users.findByQuery, users.find)

router.get('/:id', users.findById)

router.patch('/:id', auth, users.checkOwner, users.updateById)

router.post('/', users.create)

router.delete('/:id', auth, users.checkOwner, users.deleteById)

router.post('/login', users.login)

router.get('/:id/following', users.listFollowing)

router.put('/following/:id', auth, users.follow)

module.exports = router