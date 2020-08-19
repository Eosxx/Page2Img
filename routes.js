const Router = require('koa-router')
const Browser = require('./browser')

const router = new Router()
const browser = new Browser() // 浏览器对象

// 返回图片
router.get('/img', async ctx => {
  const query = ctx.query
  ctx.type = 'image/png'


  const selector = query.s.replace(/@/g, '#')

  ctx.body = await browser.getImg({
    target: query.url,
    width: query.w,
    height: query.h,
    selector: selector,
    queryString: ctx.querystring
  })
})

module.exports = router
