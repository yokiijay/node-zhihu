const Router = require('koa-router')
const router = new Router({prefix: '/topics'})
const topics = require('../controllers/TopicsController')

router.get('/', topics.getTopicsByQuery)

router.get('/:id', topics.getTopicById)

router.post('/', topics.checkTopicDuo, topics.createTopic)

router.delete('/:id', topics.checkTopicExist, topics.deleteTopic)

router.patch('/:id', topics.updateTopic)

module.exports = router