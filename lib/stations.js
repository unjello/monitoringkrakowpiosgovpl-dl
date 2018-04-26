'use strict';

const stationsNameToId = {
  'krasinskiego': 6,
  'nowahuta': 7,
  'kurdwanow': 16,
  'dietla': 149,
  'piastow': 152,
  'zlotyrog': 153,
  'wadow': 161,
  'telimeny': 163
}
const stationsOfInterest = [ 6, 7, 16, 149, 152, 153, 161, 163 ]

const isOfInterest = id => stationsOfInterest.includes(id)
const normalizeStation = s => {
  if (typeof s === 'string') {
    if (!stationsNameToId.hasOwnProperty(s)) {
      throw new Error(
        `Invalid station name (${s}). Valid choices are: ${Object.keys(stationsNameToId)}`
      )
    }
    const id = stationsNameToId[s]
    if (!isOfInterest(id)) {
      throw new Error(
        `Recognized ${s} (${id}) as station, but it is not enabled for data download`
      )
    }
    return id
  } else if (typeof s === 'number') {
    if (!isOfInterest(s)) {
      throw new Error(
        `Station with id=${s} is not enabled for data download`
      )
    }
    return id    
  }

  throw new Error(
    `Station should be a string, or a number. Found: ${typeof s}`
  )
}
const get = station => Array.isArray(station) ? station.map(s => normalizeStation(s)) : [ normalizeStation(station) ]

module.exports = {
  default: Object.keys(stationsNameToId),
  isOfInterest,
  get
}
