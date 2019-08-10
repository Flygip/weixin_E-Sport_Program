// miniprogram/pages/sportTips/sportTips.js
const db = wx.cloud.database()
const tipsCollection = db.collection("tips")
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open0: true,
    open1: false,
    open2: false,
    showModal:false,
    tips:[]
  },
  before_sport: function () {
    wx.showLoading({
      title: '加载中……',
    })
    tipsCollection.where({ type: "before" }).get({
      success: res => {
        // console.log(res)
        var userList = []
        for (var i = 0; i < res.data.length; i++) {
          // console.log(i)
          userList.unshift(res.data[i])
        }
        wx.hideLoading()
        this.setData({
          tips: userList,
          open0: true,
          open1: false,
          open2: false,
        })
      }
    })
  },
  sport_tips: function () {
    wx.showLoading({
      title: '加载中……',
    })
    tipsCollection.where({ type: "sports" }).get({
      success: res => {
        // console.log(res)
        var userList = []
        for (var i = 0; i < res.data.length; i++) {
          // console.log(i)
          userList.unshift(res.data[i])
        }
        wx.hideLoading()
        this.setData({
          tips: userList,
          open0: false,
          open1: true,
          open2: false,
        })
      }
    })
  },
  rest_tips: function () {
    wx.showLoading({
      title: '加载中……',
    })
    tipsCollection.where({ type: "rest" }).get({
      success: res => {
        // console.log(res)
        var userList = []
        for (var i = 0; i < res.data.length; i++) {
          // console.log(i)
          userList.unshift(res.data[i])
        }
        wx.hideLoading()
        this.setData({
          tips: userList,
          open0: false,
          open1: false,
          open2: true,
        })
      }
    })
  },
  /**
   * 文章详细
   */
  text_detail:function(event){
    // console.log(event)
    var _id = event.currentTarget.id
    // console.log(_id)
    tipsCollection.doc(_id).get({
      success: res => {
        // console.log(res)
        var glance = res.data.glance + 1
        console.log(glance)
        var tipsType = res.data.type
        console.log(_id)
        wx.cloud.callFunction({   //调用更新文章阅读数的的云函数
          name:"update_text_glance",
          data:{
            _id:_id,
            glance:glance
          },
          success: res => {
            console.log(res)
            tipsCollection.where({ type: tipsType }).get({
              success: res => {
                var userList = []
                for (var i = 0; i < res.data.length; i++) {
                  // console.log(i)
                  userList.unshift(res.data[i])
                }
                console.log(userList)
                this.setData({
                  tips: userList
                })
              }
            })
          }
        })
        // tipsCollection.doc(_id).update({  //这样没有权限
        //   data: {
        //     glance:_.inc(1)
        //   },
        //   success: res=> {
            
        //   }
        // })
        this.setData({
          showModal:true,
          title:res.data.title,
          author:res.data.author,
          text:res.data.text
        })
      }
    })
  },
  confirm:function(){
    this.setData({
      showModal:false,
      author:"",
      text:"",
      title:""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        // console.log(res)
        var item_width = res.screenWidth
        var text_height = res.windowHeight * 0.77
        this.setData({
          item_width: item_width,
          text_height:text_height
        })
      },
    })
    tipsCollection.where({type:"before"}).get({
      success: res => {
        // console.log(res)
        var userList = []
        for (var i = 0; i < res.data.length; i++) {
          // console.log(i)
          userList.unshift(res.data[i])
        }
        this.setData({
          tips:userList
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