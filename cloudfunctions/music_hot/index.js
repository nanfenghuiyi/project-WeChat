//向qq音乐发送请求，获取qq音乐 搜索
// 1.引入第三方ajan库
var rq = require('request-promise')

// 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

//2.创建main函数
exports.main = async (event, context) => {
  //3.创建变量 url 请求地址
  var url = `https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg`
  // 4.请求rq函数发送请求并且将数据返回
  return rq(url).then(res => { return res })
    .catch(err => { console.log(err) })
}