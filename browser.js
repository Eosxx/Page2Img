const puppeteer = require('puppeteer')
const {MD5, createTmpDir} = require('./filesSys')
const path = require('path')

class Browser {
  constructor (opt) {
    this.browser = null
    this.tempDir = './tmp/'

    this.init()
    this.createTempDir()
  }

  async init () {
    this.browser = await puppeteer.launch({
      ignoreHTTPSErrors: true, // 是否在导航期间忽略 HTTPS 错误. 默认是 false。
    })
  }
  createTempDir () {
    this.tempDir = createTmpDir()
    console.info(`create directory ${this.tempDir}`)
  }
  /**
   * 截图
   * @param  {String} options.target   目标网站
   * @param  {Number} options.width    屏幕宽度，图片最大宽度
   * @param  {Number} options.height   屏幕高度，图片最大高度
   * @param  {String} options.fileName 文件名
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

    const filePath = path.resolve(__dirname, this.tempDir, `${fileName}.png`)

    const img = await elm.screenshot({
      type: 'png', // 即使是质量100的jpeg，也不如png，所以这里建议用png。
      fullPage: isFullPage, // 如果设置为true，则对完整的页面（需要滚动的部分也包含在内）。默认是false
      path: filePath, // 截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
      // quality: 100, // 图片质量, 可选值 0-100. png 类型不适用。
    })

    page.close()

    return {
      fileName: fileName,
      path: filePath,
      updated: Date.now(),
      img
    }
  }
  /**
   * 获取截图
   * @param  {String} options.target   目标网站
   * @param  {Number} options.width    屏幕宽度，图片最大宽度
   * @param  {Number} options.height   屏幕高度，图片最大高度
   * @param  {String} options.fileName 文件名
   */
  async getImg ({
    target, width, height, queryString, selector
  }) {
    const md5 = MD5(queryString)

    // width必需是大于0的数字
    width = parseInt(width) || 1366

    // height必需是大于0的数字
    height = parseInt(height) || 768

    return await this.screenshot({
      target,
      width,
      height,
      fileName: md5,
      selector
    })
  }
}

module.exports = Browser
