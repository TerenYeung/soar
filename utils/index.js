
const distanceSimplify = (opts) => {
  let {
    curPoint,
    location,
  } = opts
  
  const R = 6367000.0 // 地球半径
  let one = point2Json(curPoint),
      two = point2Json(location)
      
  let dx = one.lg - two.lg, // 经度差
      dy = one.la - two.la, // 纬度差
      avg = (one.la + two.la) / 2, // 平均纬度
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
    lg: parseFloat(pointArr[0]),
    la: parseFloat(pointArr[1]), 
  }
}

module.exports = {
  distanceSimplify,
  point2Json,
}