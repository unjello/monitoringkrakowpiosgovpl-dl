const args = require('args')
const downloadReadings = require('../lib')
const Options = require('../lib/options')

args.option(['d', 'date'], 'Read air quality data for specific date', Options.default.date)
args.option(['s', 'station'], 'Read air quality data for specific station(s)', Options.default.station)
args.example('monitoringkrakowpiosgovpl-dl', 'To fetch data from today')
args.example('monitoringkrakowpiosgovpl-dl -d "2018-01-22"', 'To fetch data from January 22nd')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny', 'To fetch data from one station')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny -s nowahuta -s krasinskiego', 'To fetch data from multiple stations')
const opts = args.parse(process.argv)

downloadReadings((err, data) => {
  if (!err) {
    console.log(`${data.station.name}, ${data.param.label}, ${data.reading[1]}`)
  }
},{
  date: opts.date,
  station: opts.station
})
