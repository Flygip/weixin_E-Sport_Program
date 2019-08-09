// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("circle_publish").doc(event._id).update({
      data: {
        message_length: event.message_length,
        message: _.unshift({
          "nowTime": event.nowTime,
          "message_avatarUrl": event.message_avatarUrl,
          "message_nickName": event.message_nickName,
          "message_text": event.message_text
        })
      }
    })
  }catch(e){
    console.log(e)
  }
}