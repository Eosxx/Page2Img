# Page2Img

`Page2Img`是一个在服务器端运行`puppeteer`，并将内容以图片形式返回的应用。

## 使用

### 运行

```javascript
npm run start
```

或者使用`pm2`
```javascript
pm2 start npm --name page2img -- run start
```

### 访问

`http://127.0.0.1:8080/img?w=1300&h=600&url=https://github.com/Eosxx/Page2Img`

`http://127.0.0.1:8080/img?url=https://github.com/Eosxx/Page2Img&s=.repository-content%20.gutter-condensed`

### 配置

- HOST: `127.0.0.1`，应用地址。
- PORT:　`8080`，应用监听的端口。
- EXPIRES: `3600`，内容的缓存时间，单位：“秒”。

### 接口

`/img`
  - `url` 截取页面的网址，请带上`https`。建议使用`encodeURIComponent`进行编码，以对`?`等关键字进行编码，保证`url`中的参数能正确传递。
  - `w` 返回的图片的宽度。
  - `h` 返回的图片的高度。应用会把滚动条的部分一起截取，所以高度的设置在大部分情况下表现基本一致。图片的高度将由页面本身的高度决定。
  - `s` 只截取页面中符合css选择器规则的内容。支持css3选择器所有规则，请使用`$`代替ID选择器的`#`。使用此参数时，`w`、`h`会被忽略。

## 注意

- 在一些单页网站上表现可能不佳。
- 基于部分网站的样式问题，比如`html,body,#content{height: 100%}  #content{overflow: auto}`，可能会出现滚动条的内容截取不全的问题。这时候应该把参数`h`的值设置高一些。
