const downloadReadings = require('./index')

downloadReadings((err, data) => {
  if (!err) {
    console.log(`${data.station.name}, ${data.param.label}, ${data.reading[1]}`)
  }
})
