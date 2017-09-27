//index.js
//获取应用实例

const
  app = getApp(),
  AMap = require('../../lib/amap-wx.js'),
  sites = require('../../io/sites'),
  utils = require('../../utils/index')

Page({
  data: {

    loadHide: true,
    // curPoint: app.globalData.curPoint,
    curPoint: '100.165937,25.694973', // 大理古城，测试坐标
    SITES: app.globalData.TABLE_ID.SITES,
    currentList: [],
    noImg:  'https://cloud-minapp-3906.cloud.ifanrusercontent.com/1dwpzjokssiMaFdj.jpeg',
    weatherIcon: '../../static/img/weather2.png',
    pageNo: 0,
    offset: 0,
    limit: 10,
    total_count: 0,
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
        title: '商店服务',
        alias: '商店',
        id: 3,
        img: '../../static/img/store.png',
      }
    ]
  },

  onLoad(options) {
    let opts = {
      offset: 0,
      limit: 10,
      pageNo: 0,
      tableID: this.data.SITES,
      curPoint: this.data.curPoint,
      ctx: this,
      isRefresh: true,
      title: this.data.activeTitle,
    }
    this.getRegionSites(opts)
  },

  getRegionSites(opts) {
    
    let { isRefresh, pageNo } = opts,
        { currentList, curPoint, loadHide } = this.data

    this.setData({
      loadHide: false,
    })
    
    sites.getRegionSites(opts, (res) => {
      let data = res.data.objects
      let list = data.map(item => {
        let
          location = item.location,
          opts = {
            curPoint,
            location,
          },
          photos = JSON.parse(item.photos)
        console.log('res', item)
        return Object.assign(item, {
          address: item.address == '[]' ? '' : item.address,
          distance: utils.distanceSimplify(opts),
          type: item.type.split(';'),
          tel: (item.tel == '[]' ? '' : item.tel.split(';').join('/')),
          photos: photos.length == 0 ? [{url: this.data.noImg}] : photos
        })
      })

      if (isRefresh) {
        this.setData({
          currentList: list,
          pageNo,
          loadHide: true,
        })
      } else {
        let ret = currentList.concat(list)
        this.setData({
          currentList: ret,
          pageNo,
          loadHide: true,
        })
      }
    })
  },

  changeCat(e) {
    let catId = e.currentTarget.dataset.catid,
        activeTitle = e.currentTarget.dataset.title,
        {offset, limit, SITES, curPoint} = this.data

    this.setData({
      catNo: catId,
      activeTitle,
      currentList: null,
    })

    let opts = {
      offset: 0,
      limit: 10,
      pageNo: 0,
      tableID: this.data.SITES,
      curPoint: this.data.curPoint,
      ctx: this,
      isRefresh: true,
      title: activeTitle,
    }

    this.getRegionSites(opts)
  },

  bindLower(e) {
    console.log('lower')
    let {
        pageNo,
        SITES,
        limit,
        curPoint,
        activeTitle,
      } = this.data

    // 页数 + 1
    pageNo++
    let offset = pageNo * limit

    let opts = {
      pageNo,
      offset,
      limit,
      tableID: SITES,
      curPoint,
      ctx: this,
      isRefresh: false,
      title: activeTitle,
    }
    this.getRegionSites(opts)
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