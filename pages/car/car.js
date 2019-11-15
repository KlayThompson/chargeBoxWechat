// pages/car/car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo_url: '/resources/car_empty.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 扫码添加车辆
   */
  addCar() {
    var that = this;

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log(res)
        var scanResult = ''
        var scanType = res.scanType
        if (scanType == 'WX_CODE') { // wx code
          var r = res.path.indexOf('=')
          if (r == -1) {
          } else {
            var subArr = res.path.split('=')
            scanResult = subArr.pop()
          }
        } else { // device code
          var path = res.result
          var baseQrCodeUrl = '/'//app.globalData.BaseQrCodeUrl
          if (path.indexOf(baseQrCodeUrl) != -1) {
            var pathArr = []
            pathArr = path.split('/')
            scanResult = pathArr[pathArr.length - 1]
          } else {
            scanResult = res.result
          }
        }
        // that.checkScanResult(device_number);
        console.log('扫描结果:' + scanResult)
      },

      fail: (res) => {
        // that.showErrorMsg("扫码功能调用失败");
      }
    })
  }
})