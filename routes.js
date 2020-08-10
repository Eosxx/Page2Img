const Router = require('koa-router')
const router = new Router()
const Browser = require('./browser')

const browser = new Browser() // 浏览器对象

// 返回图片
router.get('/img', async ctx => {
  const query = ctx.query

  ctx.type = 'image/png'

  ctx.body = await browser.screenshot({
    url: query.url,
    width: query.w,
    height: query.h
  })
})

module.exports = router
