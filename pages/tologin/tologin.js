// miniprogram/pages/tologin/tologin.js
const app = getApp()
var _openid = ''
var _id = '' // 这里的_openid为每个标签展示用户的，并不是点击用户的
const db = wx.cloud.database()
const _ = db.command
const userCollection = db.collection('userInfo')
const sports_publish = db.collection('sports_publish')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curNav: "0",
    stateInfo: "预约",
    flag: "全部",
    appointment: "0",
    sports_text_color: "#3299cc",
    partner_text_color: "gray",
    sports_nav_img: "../image/seleproduct.png",
    center_nav_img: "../image/centerPage.png",
    partner_nav_img: "../image/sport.png",
    showModal: false,
    item_show: true,
    imgUrls: ["http://img01.jituwang.com/180305/256720-1P30519120125.jpg", "http://file06.16sucai.com/2016/0428/a44cc4d2e2ce1a9c891ad652cd3dc19a.jpg", "http://pics.sc.chinaz.com/files/pic/pic9/201809/bpic8421.jpg", "http://pics.sc.chinaz.com/files/pic/pic9/201810/zzpic14597.jpg"],
    item_type: [{
      type: "全部",
      id: "0"
    }, {
      type: "足球",
      id: "1"
    }, {
      type: "排球",
      id: "2"
    }, {
      type: "篮球",
      id: "3"
    }, {
      type: "跑步",
      id: "4"
    }, {
      type: "网球",
      id: "5"
    }, {
      type: "健身",
      id: "6"
    }, {
      type: "骑行",
      id: "7"
    }, {
      type: "乒乓球",
      id: "8"
    }, {
      type: "羽毛球",
      id: "9"
    }]
  },
  //右侧导航栏
  switch_nav: function(res) {
    // console.log(res)
    wx.showLoading({
      title: '加载中……',
    })
    var id = res.currentTarget.dataset.index
    console.log(id)
    this.setData({
      curNav: id
    })
    if (this.data.curNav === "0") {
      sports_publish.get({
        success: res => {
          console.log(res)
          var userList = []
          for (var i = 0; i < res.data.length; i++) {
            // console.log(i)
            userList.unshift(res.data[i])
          }
          this.setData({
            sports: userList,
            item_show: true,
            bool_show: false,
          })
          wx.hideLoading()
        }
      })
    } else {
      var type = res.currentTarget.id
      sports_publish.where({
        sports_type: type
      }).count({
        success: res => {
          // console.log(res.total)
          if (res.total) {
            sports_publish.where({
              sports_type: type
            }).get({
              success: res => {
                // this.onShow()
                var userList = []
                for (var i = 0; i < res.data.length; i++) {
                  // console.log(i)
                  userList.unshift(res.data[i])
                }
                this.setData({
                  sports: userList,
                  item_show: true,
                  bool_show: false,
                })
                wx.hideLoading()
              }
            })
          } else {
            this.setData({
              bool_show: true,
              item_show: false
            })
            wx.hideLoading()
          }
        }
      })
    }
  },
  confirm:function(){
    this.reflash(_id)
    this.setData({
      showModal:false
    })
  },
  cancle:function(){
    this.setData({
      showModal: false
    })
  },
  /**
   * 预约函数
   */
  appointmentFunc: function(res) {
    // console.log(res)
    if (app.globalData.had_log) {
       _id = res.currentTarget.id
      userCollection.doc(app.globalData.user_id).update({
        data:{
          partner_record:_.unshift(_id)
        },
        success: res => {
          sports_publish.where({
            _id: _id
          }).get({
            success: res => {
              this.setData({
                showModal: true,
                sports_image: res.data[0].sports_image,
                sports_type: res.data[0].sports_type,
                school: res.data[0].school,
                tele: res.data[0].tele,
                position_name: res.data[0].position_name,
                date:res.data[0].date,
                time:res.data[0].time
              })
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '需要登录才能预约哦!',
        showCancel: false
      })
    }
  },
  reflash: function(_id) {
    console.log(_id)
    wx.showLoading({
      title: '加载中……',
    })
    sports_publish.doc(_id).update({
      data: {
        appoint_btn_text: "已预约",
        btn_type: "default",
        disabled: true
      },
      success: res => {
        // console.log(res)
        var qq = ""
        sports_publish.doc(_id).get({
          success: res => {
            console.log(res)
            qq = res.data.tele
            wx.setClipboardData({
              data: qq,
            })
              wx.showToast({
                title: 'QQ已复制',
                duration:2000
              })
          }
        })
        sports_publish.get({
          success: res => {
            var userList = []
            for (var i = 0; i < res.data.length; i++) {
              // console.log(i)
              userList.unshift(res.data[i])
            }
            this.setData({
              sports: userList
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        var img_height = res.windowHeight * 0.27
        var screen_width = res.screenWidth
        var item_height = res.windowHeight * 0.73
        var position_width = res.windowWidth * 0.78 * 0.45
        console.log(position_width)
        this.setData({
          img_height: img_height,
          item_height: item_height,
          screen_width: screen_width,
          position_width: position_width
        })
      },
    })
    wx.showLoading({ //显示加载提示
      title: '加载中...',
    })
    let that = this; //备份this
    sports_publish.get({
      success: res => {
        var userList = []
        for (var i = 0; i < res.data.length; i++) {
          // console.log(i)
          userList.unshift(res.data[i])
        }
        // console.log(res.data)
        that.setData({
          sports: userList
        })
        wx.hideLoading()
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({ //显示加载提示
      title: '加载中...',
    })
    let that = this; //备份this
    sports_publish.get({
      success: res => {
        var userList = []
        for (var i = 0; i < res.data.length; i++) {
          // console.log(i)
          userList.unshift(res.data[i])
        }
        wx.stopPullDownRefresh()
        that.setData({
          sports: userList
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})