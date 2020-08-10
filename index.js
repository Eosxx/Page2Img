const Koa = require('koa')
const router = require('./routes')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080

const app = new Koa()
app.use(router.routes())

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
