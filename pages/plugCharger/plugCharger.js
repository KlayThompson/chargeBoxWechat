// pages/plugCharger/plugCharger.js
import Notify from '../../utils/dist/notify/notify.js';
const app = getApp();
var API = app.globalData.API;
var common = require('../../utils/common.js')

var pileId = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plugList: [
    ],
    select1: false,
    select2: false,
    submitDisable: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = JSON.parse(options.data)
    pileId = options.pileId
    
    var switchArr = [];
    for (var i = 0; i< data.length;i++) {
      var model = data[i];
      var newModel = {};
      if (model.status == '空闲中') {//空闲
        newModel = {
          title: model.switchNo,
          select: false,
          src: '/resources/plug_green.png',
          status: model.status,
        }
      } else if (model.status == '故障') {//故障
        newModel = {
          title: model.switchNo,
          select: false,
          src: '/resources/plug_error.png',
          status: model.status,
        }
      } else { //占用中
        newModel = {
          title: model.switchNo,
          select: false,
          src: '/resources/plug_inuse.png',
          status: model.status,
        }
      }
      switchArr.push(newModel);
    }
    this.setData({
      pileNum: options.pileNum,
      plugList: switchArr
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  selectSwitch: function(event) {
    var num = event.currentTarget.dataset.num;
    var d = this.data.plugList[num-1];
    if (d.status != '空闲中') {
      return;
    }

    for (var i = 0; i < this.data.plugList.length; i++) {
      var model = this.data.plugList[i];
      if (num == model.title) {
        let choseChange = "plugList[" + i + "].select"
        this.setData({
          [choseChange]: true,
        })
      } else {
        let choseChange = "plugList[" + i + "].select"
        this.setData({
          [choseChange]: false,
        })
      }
    }

    if (this.data.select1 || this.data.select2) {
      this.setData({
        submitDisable: false,
      })
    } else {
      this.setData({
        submitDisable: true,
      })
    }
  },

  selectMoney: function(event) {
    var money_num = event.target.dataset.money
    if (money_num == 1) {
      this.setData({
        select1: true,
        select2: false,
      })
    } else if (money_num == 2) {
      this.setData({
        select1: false,
        select2: true,
      })
    } else {
      this.setData({
        select1: false,
        select2: false,
      })
    }

    if (this.data.select1 || this.data.select2) {
      for (var i = 0; i < this.data.plugList.length; i++) {
        var model = this.data.plugList[i];
        if (model.select) {
          this.setData({
            submitDisable: false
          })
        }
      }
    }
  },
// 开启充电
  startCharge: function() {
    console.log('开启充电...' + pileId)
    
    var that = this;
    var header = common.getHeader()
    var switchId;
    for (var i = 0; i<that.data.plugList.length; i++) {
      var model = that.data.plugList[i];
      if (model.select) {
        switchId = model.title
      }
    }

    var time = 0;
    if (this.data.select1) {//一块钱，3小时
      time = 3600 * 3;
    } else {
      time = 3600 * 6;
    }
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
  }
})