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

module.exports = {
  default: stationsOfInterest,
  isOfInterest
}
