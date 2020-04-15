const Router = require('koa-router')
const router = new Router({prefix: '/data'})
const MongoClient = require('mongodb').MongoClient

module.exports = router