//app.js
const AMap = require('./lib/amap-wx')

App({
  onLaunch: function() {
    let that = this

    // 引入 BaaS SDK
    require('./lib/sdk-v1.1.0')

    // 从 BaaS 后台获取 ClientID
    let clientId = this.globalData.CLIENT_ID

    wx.BaaS.init(clientId)

    let userId = this.getUserId()
    if (!userId) {
      wx.BaaS.login()
        .then(res => {
          console.log('BaaS is logined!')
        }).catch(err => {
          console.dir(err)
        })
    }
    
    this.getSystemInfo()
    this.getWeather()
  },

  getUserId() {
    if (this.userId) {
      return this.userId
    }

    this.userId = wx.BaaS.storage.get('uid')
    return this.userId
  },

  getSystemInfo() {
    wx.getSystemInfo({
      success(res) {
        this.systemInfo = res
      }
    })
  },

  getWeather(e) {
    let aMap = new AMap.AMapWX({
      key: this.globalData.AMapKey
    })
    let _this = this
    aMap.getWeather({
      success(res) {
        console.log('weather', res)
        _this.globalData.weather = res
        
      },
      fail(err) {
      }
    })
  },

  getCurLocation() {
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        let {longitude, latitude} = res
        this.globalData.curPoint = `${longitude},${longitude}`
      }
    })
  },

  globalData: {
    systemInfo: {},
    TABLE_ID: {
      SITES: 1984,
    }, // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取

    CLIENT_ID: '', // 从知晓云开发者平台获取

    AMapKey: '', // 高德地图小程序 SDK key
    weather: null,
    curPoint: '',
  }
})
