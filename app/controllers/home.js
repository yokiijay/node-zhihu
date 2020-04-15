class HomeController {
  showIndexPage(ctx){
    ctx.body = `<h1>这是Home主页</h1>`
  }
}

module.exports = new HomeController()