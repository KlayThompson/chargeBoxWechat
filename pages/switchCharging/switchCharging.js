// pages/switchCharging/switchCharging.js
import Dialog from '../../utils/dist/dialog/dialog.js';

const app = getApp();
var API = app.globalData.API;
var common = require('../../utils/common.js')
var recordId = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      pileNumber: 'AY10115083',
      switchNo: '1',
      status: '充电中',
      electricQuantity: '200',
      duration: '200',
    },
    orderWave_Url: '/resources/order_wave.png',
    charging_status_url: '/resources/icon_add_distance8.png',
    clock_url: '/resources/clock.jpg',
    device_url: '/resources/devicenumber.jpg',
    arrow_bottom_url: '/resources/arrow-bottom.png',
    arrow_right_url: '/resources/arrow-right.png',
    showdetail: true,
    hidden: true,
    duration: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    recordId = options.recordId;
    var that = this;
    var header = common.getHeader()

    wx.request({
      url: API + '/v1/chargingapi/pile/record/' + recordId,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.status == '结束') { //充电结束
          //计时停止
          clearInterval(timer)
            //跳转回首页
            Dialog.alert({
              title: '提示',
              message: '充电已结束，点击确认返回首页'
            }).then(() => {
              // on close
              wx.navigateBack({})
            });
          } else {
            that.setData({
              order: res.data
            })
            if (res.data.duration != 0 && res.data.duration >= 3600) {
              var time = res.data.duration;
              var hours = parseInt(time / 3600)
              var leave_sec = parseInt(time % 3600)
              var minutes = parseInt(leave_sec / 60)
              that.setData({
                duration: hours + '时' + minutes + '分'
              })
            } else if (res.data.duration != 0 && res.data.duration < 3600) {
              var time = res.data.duration;
              var minutes = parseInt(time / 60)
              that.setData({
                duration: minutes + '分'
              })
            } else {
              that.setData({
                duration: '0分'
              })
            }
          }
        }
      },
      fail: function (err) {

      }
    })

    var header = common.getHeader()
    var that = this;
    var timer = setInterval(function () {
      wx.request({
        url: API + '/v1/chargingapi/pile/record/' + recordId,
        method: 'GET',
        header: header,
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == '结束') { //充电结束
              clearInterval(timer)
              //跳转回首页
              Dialog.alert({
                title: '提示',
                message: '充电已结束，点击确认返回首页'
              }).then(() => {
                // on close
                wx.navigateBack({})
              });
            } else {
              that.setData({
                order: res.data
              })
              if (res.data.duration != 0 && res.data.duration >= 3600) {
                var time = res.data.duration;
                var hours = parseInt(time / 3600)
                var leave_sec = parseInt(time % 3600)
                var minutes = parseInt(leave_sec / 60)
                that.setData({
                  duration: hours + '时' + minutes + '分'
                })
              } else if (res.data.duration != 0 && res.data.duration < 3600) {
                var time = res.data.duration;
                var minutes = parseInt(time / 60)
                that.setData({
                  duration: minutes + '分'
                })
              } else {
                that.setData({
                  duration: '0分'
                })
              }
            }
          }
        },
        fail: function (err) {

        }
      })
    }, 30 * 1000)
  },

  onShow: function() {
    
  },

  showDetail: function () {
    var nowshow = this.data.showdetail
    console.log(nowshow)
    this.setData({
      showdetail: !nowshow
    })
  }
})