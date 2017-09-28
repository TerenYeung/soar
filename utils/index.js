
const distanceSimplify = (opts) => {
  let {
    curPoint,
    location,
  } = opts
  
  const R = 6367000.0 // 地球半径
  let start = point2Json(curPoint),
      end = point2Json(location)
      
  let dx = start.longitude - end.longitude, // 经度差
      dy = start.latitude - end.latitude, // 纬度差
      avg = (start.latitude + end.latitude) / 2, // 平均纬度
      lx = R * toRadians(dx) * Math.cos(toRadians(avg)), // 东西距离
      ly = R * toRadians(dy) // 南北距离

  return parseInt(Math.sqrt(lx * lx + ly * ly))
}

const toRadians = (deg) => {
  return deg * Math.PI / 180
}

const point2Json = (point) => {
  let pointArr = point.split(',')

  return {
    longitude: parseFloat(pointArr[0]),
    latitude: parseFloat(pointArr[1]),
  }
}

module.exports = {
  distanceSimplify,
  point2Json,
}