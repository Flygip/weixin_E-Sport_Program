// miniprogram/pages/my_publish/my_publish.js
const app = getApp()
var _id = app.globalData.user_id
const db = wx.cloud.database()
const matchCollection = db.collection('match')
const sports_publish = db.collection('sports_publish')
const circle_publish = db.collection('circle_publish')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: true,
    open1: false,
    open2:false,
    item_show0: true,
    item_show1: false,
    item_show2: false,
    showModal: false,
    showMatch: false
  },
  /**
   *  展示最近浏览的函数
   */
  appoint: function () {
    wx.showLoading({
      title: '加载中……',
    })
    // console.log(app.globalData.user_id)
    sports_publish.where({ _openid: app.globalData._openid}).get({
      success: res => {
        // console.log(res)
        wx.hideLoading()
          this.setData({
            open1: false,
            open2: false,
            open: true,
            item_show0: true,
            item_show1: false,
            item_show2: false,
            bool_show: false,
            find_partner:res.data
          })
      }
    })
  },
  match: function () {
    wx.showLoading({
      title: '加载中……',
    })
    // console.log(_id)
    matchCollection.where({ _openid: app.globalData._openid }).count({
      success: res => {
        // console.log(res)
        if (res.total) {
          matchCollection.where({ _openid: app.globalData._openid }).get({
            success: res => {
              console.log(res)
              wx.hideLoading()
              this.setData({
                open1: true,
                open2: false,
                open: false,
                item_show0: false,
                item_show1: true,
                item_show2: false,
                bool_show:false,
                match: res.data
              })
            }
          })
        } else {
          wx.hideLoading()
          this.setData({
            open1: true,
            open2: false,
            open: false,
            item_show0: false,
            item_show1: false,
            item_show2: false,
            bool_show: true,
          })
        }
      }
    })
    // matchCollection.where({ _openid: app.globalData._openid }).get({
    //   success: res => {
    //     // console.log(res)
    //     wx.hideLoading()
    //     this.setData({
    //       open1: true,
    //       open2: false,
    //       open: false,
    //       item_show0: false,
    //       item_show1: true,
    //       item_show2: false,
    //       showModal: false,
    //       match:res.data 
    //     })
    //   }
    // })
  },
  state: function () {
    wx.showLoading({
      title: '加载中……',
    })
    circle_publish.where({ _openid: app.globalData._openid }).count({
      success: res => {
        if (res.total) {
          circle_publish.where({ _openid: app.globalData._openid }).get({
            success: res => {
              // console.log(res)
              wx.hideLoading()
              this.setData({
                open1: false,
                open2: true,
                open: false,
                item_show0: false,
                item_show1: false,
                item_show2: true,
                showModal: false,
                state: res.data
              })
            }
          })
        } else {
          wx.hideLoading()
          this.setData({
            open1: false,
            open2: true,
            open: false,
            item_show0: false,
            item_show1: false,
            item_show2: false,
            bool_show: true,
          })
        }
      }
    })
    // circle_publish.where({ _openid: app.globalData._openid }).get({
    //   success: res => {
    //     // console.log(res)
    //     wx.hideLoading()
    //     this.setData({
    //       open1: false,
    //       open2: true,
    //       open: false,
    //       item_show0: false,
    //       item_show1: false,
    //       item_show2: true,
    //       showModal: false,
    //       state: res.data 
    //     })
    //   }
    // })
  },
  delete_match: function (res) {
    let that = this
    var id = res.target.id
    wx.showLoading({
      title: '正在删除...',
    })
    matchCollection.doc(id).remove({
      success: res=>{
        // console.log(res)
        wx.hideLoading()
        match_publish.where({ _openid: app.globalData._openid }).count({
          success: res => {
            if (res.total) {
              circle_publish.where({ _openid: app.globalData._openid }).get({
                success: res => {
                  // console.log(res)
                  wx.hideLoading()
                  this.setData({
                    open1: false,
                    open2: true,
                    open: false,
                    item_show0: false,
                    item_show1: false,
                    item_show2: true,
                    showModal: false,
                    match: res.data
                  })
                }
              })
            } else {
              this.setData({
                open1: false,
                open2: true,
                open: false,
                item_show0: false,
                item_show1: false,
                item_show2: false,
                bool_show: true,
              })
            }
          }
        })
      }
    })
  },
  delete_state: function (res) {
    let that = this
    var id = res.target.id
    wx.showLoading({
      title: '正在删除...',
    })
    circle_publish.doc(id).remove({
      success: res => {
        // console.log(res)
        wx.hideLoading()
        // this.state()
        circle_publish.where({ _openid: app.globalData._openid }).count({
          success: res => {
            if( res.total ){
              circle_publish.where({ _openid: app.globalData._openid }).get({
                success: res => {
                  // console.log(res)
                  wx.hideLoading()
                  this.setData({
                    open1: false,
                    open2: true,
                    open: false,
                    item_show0: false,
                    item_show1: false,
                    item_show2: true,
                    showModal: false,
                    state: res.data
                  })
                }
              })
            }else{
              this.setData({
                open1: false,
                open2: true,
                open: false,
                item_show0: false,
                item_show1: false,
                item_show2: false,
                bool_show: true,
              })
            }
          }
        })
      }
    })
  },
  /**
  * 比赛详情
  */
  matchDetail: function (event) {
    // console.log(event)
    var _id = event.currentTarget.id
    this.setData({
      showMatch: true,
    })
    matchCollection.where({ _id: _id }).get({
      success: res => {
        console.log(res)
        var data = res.data[0]
        // console.log(data)
        this.setData({
          match_img: data.uploadImg,
          sports_type: data.type,
          nickName: data.nickName,
          date: data.date,
          time: data.time,
          tele: data.tele,
          school: data.school,
          match_num: data.match_num,
          now_match_num: data.now_match_num
        })
      }
    })
  },
  cancle:function(){
    this.setData({
      showMatch:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        var item_height = res.windowHeight - 75 -31
        this.setData({
          item_height: item_height,
        })
      },
    })
    wx.showLoading({
      title: '加载中……',
    })
    sports_publish.where({ _id: _id }).get({
      success: res => {
        // console.log(res)
        wx.hideLoading()
        this.setData({
          open1: false,
          open2: false,
          open: true,
          item_show0: true,
          item_show1: false,
          item_show2: false,
          showModal: false,
          find_partner:res.data
        })
      }
    })
  },

  userDetail: function (res) {
    var that = this
    // console.log(res)
    _id = res.currentTarget.id    //获取用户的id
    wx.navigateTo({
      url: '../circleDetail/circleDetail?id=' + _id,    //页面跳转到招募者详细信息页面，并把_openid传递
    })
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