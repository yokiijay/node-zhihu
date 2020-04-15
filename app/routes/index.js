const fs = require('fs')

module.exports = app =>{
  const files = fs.readdirSync(__dirname)
  files.forEach(file=>{
    if(file === 'index.js') return
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}