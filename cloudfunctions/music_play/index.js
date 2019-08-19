//向qq音乐发送请求，获取qq音乐 歌曲详情
// 1.引入第三方ajan库 
var rq = require('request-promise')

// 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

//2.创建main函数
exports.main = async (event, context) => {
  //3.创建变量 url 请求地址
  var songurl = `https://v1.itooi.cn/tencent/song?id=${event.id}`;
  // var playurl = `https://v1.itooi.cn/tencent/url?id=${event.id}&quality=128`;
  // var lrcurl = `https://v1.itooi.cn/tencent/lrc?id=${event.id}`;
  // var picurl = `https://v1.itooi.cn/tencent/pic?id=${event.id}`;
  // var allurl = [ songurl, playurl, lrcurl, picurl]
  // 4.请求rq函数发送请求并且将数据返回
  return rq(songurl).then(res => { return res })
    .catch(err => { console.log(err) })
}