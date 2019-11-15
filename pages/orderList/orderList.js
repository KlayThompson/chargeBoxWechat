// pages/orderList/orderList.js
const app = getApp();
var API = app.globalData.API;
var common = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    orderDetail_url: '/resources/orderdetail.png',
    order_list: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadSwitchOrderList();
  },

  loadSwitchOrderList: function() {
    var that = this;
    var header = common.getHeader()
    wx.request({
      url: API + '/v1/chargingapi/pile/record/recent?currentPage=1',
      method: 'GET',
      header: header,
      success: function(res) {
        if (res.statusCode == 200) {
          that.setData({
            order_list: res.data.recordInfos
          })
        }
      },
      fail: function(err) {

      }
    })
  },

  onChange: function(event) {
    console.log(121212)
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.onLoad()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 2000);
  },

  showOrderDetail: function(event) {
    var order = event.currentTarget.dataset.order
    if (order.status == '充电') {
      wx.navigateTo({
        url: '../switchCharging/switchCharging?recordId=' + order.recordId,
      })
    } else {
      wx.navigateTo({
        url: '../switchOrderDetail/switchOrderDetail?order=' + JSON.stringify(order),
      })
    }
  }
})