// miniprogram/pages/center/center.js
const app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('userInfo')
var had_login = false   //检查用户是否登录,初始化为未登录
var id = ''   //用来保存_openid
Page({
  /**
   * 页面的初始数据
   */
  data: {
  avatarUrl:"http://bpic.588ku.com/element_origin_min_pic/17/02/09/df8019f04cf86863ea7248114cbc3b24.jpg",
    nickName:"未登录",
    color1:'white',
    button_text:"一键登录"
  },
  /**
   * 一键登录函数
   */
  getUserInfo:function(res){
    if( !app.globalData.had_log){
    var that = this    //备份this指针
    var result = res     //获取用户用户信息的res
    wx.showModal({
      title: '提示',
      content: '微信将获取你的头像,昵称等信息',
      success:function(res){
        //console.log(res.confirm)
        if(res.confirm){  //当用户确定授权时，用户登录
            //console.log(result.detail.userInfo)
            var userinfo = result.detail.userInfo
            var nickName = userinfo.nickName
            var avatarUrl = userinfo.avatarUrl
            // console.log(userinfo)
            app.globalData.avatarUrl = userinfo.avatarUrl
            app.globalData.nickName = userinfo.nickName
            //console.log(nickName, avatarUrl)
            //console.log(userinfo.nickName)
            userCollection.where({ nickName: userinfo.nickName }).count({
              success: function (res) {
                // console.log(res)
                if (!res.total) {//检测是否有该用户信息存在，不存在则添加信息，在则直接给出授权成功的modal
                  userCollection.add({
                    data: {
                      avatarUrl:avatarUrl,
                      nickName:nickName,
                      sports_publish:false,
                      partner_publish:false,
                      partner_record:[],
                      likes_record:[],
                    }
                  }).then(res => {
                    app.globalData.had_log = true    //表示用户已经登录
                    that.setData({
                      avatarUrl: avatarUrl,
                      nickName: nickName,
                      button_text:"已登录"
                    })
                    wx.showToast({     //给出授权成功的提示
                      title: '授权成功!',
                      icon: 'success',
                      duration: 2000
                    })
                    //获取用户_openid
                    userCollection.where({nickName:nickName}).get({
                      success:function(event){
                        id = event.data[0]._id    //将用户_openid传给全局变量id
                        app.globalData._openid = event.data[0]._openid
                        app.globalData.user_id = event.data[0]._id//获取已经登录用户的_id,便于添加收藏
                        //console.log(id)
                      }
                    })
                  })
                }
                else {
                  app.globalData.had_log = true  //表示用户已经登录
                  userCollection.where({ nickName: userinfo.nickName }).get({
                    success: res=> {
                      if(res.data[0].invite){
                        wx.setTabBarBadge({
                          index: 1,
                          text: '1',
                        })
                      }
                    }
                  })
                  that.setData({
                    avatarUrl: avatarUrl,
                    nickName: nickName,
                    button_text: "已登录"
                  })
                  wx.showToast({
                    title: '授权成功!',
                    icon: 'success',
                    duration: 2000
                  })
                  //获取用户_openid
                  userCollection.where({ nickName: nickName }).get({
                    success: function (event) {
                      //console.log(event.data[0]._openid)
                      id = event.data[0]._id    //将用户_openid传给全局变量id
                      app.globalData._openid = event.data[0]._openid
                      app.globalData.user_id = event.data[0]._id//获取已经登录用户的_id,便于添加收藏
                      console.log(app.globalData.user_id)
                      // console.log(id)
                    }
                  })
                }
              }
            })
          }
          else{
            wx.showToast({
              title: '授权失败!',
              icon: 'loading',
              duration: 2000
            })
          }
        }
      })
    }
    else{
      wx.showToast({
        title: '已登录',
        icon: 'success',
        duration: 1000
      })
    }
  },
  /**
   * 招募伙伴函数
   */
  makeDeal:function(){
    if (app.globalData.had_log){
      wx.navigateTo({
        url: '../findPartner/dealregist?id='+id,
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '请先登录再执行该操作',
        showCancel:false
      })
    }
  },
  /**
   * 发布招募信息函数
   */
  findPartner: function () {
    if (app.globalData.had_log) {
      wx.navigateTo({
        url: '../creatMatch/findpartner?id=' + id,
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请先登录再执行该操作',
        showCancel: false
      })
    }
  },
  /**
   * 展示个收藏
   */
  my_publish: function () {
    if (app.globalData.had_log) {
      wx.navigateTo({
        url: '../mypublish/my_publish',
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请先登录再执行该操作',
        showCancel: false
      })
    }
  },
  // 展示浏览记录
  lookRecord: function () {
    if (app.globalData.had_log) {
      wx.navigateTo({
        url: '../visit_log/visit_log',
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请先登录再执行该操作',
        showCancel: false
      })
    }
  },
  // 跳转到用户提示页面
  showTips: function(){
    wx.navigateTo({
      url: '../tippage/tippage',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        var item_width = res.screenWidth
        this.setData({
          item_width: item_width,
        })
      },
    })
    this.setData({
      avatarUrl:app.globalData.avatarUrl,
      nickName:app.globalData.nickName
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