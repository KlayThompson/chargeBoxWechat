// pages/switchOrderDetail/switchOrderDetail.js
import Notify from '../../utils/dist/notify/notify.js';
const app = getApp();
var API = app.globalData.API;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    add_metter: '10',
    orderWave_Url: '/resources/order_wave.png',
    detail: {
      recordId: 'CD121912910120120',
      switchNo: '1',
      status: '充电结束',
      electricQuantity: '300',
      duration: '1小时',
      startTime: '2019-10-16 15:43',
      endTime: '2019-10-16 16:43',
      completeReason: '充满停止',
      pileNumber: ''
    },
    duration: '1小时20分钟'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that =this
    var order = JSON.parse(options.order)
    this.setData({
      detail: order
    })
    if (order.duration != 0 && order.duration >= 3600) {
      var time = order.duration;
      var hours = parseInt(time / 3600)
      var leave_sec = parseInt(time % 3600)
      var minutes = parseInt(leave_sec / 60)
      that.setData({
        duration: hours + '时' + minutes + '分'
      })
    } else if (order.duration != 0 && order.duration < 3600) {
      var time = order.duration;
      var minutes = parseInt(time / 60)
      that.setData({
        duration: minutes + '分'
      })
    } else {
      that.setData({
        duration: '0分'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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