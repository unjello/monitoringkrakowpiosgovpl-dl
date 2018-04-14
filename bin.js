const downloadReadings = require('./index')

downloadReadings(r => {
  console.log(`${r.station.name}, ${r.param.label}, ${r.reading[1]}`)
})