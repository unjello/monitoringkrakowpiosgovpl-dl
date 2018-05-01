'use strict'

const moment = require('moment-timezone')

const getReading = r => {
  const timestamp = moment.unix(r[0]).tz('Europe/Warsaw')
  return {
    date: timestamp.format(),
    time: timestamp.format('HH'),
    value: r[1]
  }
}

module.exports = {
  getReading
}