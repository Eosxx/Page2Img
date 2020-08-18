const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// 读取文件数据
function getFile (filePath) {
  const fullpath = path.resolve(__dirname, filePath)

  const buffer = fs.readFileSync(fullpath)

  return buffer
}

function MD5 (data) {
  const md5 = crypto.createHash('md5')
  return md5.update(data).digest('hex')
}

module.exports = {getFile, MD5}

