//index.js
//获取应用实例

const app = getApp(),
      AMap = require('../../lib/amap-wx.js')

Page({
  data: {
    markers: [{
      iconPath: "../../static/img/site-start.png",
      id: 0,
      latitude: 39.98964,
      longitude: 116.481028,
      width: 30,
      height: 30
    },{
      iconPath: "../../static/img/site-end.png",
      id: 0,
      latitude: 39.90816,
      longitude: 116.434446,
      width: 30,
      height: 30
    }],
    distance: '',
    cost: '',
    polyline: [],
    curLatitude: 39.98964,
    curLongitude: 116.481028,
    duration: '',
    steps: [],
    showDetail: false
  },

  onLoad(opts) {
    console.log('opts', opts)
    
    let {markers} = this.data

    markers[0].longitude = opts.start.split(',')[0]
    markers[0].latitude = opts.start.split(',')[1]
    markers[1].longitude = opts.end.split(',')[0]
    markers[1].latitude = opts.end.split(',')[1]

    this.setData({
      markers,
      curLongitude: parseFloat(opts.start.split(',')[0]),
      curLatitude: parseFloat(opts.start.split(',')[1]),
    })

    var that = this;
    var myAmapFun = new AMap.AMapWX({key: app.globalData.AMapKey})
    myAmapFun.getDrivingRoute({
      origin: opts.start,
      destination: opts.end,
      success(data) {
        console.log('route', data)
        var points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
          }
          that.setData({
            steps: data.paths[0].steps,
          })
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 4
          }]
        });
        if(data.paths[0] && data.paths[0].distance){
          that.setData({
            distance: '距离：' + data.paths[0].distance + '米'
          });
        }
        if(data.taxi_cost){
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
        if(data.paths[0] && data.paths[0].duration) {
          that.setData({
            duration: '耗时：' + that.formatTime(data.paths[0].duration)
          })
        }
          
      },
      fail(info) {

      }
    })
  },

  formatTime(second){
    let min = second < 60 ? '' : Math.floor(second / 60)
    
    second = second > 59 ? second % 60 : second
    return `${min} 分 ${second} 秒`
  }, 
  
  showDetail(){
    let {showDetail} = this.data
    this.setData({
      showDetail: !showDetail,
    })
  },
})