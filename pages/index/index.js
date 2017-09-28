//index.js
//获取应用实例

const
  app = getApp(),
  AMap = require('../../lib/amap-wx.js'),
  sites = require('../../io/sites'),
  utils = require('../../utils/index')

const geo = require('../../lib/node-geo-distance')

Page({
  data: {

    loadHide: true,
    // curPoint: app.globalData.curPoint,
    curPoint: '100.165937,25.694973', // 大理古城，测试坐标
    SITES: app.globalData.TABLE_ID.SITES,
    currentList: [],
    noImg:  'https://cloud-minapp-3906.cloud.ifanrusercontent.com/1dwpzjokssiMaFdj.jpeg',
    weatherIcon: '../../static/img/weather2.png',
    pageNo: 0, // 当前分页
    pageSize: 10, // 单页数量
    offset: 0, //
    totalPage: 0,  // 总页数
    totalCount: 0, // 总数量
    catNo: 0,
    activeTitle: '风景名胜',
    interestId: 0,
    restaurantId: 1,
    hotelId: 2,
    shopId: 3,
    tabBar: [
      {
        title: '风景名胜',
        alias: '风景',
        id: 0,
        img: '../../static/img/landscape.png',
      }, {
        title: '餐饮服务',
        alias: '餐饮',
        id: 1,
        img: '../../static/img/restaurant.png',
      }, {
        title: '住宿服务',
        alias: '住宿',
        id: 2,
        img: '../../static/img/hotel.png',
      }, {
        title: '购物服务',
        alias: '商店',
        id: 3,
        img: '../../static/img/store.png',
      }
    ]
  },

  onLoad(options) {

    let opts = {
      ctx: this,
      isRefresh: true,
    }
    sites.getRegionSites(opts)
  },
  
  changeCat(e) {
    let catId = e.currentTarget.dataset.catid,
        activeTitle = e.currentTarget.dataset.title

    this.setData({
      catNo: catId,
      activeTitle,
    })

    let opts = {
      ctx: this,
      isRefresh: true,
    }
    sites.getRegionSites(opts)
  },

  bindLower(e) {
    console.log('lower')

    let opts = {
      isRefresh: false,
      ctx: this,
    }
    sites.getRegionSites(opts)
  },

  goToWeather() {
    let weather = JSON.stringify(this.data.weather)
    let url = `/pages/weather/weather`

    wx.navigateTo({
      url,
    })
  },

  goThere(e) {
    let start = e.currentTarget.dataset.start,
        end = e.currentTarget.dataset.end
    
    let url =  `/pages/route/route?start=${start}&&end=${end}`

    wx.navigateTo({
      url,
    })
  }
})