// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one_choose: true,
    two_choose: false,
    three_choose: false,
    four_choose: false,
    five_choose: false,
    selectMoney: 99,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 选择支付金额
  chooseRechargeMoney: function (event) {
    var money_num = event.target.dataset.money
    var that = this
    if (money_num == '99') {
      that.setData({
        one_choose: true,
        two_choose: false,
        three_choose: false,
        four_choose: false,
        five_choose: false,
        selectMoney: 99
      })
    } else if (money_num == '199') {
      that.setData({
        one_choose: false,
        two_choose: true,
        three_choose: false,
        four_choose: false,
        five_choose: false,
        selectMoney: 199
      })
    } else if (money_num == '299') {
      that.setData({
        one_choose: false,
        two_choose: false,
        three_choose: true,
        four_choose: false,
        five_choose: false,
        selectMoney: 299
      })
    } else if (money_num == '599') {
      that.setData({
        one_choose: false,
        two_choose: false,
        three_choose: false,
        four_choose: true,
        five_choose: false,
        selectMoney: 599
      })
    } else if (money_num == '350') {
      that.setData({
        one_choose: false,
        two_choose: false,
        three_choose: false,
        four_choose: false,
        five_choose: true,
        selectMoney: 350
      })
    }
  },
})