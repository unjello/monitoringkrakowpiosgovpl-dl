const args = require('args')
const downloadReadings = require('../lib')
const Options = require('../lib/options')

args.option(['d', 'date'], 'Read air quality data for specific date', Options.default.date)
args.option(['s', 'station'], 'Read air quality data for specific station(s)', Options.default.station)
args.example('monitoringkrakowpiosgovpl-dl', 'To fetch data from today')
args.example('monitoringkrakowpiosgovpl-dl -d "2018-01-22"', 'To fetch data from January 22nd')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny', 'To fetch data from one station')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny -s nowahuta -s krasinskiego', 'To fetch data from multiple stations')

const main = async () => {
  const opts = args.parse(process.argv)
  const ratings = await Promise.all(await downloadReadings({ date: opts.date, station: opts.station }))
  for (const s of ratings) {
    console.log(`ℹ️  ${s.station.name}`)
    console.group()
    for (const c of s.data) {
      console.log(`🔸  ${c.label}`)
      console.group()
      for (const r of c.data) {
        console.log(`${r.value}`)
      }
      console.groupEnd()
    }
    console.groupEnd()
  }
}

main()
