//index.js
import Notify from '../../utils/dist/notify/notify.js';
const app = getApp();
var API = app.globalData.API;
var common = require('../../utils/common.js')

// // 引入SDK核心类
let QQMapWX = require('../../libs/qqmap-wx-jssdk1/qqmap-wx-jssdk.js');

// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'YUPBZ-Z7MWO-G75WY-SK7RG-BKK7Z-KYFH5'
});
var windowWidth, windowHeight
var localItemWith = 44
var localLeftMargin = 10

Page({
  data: {
    isLogin: true,
    controls: [{
        id: 0,
        iconPath: '../../resources/selected_location.png',
        position: {
          left: 0,
          top: 0,
          width: 20,
          height: 40
        },
        clickable: false
      },
      {
        id: 1,
        iconPath: '../../resources/locate.png',
        position: {
          left: localLeftMargin,
          top: 480 - 50,
          width: localItemWith,
          height: localItemWith
        },
        clickable: true
      },
      {
        id: 2,
        iconPath: '../../resources/map_user.png',
        position: {
          left: 0,
          top: 600 - 100,
          width: localItemWith,
          height: localItemWith
        },
        clickable: true
      },
      {
        id: 3,
        iconPath: '../../resources/map_scan.jpg',
        position: {
          left: 100,
          top: 600 - 100,
          width: 168,
          height: 50
        },
        clickable: true
      },
      {
        id: 4,
        iconPath: '../../resources/map_search.png',
        position: {
          left: 100,
          // top: 600 - 100,
          width: localItemWith,
          height: localItemWith
        },
        clickable: true
      }
    ],
  },
  onLoad: function() {
    let that = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        windowHeight = res.windowHeight;
        windowWidth = res.windowWidth;
        that.setData({
          mapHeight: res.windowHeight,
          "controls[0].position.left": (windowWidth / 2) - 10,
          "controls[0].position.top": (windowHeight / 2) - 35,
          "controls[1].position.top": (windowHeight - 80),
          "controls[2].position.top": (windowHeight - 76),
          "controls[2].position.left": (windowWidth - localItemWith - localLeftMargin),
          "controls[3].position.top": (windowHeight - 80),
          "controls[3].position.left": (windowWidth - 168) * 0.5,
          "controls[4].position.top": (windowHeight - 140),
          "controls[4].position.left": 10
        })
      },
    })
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 15
        });
      }
    })
    // 判断是否登录
    var isLogin = wx.getStorageSync("isLogin");
    this.setData({
      isLogin: !isLogin
    })
  },

  onShow: function() {
    var isLogin = wx.getStorageSync("isLogin");
    this.setData({
      isLogin: isLogin
    })
  },

  goLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  controltap: function(evevt) {
    console.log(evevt.controlId)
    var that = this;
    if (evevt.controlId == 1) { // 定位
      that.moveToLocation();
      wx.navigateTo({
        url: '../chargeCabinet/chargeCabinet?cabinetNo=AY01A00YX18110009',
      })
    } else if (evevt.controlId == 2) { // 个人中心
      //是否登录
      var url = '../user/user';
      if (!this.data.isLogin) {
        url = '../login/login';
      }
      wx.navigateTo({
        url: url,
      })

    } else if (evevt.controlId == 3) { // 扫码解锁
      //充电桩
      // wx.navigateTo({
      //   url: '../plugCharger/plugCharger',
      // })
      var login = wx.getStorageSync('isLogin');
      if (login) {
        this.scanCode();
      } else {
        //去登录
        wx.navigateTo({
          url: '../login/login',
        })
      }
    } else if (evevt.controlId == 4) { // 搜索
      wx.navigateTo({
        url: '../search/search',
      })
    }
  },

  // 扫码
  scanCode: function(event) {
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
          if (r == -1) {} else {
            var subArr = res.path.split('=')
            scanResult = subArr.pop()
          }
        } else { // device code
          var path = res.result
          var baseQrCodeUrl = '/' //app.globalData.BaseQrCodeUrl
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
        that.uploadCodeToServe(scanResult)
      },

      fail: (res) => {
        // that.showErrorMsg("扫码功能调用失败");
      }
    })
  },

  // 上传设备信息到服务端，判断属于何种装备
  uploadCodeToServe: function (scanResult) {
    var that = this;
    var header = common.getHeader()
    //先调用充电桩
    wx.request({
      url: API + '/v1/chargingapi/pile?pileNo=' + scanResult,
      method: 'GET',
      header: header,
      success: function(res) {
        if (res.statusCode == 200) {
          wx.navigateTo({
            url: '../plugCharger/plugCharger?data=' + JSON.stringify(res.data.switches) + '&pileId=' + res.data.id + '&pileNum=' + scanResult,
          }) 
        } else if(res.statusCode == 401) {//需要登录
          
        } else if (res.statusCode == 500) {
          Notify({ type: 'warning', message: '内部错误，请联系相关人员' })
        } else if (res.statusCode == 404) {
          //查询是否是充电柜
          wx.request({
            url: API + '/v1/chargingapi/chargingCabinet?cabinetNo=' + scanResult,
            method: 'GET',
            header: header,
            success: function(res) {
              if (res.statusCode == 200) {
                wx.navigateTo({
                  url: '../chargeCabinet/chargeCabinet?cabinetNo=' + scanResult,
                })
              }
            },
            fail: function() {
              Notify({ type: 'warning', message: '网络错误，请检查网络' })
            }
          })
        }
        // wx.navigateTo({
        //   url: '../chargeCabinet/chargeCabinet?cabinetId=' + scanResult,
        //   })
      },
      fail: function(err) {
        Notify({type: 'warning', message: '网络错误，请检查网络'})
      }
    })
  },

  moveToLocation: function() {
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
  },
})