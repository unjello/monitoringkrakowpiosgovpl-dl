'use strict'

const moment = require('moment-timezone')

const getReading = r => {
  return {
    date: moment.unix(r[0]).tz('Europe/Warsaw').format(),
    value: r[1]
  }
}

module.exports = {
  getReading
}