//index.js
//获取应用实例

const app = getApp()


Page({
  data: {
    weather: null,
  },

  onLoad(opts) {

    this.setData({
      weather: app.globalData.weather,
    })
  },

  
})