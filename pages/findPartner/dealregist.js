// miniprogram/pages/dealregist/dealregist.js
const app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('userInfo')
const sports_publish = db.collection('sports_publish')
var avatarUrl = ""   //保存头像
var nickName = ""   //保存昵称
var fileId = ""   //保存fileId
var latitude = ""   //保存位置经度
var longitude = ""
var position_name = ""   //保存位置名称
var _id = ''  //从center页面传来的_id值
var sports_type = ""  //保存运动品类型
var sports_label = ""  //保存对运动品的说明
var tele = ""
Page({
  /**
   * 页面的初始数据
   */
  data: {
    school: ['长安大学', '西北工业大学', '西安交通大学', '北京邮电大学', '厦门大学', '四川大学', '华中农业大学'],
    equipmentList: ['乒乓球', '羽毛球', '网球', '排球', '篮球', '足球'],
    date: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
    equipmentIndex: 0,
    index0:0,
    index3:0,
    time: '06:00',
    text: '',//备注信息,
    upLoadImg:"../image/addPhoto.png",
    position:"选运动地点",
    button_type:"primary",
    had_choosed_position: false,
    had_choosed_image:false,
    add_photo_text: "选择图片",
    add_photo_button:"primary"
  },
  /**
   * 添加照片函数
   */
  loadImg: function (res) {
    //console.log(res)
    let that = this
    if( !that.data.had_choosed_image ){
      wx.showLoading({   //显示加载图标
        title: '加载中...',
      })
      wx.chooseImage({
        count: 1,
        sourceType: ['camera', 'album'],
        success: res => {
          //隐藏加载图标
          wx.hideLoading()
          const tempFilePaths = res.tempFilePaths
          //console.log(tempFilePaths[0])
          var random_string = Math.floor(Math.random() * 1000000).toString() + '.jpg'
          wx.cloud.uploadFile({
            cloudPath: random_string,   //上传至云端的路径
            filePath: tempFilePaths[0],    //文件的路径
            success: res => {    //使用promise风格不会改变this
              //console.log(res.fileID)
              fileId = res.fileID
              userCollection.doc(_id).update({
                data:{
                  sports_image: res.fileID
                }
              }).then(res => {
                //console.log(res)
                wx.showToast({
                  title: '上传成功！',
                })
              })
              that.setData({
                upLoadImg:res.fileID,  //将上传的图片显示
                had_choosed_image:true,
                add_photo_button:""
              })
            },
            fail: console.error
          })
        },
        fail: err => {
          console.error(err)
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '已经添加过图片',
        showCancel:false,
        confirmColor:orange
      })
    }
  },
  //选择归还位置函数
  choose_position:function(res){
    let that = this
    if( !that.data.had_choosed_position ){
      wx.getLocation({
        type:"gcj02",
        success: function(res) {
          console.log(res.latitude, res.longitude)
          latitude = res.latitude
          longitude = res.longitude
        },
      })
      wx.chooseLocation({
        success: function(res) {
          console.log(res, res.name)
          position_name = res.name  //获取地点名称
              wx.showToast({
                title: '选择成功',
                icon: 'success'
              })
              that.setData({
                position: position_name,
                button_type:"",
                had_choosed_position:true,
                add_photo_text:"已选择"
              })
          }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '已经添加过归还地点',
        showCancel:false,
        confirmColor:orange
      })
    }
  },
  //获取输入框的信息
  textInput: function (e) {
    this.setData({ 
      text: e.detail.value
    })
    sports_label = e.detail.value
  },
  phoneInput: function (res) {
    //console.log(res.detail.value)
    tele = res.detail.value
  },
  //选择框函数
  bindClassifyPiker0: function (res) {
    this.setData({
      index0: res.detail.value
    })
  },
  bindClassifyPiker1: function (res) {
    this.setData({
      time: res.detail.value
    })
  },
  bindClassifyPiker3: function (res) {
    this.setData({
      index3: res.detail.value
    })
  },
  changeEquipment: function (res) {
    this.setData({
      equipmentIndex: res.detail.value
    })
  },
  //确定按钮函数
  userconfirm: function (res) {
    var date = new Date()    //获取留言的时间
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    if( minutes < 10){
      minutes = '0'+ minutes
    }
    var nowTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes
    sports_type = this.data.equipmentList[this.data.equipmentIndex]
    userCollection.where({_id:app.globalData.user_id}).get({
      success:res=>{
        // console.log(res.data[0].avatarUrl)
        avatarUrl = res.data[0].avatarUrl
        nickName = res.data[0].nickName
        // console.log(nickName)
        sports_publish.add({  //添加数据到器材数据集
          data: {
            sports_image: fileId,
            sports_label: sports_label,
            sports_type: sports_type,
            upLoadSportsTime: nowTime,
            latitude: latitude,
            longitude: longitude,
            position_name: position_name,
            avatarUrl: avatarUrl,
            nickName: nickName,
            date:this.data.date[this.data.index0],
            time:this.data.time,
            appoint_btn_text:"一起玩",
            disabled:false,
            btn_type:"primary",
            tele:tele,
            school:this.data.school[this.data.index3]
          }
        })
      }
    })
    wx.showModal({
      title: '提示',
      content: '上传成功,可到我的发布查看',
      showCancel:false,
      confirmColor:"orange",
      success: res => {   //按下确定按钮就返回
        // console.log(res)
        if(!res.confrim){
          wx.navigateBack({
          })
        }
        // else{
        //   wx.navigateBack({
        //   })
        // }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    _id = options.id
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