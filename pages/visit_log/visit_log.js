// miniprogram/pages/visit_log/visit_log.js
const app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection("userInfo")
const sports_publish = db.collection('sports_publish')
const circle_publish = db.collection('circle_publish')
const _ = db.command
var _openid = ''
var _id = ''  // 这里的_id为每个标签展示用户的，并不是点击用户的
var glance = ""     //保存浏览数目
var new_record = new Array()    //用来保存新的收藏
// 全局变量all_record_user 用来保存全部被收藏用户的Array
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open:true,
    open1:false,
    stateInfo:"归还",
    appointment:0,
    item_show0:true,
    item_show1:false,
    showModal:false
  },
  /**
   *  展示最近浏览的函数
   */
  appointment_record: function (){
    // console.log(this.data.open, this.data.open1)
    this.setData({
      open1:false,
      open:true,
      item_show0:true,
      item_show1:false
    })
    var all_record_user = new Array()   //用来保存全部被收藏用户的Array
    wx.showLoading({
      title: '加载中......',
    })
    userCollection.where({ _id: app.globalData.user_id }).get({   //从数据库读取收藏用户Array等信息
      success: res => {
        // console.log(res)
        var record = res.data[0].partner_record   //获取收藏用户Array
        // console.log(record)
        if (record.length) {
          //如果有收藏过用户  设置show为false
          this.setData({
            bool_show: false,
            item_show0: true,
            item_show1:false
          })
          if (all_record_user.length == 0) {   //这样限定程序执行次序
            for (var i = 0; i < record.length; i++) {   //如果有收藏用户，则逐个读取用户信息
              sports_publish.where({ _id: record[i] }).get({
                success: res => {
                  // console.log(res.data)
                  all_record_user.push(res.data[0])
                  wx.hideLoading()   //隐藏加载
                  this.setData({
                    sports: all_record_user
                  })
                }
              })
            }
          }
        }
        else {   //未收藏用户，给出提示
          wx.hideLoading()
          this.setData({
            bool_show: true
          })
        }
      }
    })
  },
  likes_record: function () {
    this.setData({
      open1: true,
      open: false,
      // item_show1:true,
      item_show0:false,
    })
    var all_record_user = new Array()   //用来保存全部被收藏用户的Array
    wx.showLoading({
      title: '加载中......',
    })
    userCollection.where({ _id: app.globalData.user_id }).get({   //从数据库读取收藏用户Array等信息
      success: res => {
        // console.log(res)
        var record = res.data[0].likes_record   //获取收藏用户Array
        // console.log(record)
        if (record.length) {
          //如果有收藏过用户  设置show为false
          this.setData({
            bool_show: false,
            item_show0: false,
            item_show1:true
          })
          if (all_record_user.length == 0) {   //这样限定程序执行次序
          // console.log(all_record_user)
          console.log(record.length)
            for (var i = 0; i < record.length; i++) {   //如果有收藏用户，则逐个读取用户信息      
                circle_publish.where({ _id: record[i] }).get({
                  success: res => {
                    // console.log(res.data)
                    all_record_user.push(res.data[0])
                    wx.hideLoading()   //隐藏加载
                    this.setData({
                      likes: all_record_user
                    })
                  }
                })
              }
            }
          }
        else {   //未收藏用户，给出提示
          wx.hideLoading()
          this.setData({
            bool_show: true,
            item_show1: false
          })
        }
      }
    })
    // console.log(this.data.open, this.data.open1)
  },
  /**
   * 跳转到用户详情页面
   */
  userDetail: function (res) {
    var that = this
    // console.log(res)
    _id = res.currentTarget.id    //获取用户的id
    wx.navigateTo({
      url: '../circleDetail/circleDetail?id=' + _id,    //页面跳转到招募者详细信息页面，并把_openid传递
    })
  },
  /**
   * 删除一条收藏
   */
  delete_people: function (res) {
    var people_id = res.currentTarget.id    //获取要删除用户的_openid
    let that = this
    wx.showLoading({
      title: '正在删除...',
    })
    userCollection.where({_openid:app.globalData._openid}).get({
      success: res => {
        var record = res.data[0].partner_record
        for (var i = 0; i < record.length; i++) {   //如果有收藏用户，则逐个读取用户信息
          if( people_id != record[i] ){
            new_record.push(record[i])
          }
        }
        userCollection.doc(app.globalData.user_id).update({
          data: {
            partner_record: new_record
          },
          success: res => {
            wx.hideLoading()
            // console.log(new_record.length)
            if(new_record.length){
              //如果有收藏过用户  设置show为false
              this.setData({
                bool_show: false,
                item_show0: true,
                item_show1: false
              })
              if (all_record_user.length == 0) {   //这样限定程序执行次序
                for (var i = 0; i < record.length; i++) {   //如果有收藏用户，则逐个读取用户信息
                  sports_publish.where({ _id: record[i] }).get({
                    success: res => {
                      // console.log(res.data)
                      all_record_user.push(res.data[0])
                      wx.hideLoading()   //隐藏加载
                      this.setData({
                        item_show0: true,
                        sports: all_record_user
                      })
                    }
                  })
                }
              }
              // console.log(new_record.length)
            }
            else{
              console.log(new_record.length)
              that.setData({
                item_show0: false,
                bool_show: true
              })
            }
          },
          fail: err => {
            console.log(err)
          }
        })
      }
    })
  },
  delete_like_people: function (res) {
    // console.log(res)
    var new_likes_record = []
    var people_id = res.currentTarget.id    //获取要删除用户的_openid
    // console.log(people_id)
    let that = this
    wx.showLoading({
      title: '正在删除...',
    })
    userCollection.where({ _openid: app.globalData._openid }).get({
      success: res => {
        var record = res.data[0].likes_record
        for (var i = 0; i < record.length; i++) {   //如果有收藏用户，则逐个读取用户信息
          if (people_id != record[i]) {
            new_likes_record.push(record[i])
          }
        }
        console.log(record)
        console.log(new_record)
        userCollection.doc(app.globalData.user_id).update({
          data: {
            likes_record: new_likes_record
          },
          success: res => {
            wx.hideLoading()
            // console.log(new_record.length)
            if (new_likes_record.length) {
              //如果有收藏过用户  设置show为false
              this.setData({
                bool_show: false,
                item_show0: true,
                item_show1: false
              })
              if (all_record_user.length == 0) {   //这样限定程序执行次序
                for (var i = 0; i < new_likes_record.length; i++) {   //如果有收藏用户，则逐个读取用户信息
                  sports_publish.where({ _id: new_likes_record[i] }).get({
                    success: res => {
                      // console.log(res.data)
                      all_record_user.push(res.data[0])
                      wx.hideLoading()   //隐藏加载
                      this.setData({
                        item_show1: true,
                        likes: all_record_user
                      })
                    }
                  })
                }
              }
              // console.log(new_record.length)
            }
            else {
              console.log(new_record.length)
              that.setData({
                item_show1: false,
                bool_show: true
              })
            }
          },
          fail: err => {
            console.log(err)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var all_record_user = new Array()   //用来保存全部被收藏用户的Array
    wx.showLoading({
      title: '加载中......',
    })
    userCollection.where({ _id: app.globalData.user_id }).get({   //从数据库读取收藏用户Array等信息
      success: res => {
        // console.log(res)
        var record = res.data[0].partner_record   //获取收藏用户Array
        // console.log(record)
        if (record.length) {
          //如果有收藏过用户  设置show为false
          this.setData({
            bool_show: false,
            item_show0: true,
            item_show1: false
          })
          if (all_record_user.length == 0) {   //这样限定程序执行次序
            for (var i = 0; i < record.length; i++) {   //如果有收藏用户，则逐个读取用户信息
              sports_publish.where({ _id: record[i] }).get({
                success: res => {
                  // console.log(res.data)
                  all_record_user.push(res.data[0])
                  wx.hideLoading()   //隐藏加载
                  this.setData({
                    sports: all_record_user
                  })
                }
              })
            }
          }
        }
        else {   //未收藏用户，给出提示
          wx.hideLoading()
          this.setData({
            bool_show: true
          })
        }
      }
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
    this.setData({
      open: true,
      open1: false,
      item_show0:true
    })
    var all_record_user = new Array()   //用来保存全部被收藏用户的Array
    wx.showLoading({
      title: '加载中......',
    })
    userCollection.where({_id:app.globalData.user_id}).get({   //从数据库读取收藏用户Array等信息
      success: res => {
        // console.log(res)
        var record = res.data[0].record   //获取收藏用户Array
        var record_time = res.data[0].record_time    //获取收藏时间Array
        if (record.length) {
          //如果有收藏过用户  设置show为false
          this.setData({
            bool_show: false,
            item_show: true
          })
          if (all_record_user.length == 0) {   //这样限定程序执行次序
            for (var i = 0; i < record.length; i++) {   //如果有收藏用户，则逐个读取用户信息
              sports_publish.get({
                success: res => {
                  // console.log(res.data)
                  all_record_user.push(res.data[0])
                  wx.hideLoading()   //隐藏加载
                  wx.stopPullDownRefresh()
                  this.setData({
                    sports: all_record_user
                  })
                }
              })
            }
          }
        }
        else {   //未收藏用户，给出提示
          wx.hideLoading()
          this.setData({
            bool_show: true
          })
        }
      }
    })
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