const args = require('args')
const downloadReadings = require('../lib')

args.option(['d', 'date'], 'Read air quality data for specific date')
args.example('monitoringkrakowpiosgovpl-dl', 'To fetch data from today')
args.example('monitoringkrakowpiosgovpl-dl -d "2018-01-22"', 'To fetch data from January 22nd')
const opts = args.parse(process.argv)

downloadReadings((err, data) => {
  if (!err) {
    console.log(`${data.station.name}, ${data.param.label}, ${data.reading[1]}`)
  }
},{
  date: opts.date || new Date()
})
