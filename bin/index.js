const args = require('args')
const downloadReadings = require('../lib')
const Options = require('../lib/options')
const chalk = require('chalk')

args.option(['d', 'date'], 'Read air quality data for specific date', Options.default.date)
args.option(['s', 'station'], 'Read air quality data for specific station(s)', Options.default.station)
args.example('monitoringkrakowpiosgovpl-dl', 'To fetch data from today')
args.example('monitoringkrakowpiosgovpl-dl -d "2018-01-22"', 'To fetch data from January 22nd')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny', 'To fetch data from one station')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny -s nowahuta -s krasinskiego', 'To fetch data from multiple stations')
const getLimit = code => {
  if (code === 'PM10') return 50;
  if (code === 'PM2.5') return 25;
  throw new Error('unknown parameter')
}
const formatColor = (limit, value) => {
  if (value > limit) {
    return chalk.red.bold(value)
  }
  if (value > limit * 0.85) {
    return chalk.red(value)
  }
  if (value > limit * 0.5) {
    return chalk.yellow(value)
  }
  return chalk.green(value)
}
const emoji = (limit, value) => {
  if (value > limit * 3) {
    return '☢'
  }
  if (value > limit * 1.5) {
    return '🚷'
  }
  if (value > limit) {
    return '🛑'
  }
  if (value > limit * 0.85) {
    return '⚠️'
  }
  return ''
}
const main = async () => {
  const opts = args.parse(process.argv)
  const ratings = await Promise.all(await downloadReadings({ date: opts.date, station: opts.station }))
  for (const s of ratings) {
    console.log(`ℹ️  ${chalk.gray(s.station.name)}`)
    console.group()
    for (const c of s.data) {
      console.log(`🔸  ${chalk.gray(c.label)}`)
      const limit = getLimit(c.code)
      console.group()
      for (const r of c.data) {
        
        console.log(`${formatColor(limit, r.value)} ${emoji(limit, r.value)}`)
      }
      console.groupEnd()
    }
    console.groupEnd()
  }
}

main()
