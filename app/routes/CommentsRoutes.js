const Router = require('koa-router')
const router = new Router({prefix: '/questions/:questionId/answers/:answerId/comments'})
const comments = require('../controllers/CommentsController')
const { secret } = require('../../config')
const jwt = require('koa-jwt')
const auth = jwt({secret})

router.post('/', auth, comments.createComment)

router.get('/', comments.getComments)

router.delete('/:commentId', auth, comments.deleteComment)

module.exports = router