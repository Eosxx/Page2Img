const Koa = require('koa')
const router = require('./routes')
const cache = require('./cache')

require('dotenv').config()
const envs = process.env

const host = envs.HOST || '127.0.0.1'
const port = envs.PORT || 8080

const app = new Koa()

app.use(cache(app, {
  expire: parseInt(envs.EXPIRE) || 3600 // 秒
}))

app.use(router.routes())


app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
