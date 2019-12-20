// pages/chargeCabinet/chargeCabinet.js
import Dialog from '../../utils/dist/dialog/dialog.js';
import Notify from '../../utils/dist/notify/notify.js';

const app = getApp();
var API = app.globalData.API;
var common = require('../../utils/common.js')
var recordId = '';
var timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnTitle: '充电',
    hideBatteryDetail: false,
    notBind: false,
    cabinetInfo: null,
    cabinetId: '',
    disableBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var header = common.getHeader()

    //获取充电柜详情
    wx.request({
      url: API + '/v1/chargingapi/chargingCabinet?cabinetNo=' + options.cabinetNo,
      method: 'GET',
      header: header,
      success: function(res) {
        if (res.statusCode == 200) {
          that.setData({
            cabinetId: res.data.id,
            cabinetInfo: res.data
          })
          that.checkupUserStatus()
        }
      },
      fail: function() {
        Notify({
          type: 'warning',
          message: '网络错误，请检查网络'
        })
      }
    })
  },

  // 检测用户状态
  checkupUserStatus: function() {
    var that = this
    var header = common.getHeader()
    //1. 先判断是否绑定电池
    wx.request({
      url: API + '/v1/chargingapi/currentUser',
      method: 'GET',
      header: header,
      success: function(res) {
        if (res.statusCode == 200) {
          //判断是否有电池，
          if (res.data.bindingBatteryNumber == null) {
            that.setData({
              notBind: true,
              btnTitle: '取电池'
            })
          } else {
            that.setData({
              notBind: false
            })
          }
        } else {
          Notify({
            type: 'warning',
            message: res.data.msg + res.statusCode,
            duration: 4000
          })
        }
      },
      fail: function(error) {

      }
    })
    //2.如果未绑定电池则显示绑定电池按钮，开仓取电池
    //3.如果绑定了，则查询用户最近还充电历史记录，根据最新一条的状态来显示取电池还是开仓充电按钮
    wx.request({
      url: API + '/v1/chargingapi/chargingCabinet/chargingRecord/recent?currentPage=1&pageSize=10',
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.statusCode == 200) {
          //取第一条记录
          if (res.data.records.length > 0) {
            var record = res.data.records[0]
            if (record.status == '结束') {
              //说明没有正在充电中的订单，按钮应该显示充电
              that.setData({
                btnTitle: '充电',
                disableBtn: false
              })
            } else if (record.status == '还电完成') {
              //说明正在充电，按钮显示取电池
              that.setData({
                btnTitle: '取电池',
                disableBtn: false
              })
            } else {
              that.setData({
                btnTitle: record.status,
                disableBtn: true
              })
            }
            recordId = res.data.records[0].id
          }
        } else {
          Notify({
            type: 'warning',
            message: res.data.msg + res.statusCode,
            duration: 4000
          })
        }
      },
      fail: function (err) {

      }
    })
    that.getRecentRecord()
  },

  getRecentRecord: function() {
    var that = this
    var header = common.getHeader()
    timer = setInterval(function () {
      wx.request({
        url: API + '/v1/chargingapi/chargingCabinet/chargingRecord/recent?currentPage=1&pageSize=10',
        method: 'GET',
        header: header,
        success: function (res) {
          if (res.statusCode == 200) {
            //取第一条记录
            if (res.data.records.length > 0) {
              var record = res.data.records[0]
              if (record.status == '结束') {
                //说明没有正在充电中的订单，按钮应该显示充电
                that.setData({
                  btnTitle: '充电',
                  disableBtn: false
                })
              } else if (record.status == '还电完成') {
                //说明正在充电，按钮显示取电池
                that.setData({
                  btnTitle: '取电池',
                  disableBtn: false
                })
              } else {
                that.setData({
                  btnTitle: record.status,
                  disableBtn: true
                })
              }
              recordId = res.data.records[0].id
            }
          } else {
            Notify({
              type: 'warning',
              message: res.data.msg + res.statusCode,
              duration: 4000
            })
          }
        },
        fail: function (err) {

        }
      })
    }, 8000)
  },

  //取电充电按钮点击
  mainButtonTap: function() {
    var that = this
    var header = common.getHeader()

    if (that.data.notBind) {
      //第一次取电，需要绑定电池,并取电池
      wx.request({
        url: API + '/v1/chargingapi/chargingCabinet/batteryRequestRecord',
        method: 'POST',
        header: header,
        data: {
          cabinetId: that.data.cabinetId
        },
        success: function(res) {
          if (res.statusCode == 200) {
            that.setData({
              notBind: false,
              btnTitle: '充电'
            })
            recordId = res.data.batteryRequestRecordId
            Dialog.alert({
              title: '提示',
              message: '仓门已开，请去取完电池后关闭仓门'
            }).then(() => {
              // on close
              //更新界面信息
              console.log(res.data)
            });
          } else {
            Notify({
              type: 'warning',
              message: res.data.msg,
              duration: 4000
            })
          }
        },
        fail: function(err) {
          Notify({
            type: 'warning',
            message: '网络错误，请检查网络'
          })
        }
      })
    } else {
      //判断是取电还是充电
      if (that.data.btnTitle == '充电') {
        //充电
        wx.request({
          url: API + '/v1/chargingapi/chargingCabinet/chargingRecord',
          method: 'POST',
          header: header,
          data: {
            cabinetId: that.data.cabinetId
          },
          success: function(res) {
            if (res.statusCode == 200) {
              that.setData({
                btnTitle: '取电池'
              })
              Dialog.alert({
                title: '提示',
                message: '仓门已开，请放入电池后关闭仓门'
              }).then(() => {
                // on close
                //更新界面信息，获取充电信息
                console.log(res.data)
              });
            } else {
              Notify({
                type: 'warning',
                message: res.data.msg,
                duration: 4000
              })
            }
          },
          fail: function(err) {
            Notify({
              type: 'warning',
              message: '网络错误，请检查网络'
            })
          }
        })
      } else {
        //取电池
        wx.request({
          url: API + '/v1/chargingapi/chargingCabinet/chargingRecord/' + recordId + '/requestOpen',
          method: 'POST',
          header: header,
          data: {
            cabinetId: that.data.cabinetInfo.id
          },
          success: function(res) {
            //取电成功，请随手关闭仓🚪
            if (res.statusCode == 200) {
              that.setData({
                btnTitle: '充电'
              })
              Dialog.alert({
                title: '提示',
                message: '仓门已开，请去取完电池后关闭仓门'
              }).then(() => {
                // on close
                // wx.navigateBack({})
                console.log(res.data)
              });
            } else {
              Notify({
                type: 'warning',
                message: res.data.msg,
                duration: 4000
              })
            }
          },
          fail: function() {
            Notify({
              type: 'warning',
              message: '网络错误，请检查网络'
            })
          }
        })
      }
    }
  },

  goRecharge: function() {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onUnload: function () {
    clearInterval(timer)
  },
})