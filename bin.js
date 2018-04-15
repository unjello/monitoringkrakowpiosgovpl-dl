const downloadReadings = require('./index')

downloadReadings((err, data) => {
  console.log(`${data.station.name}, ${data.param.label}, ${data.reading[1]}`)
})
