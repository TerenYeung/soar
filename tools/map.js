const request = require('superagent')
const qs = require('query-string')
const path = require('path')
const j2csv = require('json2csv')
const fs = require('fs')

const toUrl = (params) => {
  let ret = qs.stringify(params)
  return `http://restapi.amap.com/v3/place/text?${ret}`
}

let poiFields = [
  'name',
  'type',
  'typecode',
  'address',
  'location',
  'location_geo',
  'pname',
  'cityname',
  'tel',
  'photos',
]
let buffer = []
let csvPath = path.resolve(__dirname, '../files/sites.csv')
var page = 1
var offset= 20

var typesList = ['风景名胜', '餐饮服务', '住宿服务', '购物服务']
var typesNo = 0

let getPoisAndWriteFiles = (typesNo) => {
  var opts = {
    key: 'ec0588e66ad7ecf7a0a6303c49ff5c83',
    types: typesList[typesNo],
    city: '大理',
    citylimit: true,
    offset,
    page,
    extensions: 'all',
  }
  request
        .get(toUrl(opts))
        .end((err, res) => {
          if (err) {
            console.log('err')
          } else {
            let data = JSON.parse(res.text).pois
            if (!data.length) {
              console.log('----------------------')
              console.log(`${typesList[typesNo]}请求完毕···`)
              console.log('----------------------')
              page = 1
              offset = 20
              typesNo++
              if (typesNo >= typesList.length) {
                console.log('数据请求完成···')
                return
              }
              return getPoisAndWriteFiles(typesNo)
            }
            // add geojson
            let ret = data.map(item => {
              let location = item.location.split(',')
              return Object.assign(item, {
                location_geo: {
                  coordinates:[...location],
                  type: "Point"
                },
              })
            })

            buffer = buffer.concat(ret)
            writeFile(buffer)
            
            page++
            offset = page * 20
            console.log('page', page)
            console.log('offset', offset)
            console.log('url', toUrl(opts))
            getPoisAndWriteFiles(typesNo)
          }
        })
}

let writeFile = (data) => {
  const csv = j2csv({
    data: data,
    fields: poiFields,
  })

  fs.writeFileSync(csvPath, csv)
}

getPoisAndWriteFiles(typesNo)
