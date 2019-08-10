// miniprogram/pages/circleDetail/circleDetail.js
const app = getApp()
const db = wx.cloud.database()
const circleCollection = db.collection("circle_publish")
const userCollection = db.collection("userInfo")
const _ = db.command
var _id = ""
var message_text = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position_img:"../image/position.png",
    message_length:0,
    bool_record:"关注",
    button_color:"green",
    num_likes: 0,
    like_image:"../image/heart.png"
  },
  add_likes:function(){
    var count = this.data.num_likes + 1
    circleCollection.doc(_id).update({
      data:{
        num_likes:count
      },
      success: res => {
        this.setData({
          num_likes: count,
          like_image: "../image/hearted.png"
        })
      }
    })
  },
  add_record:function(){
    if (app.globalData.had_log) {
      userCollection.doc(app.globalData.user_id).update({
        data: {
          likes_record: _.unshift(_id)
        },
        success: res => {
          this.setData({
            bool_record: "已关注",
            button_color: "gainsboro",
          })
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '需要登录才能添加关注哦!',
        showCancel:false
      })
    }
  },
  leave_message:function(event){
    // console.log(event)
    message_text = event.detail.value
  },
  leave_message_button:function(event){
    this.data.input_message = ""
    if (app.globalData.had_log) {
      var date = new Date()    //获取留言的时间
      var month = date.getMonth() + 1
      var day = date.getDate()
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      var nowTime = month + "-" + day
      var message_id = app.globalData.user_id
      var message_avatarUrl = ""
      var message_nickName = ""
      userCollection.doc(message_id).get({
        success: res=> {
          message_avatarUrl = res.data.avatarUrl
          message_nickName = res.data.nickName
          var message_length = this.data.message_length + 1
          this.setData({
            message_length: message_length
          })
          // console.log(message)
          wx.cloud.callFunction({
            name:"update_comment",
            data:{
              _id:_id,
              message_length:message_length,
              nowTime:nowTime,
              message_avatarUrl:message_avatarUrl,
              message_nickName:message_nickName,
              message_text:message_text
            },
            success: res =>{
              // console.log(res)
              circleCollection.doc(_id).get({
                success: e => {
                  // console.log(e)
                  this.setData({
                    message_item: e.data.message,
                    input_message: ""
                  })
                  wx.showToast({
                    title: '留言成功!',
                    icon: "success",
                    duration: 1500
                  })
                }
              })
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '需要先登录才能发动态哦',
        confirmText: "确定",
        showCancel: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        // console.log(res)
        var top_width = res.screenWidth
        var img_height = (res.screenWidth * 0.94)/3 - 5
        var whole_page_height = res.windowHeight - 47 - 140 - 15
        // console.log(img_height)
        // var item_height = res.windowHeight - img_height
        this.setData({
          top_width:top_width,
          img_height: img_height,
          whole_page_height:whole_page_height
        })
      },
    })
    // console.log(options)
    _id = options.id
    circleCollection.doc(_id).get({
      success: res => {
        // console.log(res.data)
        this.setData({
          avataUrl:res.data.avatarUrl,
          nickName:res.data.nickName,
          time:res.data.publish_time,
          positionName:res.data.position_name,
          motto: res.data.motto,
          sports_image:res.data.sports_image,
          message_length: res.data.message_length,
          message_item: res.data.message,
          num_likes:res.data.num_likes
        })
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