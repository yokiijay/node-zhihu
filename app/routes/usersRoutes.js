const Router = require('koa-router')
const router = new Router({prefix: '/users'})
const users = require('../controllers/usersController')
const { secret } = require('../../config')
const jwt = require('koa-jwt')

const auth = jwt({secret})

router.get('/', users.filterFields, users.getUserByQuery)

router.get('/:id', users.filterFields, users.getUserById)

router.patch('/:id', auth, users.checkOwner, users.updateUser)

router.post('/', users.createUser)

router.delete('/:id', auth, users.checkOwner, users.deleteUserById)

router.post('/login', users.login)

router.get('/:id/following', users.getFollowings)

router.get('/:id/followers', users.getFollowers)

router.put('/following/:id', auth, users.follow)

router.delete('/following/:id', auth, users.unfollow)

router.get('/:id/followingTopics', users.getFollowingTopics)

router.put('/followingTopics/:id', auth, users.followTopic)

router.get('/:id/questions', users.getUserQuestions)
router.delete('/followingTopics/:id', auth, users.unfollowTopic)

module.exports = router