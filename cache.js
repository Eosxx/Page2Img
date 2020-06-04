const Lru = require('lru-cache');

module.exports = function(app, options = {}) {

  const { prefix = 'koa-cache:', expire = options.expire, maxLength = Infinity } = options

  const globalCache = {
    get: null,
    set: null
  }

  const pageCache = new Lru({
    maxAge: expire * 1000, // ms
    max: maxLength,
  })

  app.context.cache = {
    get: (key) => {
      if (key) {
        let value = pageCache.get(key)
        if (value) {
          value = value + ''
        }
        return value
      }
    },
    set: (key, value) => {
      if (!value || value === 'undefined') {
        value = ''
      }
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      if (key) {
        return pageCache.set(key, value)
      }
    },
    globalCache: globalCache
  }
  globalCache.get = (key) => {
    if (key) {
      return pageCache.get(key)
    }
  }
  globalCache.set = (key, value) => {
    if (!value || value === 'undefined') {
      value = ''
    }
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    if (key) {
      return pageCache.set(key, value)
    }
  }

  async function getCache(ctx, key) {
    const value = await globalCache.get(key)
    let ok = false

    if (value) {
      ctx.response.status = 200

      ctx.response.set({
        'X-Koa-Cache': 'true',
      })

      try {
        ctx.state.data = JSON.parse(value)
      } catch (e) {
        ctx.state.data = {}
      }
      ok = true
    }

    return ok
  }

  async function setCache(ctx, key) {
    if (ctx.response.get('Cache-Control') !== 'no-cache' && ctx.state && ctx.state.data) {
      const body = JSON.stringify(ctx.state.data)
      await globalCache.set(key, body)
    }
  }

  return async function cache(ctx, next) {
    const url = ctx.request.url
    const key = prefix + url

    let ok = false
    try {
      ok = await getCache(ctx, key)
    } catch (e) {
      ok = false
    }

    await next()

    if (ok) {
      return
    }

    try {
      setCache(ctx, key)
    } catch (e) {
      //
    }
  }
}
