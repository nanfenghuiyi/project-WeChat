
// pages/index/index.js

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    // 3.保存数据
    list: [],
    musicid:0,
    musictitle:'',
    pageSize:15,
    page:0
  },
  //点击跳转页面
  playsong: function (e) {
    // console.log(123)
    //获取自定义属性
    var data = e.currentTarget.dataset.data;
    data = JSON.stringify(data)
    // console.log(data)
    //保留跳转，可以返回
    wx.navigateTo({
      url: '/pages/songplay/songplay?data=' +encodeURIComponent(data)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  loadMore() {
    var id = this.data.musicid;
    console.log(this.data.list)
    // var title = this.data.musictitle
    // console.log(id);
    // 1.调用云函数music_item`
    wx.cloud.callFunction({
      name: 'music_item',
      data: {
        id: id,
        pageSize: this.data.pageSize,
        page: this.data.page
      }
    }).then(res => {
      //将字符串转为json对象
      var obj = JSON.parse(res.result)
      //保存音乐列表数据
      console.log(obj)
      var rows = obj.data
      // console.log(rows)
      //将音乐列表拼接操作
      rows = this.data.list.concat(rows)
      // console.log(rows)
      //将拼接后结果保存起来
      this.setData({
        list: rows
      })
      // console.log(111)
      // console.log(obj.data)
    }).catch(err => { console.log(err) })
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    //将音乐列表组件传递参数 id
    //保存data中musicid
    this.setData({
      musicid: options.lid,
      musictitle:options.title
    });
    this.loadMore();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //发送请求加载下一页数据
    this.setData({
      page: this.data.page + 1
    })
    // console.log(this.data.page)
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})