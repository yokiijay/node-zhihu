const Koa = require('koa')
const app = new Koa()
const routing = require('./routes')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const bodyparser = require('koa-bodyparser')
const body = require('koa-better-body')

/* -------------------------- middleware -------------------------- */
// app.use(async (ctx, next) => {
//   try {
//     await next()
//   }catch (err){
//     ctx.status = err.status || err.statusCode || 500
//     ctx.body = {
//       message: err.message
//     }
//   }
// })

app.use(error({
  postFormat: (err, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

app.use(parameter(app))

// app.use(bodyparser())
app.use(body())

/* -------------------------- routing -------------------------- */
routing(app)

/* -------------------------- listen -------------------------- */
const PORT = (process.env.PORT = 5000)
app.listen(PORT, () => console.log(`server running at ${PORT}`))
