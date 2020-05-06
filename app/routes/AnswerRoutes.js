const Router = require('koa-router')
const router = new Router({prefix: '/questions/:questionId/answers'})
const jwt = require('koa-jwt')
const { secret } = require('../../config')
const answer = require('../controllers/AnswerController')

const auth = jwt({secret})

router.get('/', answer.getAnswers)

router.post('/', auth, answer.createAnswer)

module.exports = router