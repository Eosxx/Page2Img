const puppeteer = require('puppeteer')
const {getFile, MD5} = require('./filesSys')
// TODO
// 检测目录是否存在
// 配置目录项
class Browser {
  constructor () {
    this.browser = null
    this.schedule = 30 // minute
    this.expires = 60 // minute

    // {
    //   'md5 string': {
    //     fileName: 'mg5 string',
    //     path: 'assets/img.png',
    //     updated: 1234567890
    //   }
    // }
    this.cache = {}

    this.init()
    this.setSchedule()
  }

  async init () {
    this.browser = await puppeteer.launch({
      ignoreHTTPSErrors: true, // 是否在导航期间忽略 HTTPS 错误. 默认是 false。
    })
  }
  /**
   * 截图
   * @param  {String} options.target   目标网站
   * @param  {Number} options.width    屏幕宽度，图片最大宽度
   * @param  {Number} options.height   屏幕高度，图片最大高度
   * @param  {String} options.fileName 文件名
   * @return {Buffer}                  图片
   */
  async screenshot ({
    target, width = 1366, height = 768, fileName, selector
  }) {
    const browser = this.browser
    const page = await browser.newPage()

    await page.setViewport({
      width,
      // 因为notion的页面结构设计问题，内容并不会撑起html的高度，
      // 所以如果是notion的页面，这里需要更改数值，否则可能出现内容缺失问题。
      height
    })
    await page.goto(target, {
      waitUntil: 'networkidle0'
    })

    let elm = page
    let isFullPage = true
    // 根据选择器选取元素
    if (selector) {
      isFullPage = false // 截取部分元素的话，fullPage需要是false
      elm = await page.$(selector)
    }

    const img = await elm.screenshot({
      type: 'png', // 即使是质量100的jpeg，也不如png，所以这里建议用png。
      fullPage: isFullPage, // 如果设置为true，则对完整的页面（需要滚动的部分也包含在内）。默认是false
      path: `tmp/${fileName}.png`, // 截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
      // quality: 100, // 图片质量, 可选值 0-100. png 类型不适用。
    })

    page.close()

    this.cache[fileName] = {
      fileName: fileName,
      path: `tmp/${fileName}.png`,
      updated: Date.now()
    }

    return img
  }
  /**
   * 返回缓存图片
   * @param  {String} fileName 文件名
   * @return {Object}
   */
  getCache (fileName) {
    return this.cache[fileName] || null
  }
  /**
   * 清除缓存
   * @return {[type]} [description]
   */
  clearCache () {
    // TODO
    // 清除缓存同时删除图片
    const expires = this.expires * 60 * 1000 // 缓存时间 ms
    const now = Date.now()
    Object.keys(this.cache).forEach(key => {
      const o = this.cache[key]
      // 如果长时间（大于缓存时间）未更新，则销毁对象
      if (now - o.updated > expires) {
        delete this.cache[key]
      }
    })
  }
  /**
   * 定时运行“清除缓存”程序
   */
  setSchedule () {
    setInterval(() => {
      this.clearCache()
    }, this.schedule * 60 * 1000)
  }
  /**
   * 获取截图
   * @param  {String} options.target   目标网站
   * @param  {Number} options.width    屏幕宽度，图片最大宽度
   * @param  {Number} options.height   屏幕高度，图片最大高度
   * @param  {String} options.fileName 文件名
   * @return {Buffer}                  图片
   */
  async getImg ({
    target, width, height, queryString, selector
  }) {
    const md5 = MD5(queryString)

    const cache = this.getCache(md5)
    if (cache) {
      return getFile(cache.path)
    } else {

      // width必需是大于0的数字
      if (Number(width) > 0) {
        width = Number(width)
      } else {
        width = 1366
      }
      // height必需是大于0的数字
      if (Number(height) > 0) {
        height = Number(height)
      } else {
        height = 768
      }

      return await this.screenshot({
        target,
        width,
        height,
        fileName: md5,
        selector
      })
    }
  }
}

module.exports = Browser
