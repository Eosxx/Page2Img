const Router = require('koa-router')
const Browser = require('./browser')
const {getFile} = require('./filesSys')
require('dotenv').config()
const envs = process.env

const router = new Router()
const browser = new Browser() // 浏览器对象

// 返回图片
router.get('/img', async ctx => {
  ctx.set('Cache-Control', 'public, max-age=300')

  // 读取到缓存直接返回
  if (ctx.response.get('X-Koa-Cache') === 'true' && ctx.state.data.path) {
    ctx.type = 'image/png'
    ctx.body = getFile(ctx.state.data.path)

    return
  }

  const query = ctx.query

  // 将css选择器的#用$替换
  const selector = query.s && query.s.replace(/\$/g, '#')

  ctx.body = await browser.getImg({
    target: query.url,
    width: query.w,
    height: query.h,
    selector: selector,
    queryString: ctx.querystring
  }).then(res => {
    ctx.state.data = {
      fileName: res.fileName,
      path: res.path,
      updated: res.updated
    }
    ctx.type = 'image/png'
    return res.img
  }, err => {
    console.error(err)
    return err.stack
  })
})

module.exports = router
