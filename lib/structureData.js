'use strict'

const chalk = require('chalk')

const getLimit = code => {
  if (code === 'PM10') return 50;
  if (code === 'PM2.5') return 25;
  throw new Error('unknown parameter')
}

module.exports = (ratings, cb) => {
  let data = {
    byCode: {},
    byStation: {}
  }

  for (const s of ratings) {
    for (const c of s.data) {
      if (!data.byCode[c.code]) {
        data.byCode[c.code] = []
      }
      if (!data.byCode[c.code][0]) {
        data.byCode[c.code][0] = []
      }
      data.byCode[c.code][0].push(s.station.name)
      const limit = getLimit(c.code)
      for (let i = 0, j = 1; i < c.data.length; i++, j++) {
        if (!data.byCode[c.code][j]) {
          data.byCode[c.code][j] = []
        }
        data.byCode[c.code][j].push(cb(limit, c.data[i].value))
      }
    }
  }

  return data
}