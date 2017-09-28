const utils = require('../utils/index')
const geo = require('../lib/node-geo-distance')

let getRegionSites = (opts, cb) => {
  let {
    isRefresh,
    ctx
  } = opts

  let {
    SITES,
    pageNo,
    pageSize,
    totalPage,
    totalCount,
    curPoint,
    currentList,
    activeTitle,
  } = ctx.data

  if (!isRefresh && pageNo != 0 && pageNo >= totalPage) {
    ctx.setData({
      loadHide: true,
    })
    return
  }

  ctx.setData({
    loadHide: true
  })

  let pageNum = isRefresh ? 0 : pageNo
  let limit = pageSize
  let offset = limit * pageNum

  let
      arr = curPoint.split(','),
      point = new wx.BaaS.GeoPoint(+arr[0], +arr[1]),
      Sites = new wx.BaaS.TableObject(SITES),
      query = new wx.BaaS.Query()

  query
    .contains('type', activeTitle)
    .withinRegion('location_geo', point, 100000, 0)

  Sites
      .setQuery(query)
      .limit(limit)
      .offset(offset)
      .find()
      .then(res => {
        console.log('res', res)
        // cb(res)
        ctx.setData({
          loadHide: true,
          pageNo: pageNo + 1,
          totalPage: Math.ceil(res.data.meta.total_count / pageSize),
          totalNum: res.data.meta.total_count,
        })

        var objects = res.data.objects

        let list = objects.map(item => {
          let location = item.location
          var photos = []

          try {
            photos = JSON.parse(item.photos)
          } catch (err) {
            photos = []
          }
          let start = utils.point2Json(curPoint)
          let end = utils.point2Json(location)

          return Object.assign(item, {
            address: item.address == '[]' ? '' : item.address,
            // distance: utils.distanceSimplify(opts),
            distance: parseInt(geo.vincentySync(start, end)),
            type: item.type.split(';'),
            tel: (item.tel == '[]' ? '' : item.tel.split(';').join('/')),
            photos: photos.length == 0 ? [{url: ctx.data.noImg}] : photos
          })
        })
          if (isRefresh) {

            ctx.setData({
              currentList: list,
            })
          } else {
            let ret = currentList.concat(list)
            ctx.setData({
              currentList: ret
            })
          }

      })
}

module.exports = {
  getRegionSites
}