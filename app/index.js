const path = require('path')
const Koa = require('koa')
const app = new Koa()
const routing = require('./routes')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const koaBody = require('koa-body')
const mongoose = require('mongoose')
const static = require('koa-static')

/* -------------------------- Database -------------------------- */
const { mongodbURL } = require('../config')
mongoose.connect(
  mongodbURL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) throw err
    console.log('mongodb connected')
  }
)
mongoose.connection.on('error', console.error)

/* -------------------------- middleware -------------------------- */

app.use(static(path.join(__dirname, 'public')))

app.use(
  error({
    postFormat: (err, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  })
)

app.use(parameter(app))

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true
  }
}))

/* -------------------------- routing -------------------------- */
routing(app)

/* -------------------------- listen -------------------------- */
const PORT = (process.env.PORT = 5000)
app.listen(PORT, () => console.log(`server running at ${PORT}`))
