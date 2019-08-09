// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const tipsCollection = db.collection("tips")
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await tipsCollection.doc(event._id).update({
      data:{
        glance:event.glance
      }
    })
  }catch(e){
    console.log(e)
  }
}