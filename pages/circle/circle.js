// miniprogram/pages/circle/circle.js
const app = getApp()
const db = wx.cloud.database()
const circleCollection = db.collection("circle_publish")
const userCollection = db.collection("userInfo")
const matchCollection = db.collection("match")
var latitude = "" //保存位置经度
var longitude = ""
var position_name = "" //保存位置名称
var temp_position_name = ""
var motto = "" //保存motto
var tempMotto = "" //加上......
var input_nickName = "NULL"
var invite_avatarUrl = "NULL"
var partner_openid = "NULL"
var single_match_id = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    imgUrls: ["http://img01.jituwang.com/180305/256720-1P30519120125.jpg", "http://file06.16sucai.com/2016/0428/a44cc4d2e2ce1a9c891ad652cd3dc19a.jpg", "http://pics.sc.chinaz.com/files/pic/pic9/201809/bpic8421.jpg", "http://pics.sc.chinaz.com/files/pic/pic9/201810/zzpic14597.jpg"],
    sports_image: ["../image/addPhoto.png"],
    had_choosed_position: false,
    my_position: "我的位置",
    sports_motto: "运动宣言",
    position_font_size: "large",
    motto_font_size: "large",
    showInput: false,
    showInputOfNickName: false,
    match_img: "../image/addPhoto.png",
    showMatch:false,
  },
  /**
   * 比赛详情
   */
  matchDetail:function(event){
    // console.log(event)
    var _id = event.currentTarget.id
    single_match_id = _id
    this.setData({
      showMatch: true,
    })
    matchCollection.where({_id:_id}).get({
      success: res=> {
        // console.log(res)
        var data = res.data[0]
        // console.log(data)
        this.setData({
          match_img: data.uploadImg,
          sports_type:data.type,
          nickName:data.nickName,
          date:data.date,
          time:data.time,
          tele:data.tele,
          school:data.school,
          match_num:data.match_num,
          now_match_num:data.now_match_num
        })
      }
    })
  },
  /**
   * 添加图片
   */
  loadImg: function(res) {
    //console.log(res)
    let that = this
    wx.showLoading({ //显示加载图标
      title: '加载中...',
    })
    wx.chooseImage({
      count: 9,
      sourceType: ['camera', 'album'],
      success: res => {
        //隐藏加载图标
        wx.hideLoading()
        const tempFilePaths = res.tempFilePaths
        const fileId = []
        // console.log(tempFilePaths)
        // var random_string = Math.floor(Math.random() * 1000000).toString() + '.jpg'
        for (var i = 0; i < tempFilePaths.length; i++) {
          var random_string = Math.floor(Math.random() * 1000000).toString() + '.jpg'
          wx.cloud.uploadFile({
            cloudPath: random_string, //上传至云端的路径
            filePath: tempFilePaths[i], //文件的路径
            success: res => { //使用promise风格不会改变this
              console.log(res.fileID)
              // fileId = res.fileID
              console.log(app.globalData.user_id)
              fileId.unshift(res.fileID)
              that.setData({
                sports_image: fileId
              })
            },
            fail: console.error
          })
        }
        // console.log(this.data.sports_image)
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  /**
   * 添加位置函数
   */
  choosePosition: function(res) {
    let that = this
    if (!that.data.had_choosed_position) {
      wx.getLocation({
        type: "gcj02",
        success: function(res) {
          console.log(res.latitude, res.longitude)
          latitude = res.latitude
          longitude = res.longitude
        },
      })
      wx.chooseLocation({
        success: function(res) {
          console.log(res, res.name)
          position_name = res.name //
          if (position_name[10]) {
            for (var i = 0; i < 10; i++) {
              temp_position_name = temp_position_name + position_name[i]
              // console.log(motto[i])
            }
            console.log(position_name)
            console.log(temp_position_name)
            temp_position_name = temp_position_name + "......"
          }
          else{
            temp_position_name = position_name
          }
          wx.showToast({
            title: '选择成功',
            icon: 'success'
          })
          that.setData({
            my_position: temp_position_name,
            position_font_size: "100%",
            had_choosed_position: true,
            add_photo_text: "已选择"
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '已经添加过归还地点',
        showCancel: false,
        confirmColor: orange
      })
    }
  },
  /**
   * 添加运动宣言函数
   */
  addMotto: function() {
    this.setData({
      showInput: true
    })
  },
  /**
   * 获取宣言函数
   */
  get_motto: function(res) {
    // console.log(res)
    motto = res.detail.value
  },
  confirm3:function(){
    if (app.globalData.had_log) {
      matchCollection.doc(single_match_id).get({
        success: res => {
          // console.log(res)
          var old_match_num = res.data.now_match_num
          // console.log(old_match_num)
          matchCollection.doc(single_match_id).update({
            data: {
              now_match_num: old_match_num + 1
            },
            success: res => {
              // console.log(res)
              wx.showToast({
                title: '记得加QQ哦!',
                duration: 1000
              })
              this.setData({
                showMatch: false
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
  confirm1: function() {
    if (motto[10]) {
      for (var i = 0; i < 10; i++) {
        tempMotto = tempMotto + motto[i]
        // console.log(motto[i])
      }
      // console.log(motto)
      // console.log(tempMotto)
      tempMotto = tempMotto + "......"
      this.setData({
        showInput: false,
        sports_motto: tempMotto,
        motto_font_size: "100%"
      })
    }
    else {
      tempMotto = motto
      this.setData({
        showInput: false,
        sports_motto: tempMotto,
        motto_font_size: "100%"
      })
    }
  },
  /**
   * 添加动态
   */
  add_new_state: function() {
    if (app.globalData.had_log) {
      this.setData({
        showModal: true
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '需要先登录才能发动态哦',
        confirmText:"确定",
        showCancel:false
      })
    }
  },
  cancle: function() {
      this.setData({
        sports_image: ["../image/addPhoto.png"],
        my_position: "我的位置",
        sports_motto: "运动宣言",
        motto_font_size: "large",
        position_font_size: "large",
        showModal: false,
        showMatch: false,
      })
  },
  confirm: function() {
    var date = new Date()    //获取留言的时间
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
      month = "0" + month
    }
    if( day<10 ){
      day = "0" + day
    }
    var nowTime = month + "-" + day
    this.setData({
      showModal: false
    })
      circleCollection.add({
        data: {
          position_name: position_name,
          sports_image: this.data.sports_image,
          motto: motto,
          nickName: app.globalData.nickName,
          avatarUrl: app.globalData.avatarUrl,
          tempMotto: tempMotto,
          publish_time: nowTime,
          message_length:0,
          message:[],
          num_likes:0,
          glance:0
        },
        success: res => {
          circleCollection.get({
            success: res => {
              var userList = []
              for (var i = 0; i < res.data.length; i++) {
                // console.log(i)
                userList.unshift(res.data[i])
              }
              // console.log(userList)
              this.setData({
                userList: userList
              })
              wx.hideLoading()
              this.setData({
                sports_image: ["../image/addPhoto.png"],
                my_position:"我的位置",
                sports_motto:"运动宣言",
                motto_font_size:"large",
                position_font_size:"large",
              })
            }
          })
          wx.showToast({
            title: '发布成功',
            icon: "success"
          })
        }
      })
  },
  /**
   * 添加伙伴
   */
  add_new_partner: function() {
    this.setData({
      showInputOfNickName: true
    })
  },
  get_nickName:function(res){
    // console.log(res)
    input_nickName = res.detail.value
    // console.log(input_nickName)
  },
  /**
   * 跳转到动态详细页面
   */
  circle_detail:function(res){
    // console.log(res)
    var id = res.currentTarget.id
    circleCollection.doc(id).get({
      success: res => {
        var glance = res.data.glance + 1
        wx.cloud.callFunction({
          name:'update_state_glance',
          data:{
            _id:id,
            glance:glance
          },
          success: res => {
            // console.log(res)
            circleCollection.get({
              success: res => {
                // console.log(res)
                var userList = []
                for (var i = 0; i < res.data.length; i++) {
                  // console.log(i)
                  userList.unshift(res.data[i])
                }
                // console.log(userList)
                this.setData({
                  userList: userList
                })
              }
            })
          }
        })
      }
    })
    wx.navigateTo({
      url: '../circleDetail/circleDetail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        var img_width = res.screenWidth
        var img_height = res.windowHeight * 0.24
        var item_height = res.windowHeight - img_height
        this.setData({
          img_width: img_width,
          img_height: img_height,
          item_height: item_height
        })
      },
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    circleCollection.get({
      success: res => {
        // console.log(res)
        var userList =[]
        for( var i=0; i<res.data.length; i++){
          // console.log(i)
          userList.unshift(res.data[i])
        }
        // console.log(userList)
        this.setData({
          userList: userList
        })
        wx.hideLoading()
      }
    })
    matchCollection.get({
      success: res => {
        var match_type = []
        // console.log(res.data.length)
        for( var i = 0; i < res.data.length; i++ ){
          match_type.unshift(res.data[i])
        }
        // console.log(match_type)
        this.setData({
          matchList: match_type
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    circleCollection.get({
      success: res => {
        var userList = []
        for (var i = 0; i < res.data.length; i++) {
          // console.log(i)
          userList.unshift(res.data[i])
        }
        // console.log(userList)
        this.setData({
          userList: userList
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
    matchCollection.get({
      success: res => {
        var match_type = []
        console.log(res.data.length)
        for (var i = 0; i < res.data.length; i++) {
          match_type.unshift(res.data[i])
        }
        // console.log(match_type)
        this.setData({
          matchList: match_type
        })
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