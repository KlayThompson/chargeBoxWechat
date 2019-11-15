// pages/user/user.js
import Dialog from '../../utils/dist/dialog/dialog.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568972959722&di=525def159ea8219176f08779744ddf75&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F83%2F73%2F01300543312403143631739676814_s.jpg',
    userName: '18217602034',
    walletIcon_url: '/resources/money.png',
    wallet_url: '../wallet/wallet',
    carIcon_url: '/resources/diandongche.png',
    car_url: '../car/car',
    batteryIcon_url: '/resources/battery.png',
    battery_url: '../battery/battery',
    discountIcon_url: '/resources/youhuiquan.png',
    package_url: '../package/package',
    arrow_icon_url: '/resources/arrow-right.png',
    orderListIcon_url: '/resources/order_list.png',
    orderList_url: '../orderList/orderList'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  changeUser: function () {
    Dialog.confirm({
      title: '提示',
      message: '确定要切换账号吗？切换账号会退出当前登录账号'
    }).then(() => {
      // on confirm
      wx.clearStorageSync()
      wx.redirectTo({
        url: '../login/login'
      })
    }).catch(() => {
      // on cancel
    });
    
  }
})