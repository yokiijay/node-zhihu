const Router = require('koa-router')
const router = new Router({prefix: '/topics'})
const topics = require('../controllers/TopicsController')

router.get('/', topics.getAllTopics, topics.searchAllTopics, topics.getTopicsByQuery)

router.get('/followedTopics', topics.getFollowedTopics)

router.get('/:id', topics.getTopicById)

router.post('/', topics.checkTopicDuo, topics.createTopic)

router.delete('/:id', topics.checkTopicExist, topics.deleteTopic)

router.patch('/:id', topics.updateTopic)

router.get('/:id/questions', topics.checkTopicExist, topics.getQuestions)
router.get('/:id/followers', topics.checkTopicExist, topics.getFollowers)

module.exports = router