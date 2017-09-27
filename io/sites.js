
let getSiteList = (opts, cb) => {
  
  let {
    tableID,
    ctx
  } = opts

  let 
      query = new wx.BaaS.Query(),
      Sites = new wx.BaaS.TableObject(tableID)
  
  Sites.setQuery({})
        .find()
        .then(res => {
          console.log('siteList', res)
          cb(res)
        }, err => {

        })
}

let getRegionSites = (opts, cb) => {
  let {
    tableID,
    curPoint,
    ctx,
    title,
    offset,
    limit,
    ...rest,
  } = opts

  let
      arr = curPoint.split(','),
      point = new wx.BaaS.GeoPoint(+arr[0], +arr[1]),
      Sites = new wx.BaaS.TableObject(tableID),
      query = new wx.BaaS.Query()

  query
    .contains('type', title)
    .withinRegion('location_geo', point, 100000, 0)

  Sites
      .setQuery(query)
      .limit(limit)
      .offset(offset)
      .find()
      .then(res => {
        console.log('r', res)
        cb(res)
      })
}

module.exports = {
  getSiteList,
  getRegionSites
}