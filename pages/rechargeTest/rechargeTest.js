// pages/rechargeTest/rechargeTest.js
import Notify from '../../utils/dist/notify/notify.js';
const app = getApp();
var API = app.globalData.API;
var common = require('../../utils/common.js')

var pileId = '';
var switchId = '';
var time = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeMoney: '',
    wx_url: '/resources/wx-icon.png',
    checked_icon: '/resources/checked-icon.png',
    uncheck_icon: '/resources/icon_unselected.png',
    payTypeArr: [{
        label: '微信',
        src: '/resources/wx-icon.png',
        isSelected: true
      },
      {
        label: '银联',
        src: '/resources/yinlian.png',
        isSelected: false
      },
      {
        label: '支付宝',
        src: '/resources/pay_alipay.png',
        isSelected: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      rechargeMoney: options.rechargeMoney
    })
    time = options.time
    pileId = options.pileId
    switchId = options.switchId
    console.log('')
  },

  selectType:function (e) {
    var item = e.currentTarget.dataset.item
    for (var i = 0; i < this.data.payTypeArr.length; i++) {
      var model = this.data.payTypeArr[i];
      if (item.label == model.label) {
        let choseChange = "payTypeArr[" + i + "].isSelected"
        this.setData({
          [choseChange]: true,
        })
      } else {
        let choseChange = "payTypeArr[" + i + "].isSelected"
        this.setData({
          [choseChange]: false,
        })
      }
    }
  },

  goRecharge:function() {

    wx.navigateTo({
      url: '../web/web',
    })
  },

  goCharging: function() {
    var that = this;
    var header = common.getHeader()
    
    wx.request({
      url: API + '/v1/chargingapi/pile/record',
      method: 'POST',
      header: header,
      data: {
        pileId: pileId,
        switchNo: switchId,
        duration: time
      },
      success: function(res) {
        if (res.statusCode == 200) {
          Notify({
            type: 'success',
            message: '开启充电成功',
            onClose: function () {
              wx.redirectTo({
                url: '../switchCharging/switchCharging?recordId=' + res.data.recordId,
              })
            }
          })
        } else if (res.statusCode == 403) {
          Notify({ type: 'warning', message: '抱歉，无法启动此设备' });
        } else if (res.statusCode == 404) {
          Notify({ type: 'warning', message: '开启失败，无此设备' })
        } else {
          Notify({ type: 'warning', message: '开启失败'+res.statusCode })
        }
      },
      fail: function(err) {
        Notify({type: 'warning', message: '开启充电失败，请检查网络'})
      }
    })
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