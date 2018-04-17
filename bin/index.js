const downloadReadings = require('../lib')

downloadReadings((err, data) => {
  if (!err) {
    console.log(`${data.station.name}, ${data.param.label}, ${data.reading[1]}`)
  }
})
