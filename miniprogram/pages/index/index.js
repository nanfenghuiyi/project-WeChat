// pages/list/list.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    navbar: ['排行榜', '搜索'],
    currentTab: 0,
    music_list: [],
    music_item: [],
    searchlist: [],
    itemId: 0,
    pageSize: 3,
    searchPage: 1,
    searchSize: 10,
    keyword: '',
    clearShow: false,//动态清除图框
    hotlist: [],
    searchLoading: false,
    searchLoadingComplete: false
  },
  // 顶部导航切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    this.keywordclear()
    // console.log(this.data.currentTab)
  },
  //排行榜
  toplistTap: function (e) {
    //获取自定义属性
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    console.log(title)
    // console.log(id)
    //保留跳转，可以返回
    wx.navigateTo({
      url: '/pages/list/list?lid=' + id + '&title=' + title
    })
  },
  //查询排行榜分类
  selectAll() {
    db.collection("music_list").get()
    .then(res => {
      var data = res.data
      // console.log(data)
      var ids=[];
      for (let p of data) {
        // console.log(p)
        let id = p.id;
        //排行榜查询
        ids.push(id)
      }
      console.log(ids);
      // 1.调用云函数music_items
      wx.cloud.callFunction({
        name: 'music_item_3',
        data: {
          id: ids
        }
      }).then(res => {
        // console.log(res)
        //将字符串转为json对象
        var obj = JSON.parse(res.result)
        console.log(obj)
        this.setData({
          music_list: obj,
        })
      }).catch(err => { console.log(err); })
      this.setData({
        music_item: res.data
      })
    })
    .catch(err => { console.log(err) })
  },
  //获取搜索框中的内容
  keywordInput: function (e) {
    let keyword = e.detail.value;
    // console.log(keyword)
    this.setData({
      keyword: keyword,
      clearShow: false
    })
  },
  //清空搜索框
  keywordclear: function () {
    // console.log("点击清除")
    this.setData({
      clearShow: true,
      // keyword:'',
      searchKeyword: '',
      searchlist: [],
      searchLoading: false,
      searchLoadingComplete: false
    })
    this.keywordSearch()
    this.loadMore()
  },
  //搜索
  keywordSearch: function () {
    // console.log(this.data.keyword.length)
    if (this.data.keyword.length > 0 && !this.data.clearShow) {
      let keyword = encodeURIComponent(this.data.keyword)
      // 调用云函数music_search
      wx.cloud.callFunction({
        name: 'music_search',
        data: {
          searchkeyword: keyword,
          searchPage: this.data.searchPage,
          searchSize: this.data.searchSize
        }
      }).then(res => {
        // console.log(res.result)
        console.log(this.data.keyword)
        //将字符串转为json对象
        var obj = JSON.parse(res.result)
        var rows = obj.data.list
        // console.log(rows)
        //将音乐列表拼接操作
        rows = this.data.searchlist.concat(rows)
        // console.log(rows)
        // console.log(this.data.searchPage)
        if (rows.length != 0) {
          //保存音乐列表数据
          this.setData({
            searchlist: rows,
            searchLoading: true,
            clearShow: true
          })
        }
        // console.log(111)
        // console.log(obj.data)
      }).catch(err => { console.log(err) })
    } else {
      // console.log('输入框内容已清除')
      this.setData({
        clearShow: false
      })
    }
  },
  //滚动到底部触发事件
  searchScrollLower() {
    if (this.data.searchlist.length < 200) {
      console.log("到底了")
      this.keywordSearch()
      this.setData({
        searchPage: this.data.searchPage + 1
      })
    } else {
      this.setData({
        searchLoading: false,
        searchLoadingComplete: true
      })
    }
  },
  //选中要播放的歌曲
  playsongTap(e) {
    //获取自定义属性
    var data = e.currentTarget.dataset.data;
    data = JSON.stringify(data)
    // console.log(data)
    //保留跳转，可以返回
    wx.navigateTo({
      url: '/pages/songplay/songplay?data=' + encodeURIComponent(data)
    })
    this.setData({
      clearShow: false
    })
    console.log(this.clearShow)
  },
  //热门搜索
  loadMore() {
    // 调用云函数music_hot
    wx.cloud.callFunction({
      name: 'music_hot',
    }).then(res => {
      // console.log(res.result)
      //将字符串转为json对象
      var obj = JSON.parse(res.result)
      var rows = obj.data.hotkey
      // console.log(rows)
      //保存音乐列表数据
      this.setData({
        hotlist: rows,
        clearShow: false
      })
      // console.log(111)
      // console.log(obj.data)
    }).catch(err => { console.log(err) })
  },
  //热门数据点击事件
  hotkeyTap: function (e) {
    let word = e.currentTarget.dataset.text;
    this.setData({
      keyword: e.currentTarget.dataset.text,
      searchKeyword: e.currentTarget.dataset.text
    });
    this.keywordSearch();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectAll()
    this.loadMore()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})