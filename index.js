const Koa = require('koa')
const router = require('./routes')
require('dotenv').config()
const envs = process.env

const host = envs.HOST || '127.0.0.1'
const port = envs.PORT || 8080

const app = new Koa()
app.use(router.routes())

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
