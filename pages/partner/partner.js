// miniprogram/pages/center/center.js
var tab_all_clicked = true     //用来表示是否按下展示全部按钮，初始化为按下
var _openid = ''
var _id = ''  // 这里的_openid为每个标签展示用户的，并不是点击用户的
var glance = ""     //保存浏览数目
const db = wx.cloud.database()
const userCollection = db.collection('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolArray: ['长安大学', '西北工业大学', '西安交通大学', '北京邮电大学', '厦门大学', '四川大学', '华中农业大学'],
    typeArray: ['乒乓球', '羽毛球', '篮球', '足球', '网球'],
    dateArray: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
    sexArray: ['男', '女'],
    index0: 0,
    index1: 0,
    index2: 0,
    index3: 0,
    allImage:'../image/choosedAll.png',
    resverse_allImage:'../image/chooseAll.png',
    classifyImage:'../image/classify.png',
    resverse_classifyImage:'../image/classifyed.png',
    open:false,
    color1:'orange',
    color2:'black',
    sports_nav_img:"../image/product.png",
    partner_nav_img:"../image/sported.png",
    showModal:false
  },
  /** 
   * 显示筛选条目
  */
  classify: function (res) {   //筛选绑定的函数
    var that = this
    this.setData({   //改变按钮颜色以及相应的图片
      color1: 'black',
      color2: 'orange',
      classifyImage: that.data.resverse_classifyImage,
      allImage:that.data.resverse_allImage,
      showModal:true
    })
    // if (this.data.open) {   //如果弹出右状态栏，设置open值为false
    //   that.setData({
    //     open: false,
    //   })
    // }
    // else {
    //   that.setData({
    //     open: true,
    //   })
    // }
  },
  /**
   * 确定预约函数
   */
  confirm: function () {
    this.setData({
      showModal: false
    })
  },
  /**
   * 确定选中的标签index数值函数
   */
  bindClassifyPiker0: function (res) {  //学校选择框
    var that = this
      that.setData({
        index0: res.detail.value
      })
  },
  bindClassifyPiker1: function (res) {   //运动项目的选择框
    //console.log(res.detail.value)
    this.setData({
      index1: res.detail.value
    })
  },
  bindClassifyPiker2: function (res) {    //日期的选择框
    //console.log(res.detail.value)
    this.setData({
      index2: res.detail.value
    })
  },
  bindClassifyPiker3: function (res) {     //性别的选择框
    //console.log(res.detail.value)
    this.setData({
      index3: res.detail.value
    })
  },
  /**
   * 提交筛选参数并返回前一页面
   */
  submit: function () {
    tab_all_clicked = false   //全部按钮设为未按下
    var that = this    //备份this
    var School = this.data.schoolArray[this.data.index0]   //确定选择的学校
    var Type = this.data.typeArray[this.data.index1]    //确定选择的项目
    var Date = this.data.dateArray[this.data.index2]    //确定选择的日期
    var Sex = this.data.sexArray[this.data.index3]    //确定选择的性别
    //console.log(School,Type,Date,Sex)
    if (!tab_all_clicked) {     //当未点击展示全部按钮时，展示用户所筛选的
      let that = this;
      wx.showLoading({
        title: '加载中...',
      })
      userCollection.where({school: School, type: Type, date: Date, sex: Sex}).get({
        success: function (res) {
          wx.hideLoading();
          //console.log(res.data.length)
          if(res.data.length){    //当查询条件有返回结果时，显示展示结果
            that.setData({
              user: res.data
            })
          }
          else{    //当无返回结果时，弹窗给出提示
            wx.showModal({
              title: '提示',
              content: '您设置的查询条件无结果,请重新限定!',
              showCancel:false,
              success: res => {
                if(res.confirm){
                  that.setData({
                    showModal:true
                  })
                }
              }
            })
          }
        }
      })
    }
    that.setData({
      showModal:false
    })
  },
   /**
   * 显示运动伙伴的详细信息
   */
  userDetail:function(res){
    var that = this
    // console.log(res)
    _openid = res.currentTarget.id    //获取用户的id
    // console.log(_openid)
    userCollection.where({_openid:_openid}).get({
      success:res => {
        // console.log(res.data[0])
        _openid=res.data[0]._openid    //获取用户的_openid
        _id = res.data[0]._id    //获取用户的_id
        glance = (parseInt(res.data[0].glance) + 1).toString()    //浏览量加一
        // console.log(glance)
        userCollection.doc(_id).update({
          data: {
            glance: glance
          },
          success: res => {
            // console.log(res)
          }
        })
        //console.log(parseInt(res.data[0].glance) + 1)
        that.setData({
          glance_people: glance
        })
      }
    })
    wx.navigateTo({
      url: '../userdata/userdata?id='+ _openid,    //页面跳转到招募者详细信息页面，并把_openid传递
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showLoading({    //显示加载提示
        title: '加载中...',
      })
      let that = this;     //备份this
      userCollection.get({
        success: function (res) {
          // console.log(res.data);
          wx.hideLoading();   //隐藏加载图标
          if( res.data[0].partner_publish ){   //如果未发布寻找伙伴，就不显示在partner
            that.setData({    
              user: res.data    //展示全部的招募用户
            })
          }
        }
      })
  },
  /**
   * 展示全部的item
   */
  toShowAll:function(){    //展示全部的用户按钮
    tab_all_clicked = true
    this.setData({
      color1: 'orange',    //分别改变筛选按钮和全部按钮的颜色
      color2: 'black',
      allImage:'../image/choosedAll.png',    //分别改变按钮所带表的图片
      classifyImage:'../image/classify.png'
    })

    wx.showLoading({
      title: '加载中...',    //显示加载图标
    })

    let that = this;
    userCollection.get({    //展示全部的招募用户
      success: function (res) {
        //console.log(res.data);
        wx.hideLoading();
        if (res.data[0].partner_publish) {   //如果未发布寻找伙伴，就不显示在partner
          that.setData({
            user: res.data    //展示全部的招募用户
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