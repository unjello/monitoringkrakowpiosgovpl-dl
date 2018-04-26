'use strict'

const Stations = require('./stations')

const defaultOptions = {
  date: new Date(),
  station: Stations.default
}

const get = opts =>  normalize(Object.assign({}, defaultOptions, opts))
const normalize = opts => {
  opts.date = normalizeDate(opts.date)
  opts.station = Stations.get(opts.station)
  return opts
}

const normalizeDate = date => {
  if (typeof date === 'object' && date instanceof Date) {
    return date
  } else if (typeof date === 'string') {
    return Date.parse(date)
  }
  
  throw new Error(
    'date needs to be either Date object, or string in format respected by Date.parse() method (RFC2822, and version of ISO8601)'
  )
}

module.exports = {
  default: defaultOptions,
  get
}