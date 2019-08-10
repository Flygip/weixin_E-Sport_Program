// miniprogram/pages/findpartner/findpartner.js
const app = getApp()
const db = wx.cloud.database()
const matchCollection = db.collection('match')
var _id = ''  //从center页面传来的_id值
var type = ''  //分别暂存微信号，电话和个性签名
var tele = ''
var people = ""
var label = ''
var fileId = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school: ['长安大学', '西北工业大学', '西安交通大学', '北京邮电大学', '厦门大学', '四川大学', '华中农业大学'],
    date: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
    time: '06:00',
    index0: 0,
    index1: 0,
    upLoadImg:"../image/addPhoto.png"
  },

  /**
   * 确定每个piker的选择
   */
  bindClassifyPiker0: function (res) {
    //console.log(res.detail.value)
    this.setData({
      index0: res.detail.value
    })
  },
  bindClassifyPiker1: function (res) {
    //console.log(res.detail.value)
    this.setData({
      index1: res.detail.value
    })
  },
  bindClassifyPiker2: function (res) {
    //console.log(res.detail.value)
    //console.log(res)
    this.setData({
      time:res.detail.value
    })
  },
  /**
   * 提交筛选参数并返回前一页面
   */
  submit: function () {
    var that = this
    var _school = this.data.school[this.data.index0]
    var _date = this.data.date[this.data.index1]
    var _time = this.data.time
    var nickName = app.globalData.nickName
    //console.log(school,type,date,time,sex)
    console.log(_id)
    matchCollection.add({  //注意这里doc的参数只能是_id ，完成对数据的更新
      data:{
        school:_school,
        nickName:nickName,
        type:type,
        date:_date,
        time:_time,
        tele:tele,
        label:label,
        uploadImg:fileId,
        match_num:people,
        now_match_num:0
      },
      success:res => {   //如果更新数据成功，给出提示，并返回前一页面（关闭当前页面）
      console.log(res)
      //数据更新后，同时更新展示页面的数据
        wx.showModal({
          title: '提示',
          content: '发布成功!',
          showCancel:false,
          success:function(){
            wx.navigateBack({
            
            })
          }
        })
      }
    })
  },
  /**
   * 获取微信号，电话和个签等
   */
  typeInput: function (res) {
    //console.log(res.detail.value)
    type = res.detail.value
  },
  phoneInput: function (res) {
    //console.log(res.detail.value)
    tele = res.detail.value
  },
  peopleInput: function (res) {
    //console.log(res.detail.value)
    people = res.detail.value
  },
  getLabel: function (res) {
    //console.log(res.detail.value)
    label = res.detail.value
  },
  /**
   * 添加照片函数
   */
  loadImg:function(res){
    //console.log(res)
    wx.showLoading({   //显示加载图标
      title: '加载中...',
    })
    wx.chooseImage({
      count:1,
      sourceType:['camera','album'],
      success: res => {
        //隐藏加载图标
        wx.hideLoading()
        const tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths[0])
        var random_string = Math.floor(Math.random() * 1000000).toString() + '.jpg'
        wx.cloud.uploadFile({
          cloudPath:random_string,   //上传至云端的路径
          filePath:tempFilePaths[0],    //文件的路径
          success: res=> {    //使用promise风格不会改变this
            //console.log(res.fileID)
              fileId = res.fileID
              this.setData({
                upLoadImg:fileId
              })
              wx.showToast({
                title: '上传成功！',
              })
          },
          fail:console.error
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})