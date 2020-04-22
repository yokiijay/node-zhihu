const Router = require('koa-router')
const router = new Router({prefix: '/questions'})
const question = require('../controllers/QuestionController')
const jwt = require('koa-jwt')
const { secret } = require('../../config')

const auth = jwt({secret})

router.post('/', auth, question.createQuestion)

router.get('/', question.filterFields, question.getQuestions)

router.delete('/:id', question.deleteQuestion)

router.get('/:id/topics', question.getTopics)

module.exports = router