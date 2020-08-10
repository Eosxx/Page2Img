const puppeteer = require('puppeteer')

class Browser {
  constructor () {
    this.browser = null

    this.init()
  }

  async init () {
    this.browser = await puppeteer.launch({
      ignoreHTTPSErrors: true, // 是否在导航期间忽略 HTTPS 错误. 默认是 false。
    })
  }
  /**
   * 截图
   * @param  {String} options.url    目标网站
   * @param  {Number} options.width  屏幕宽度，也代表了图片宽度
   * @param  {Number} options.height 屏幕高度，小于等于图片高度
   * @return {Buffer}                截图的buffer
   */
  async screenshot ({
    url, width = 1366, height = 768
  }) {
    const browser = this.browser
    const page = await browser.newPage()

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

    await page.setViewport({
      width,
      // 因为notion的页面结构设计问题，内容并不会撑起html的高度，
      // 所以如果是notion的页面，这里需要更改数值，否则可能出现内容缺失问题。
      height
    })
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
    const img = await page.screenshot({
      type: 'png', // 即使是质量100的jpeg，也不如png，所以这里建议用png。
      fullPage: true, // 如果设置为true，则对完整的页面（需要滚动的部分也包含在内）。默认是false
      // path: 'img.png', // 截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
      // quality: 100, // 图片质量, 可选值 0-100. png 类型不适用。
    })

    page.close()

    return img
  }

}

module.exports = Browser
