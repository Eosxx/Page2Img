const Router = require('koa-router')
const Browser = require('./browser')
require('dotenv').config()
const envs = process.env

const router = new Router()
const browser = new Browser({
  schedule: parseInt(envs.SCHEDULE),
  expires: parseInt(envs.EXPIRES)
}) // 浏览器对象

// 返回图片
router.get('/img', async ctx => {
  const query = ctx.query

  // 将css选择器的#用@替换
  const selector = query.s && query.s.replace(/@/g, '#')

  ctx.body = await browser.getImg({
    target: query.url,
    width: query.w,
    height: query.h,
    selector: selector,
    queryString: ctx.querystring
  }).then(res => {
    ctx.type = 'image/png'
    return res
  }, err => err.stack)
})

module.exports = router
