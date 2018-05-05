const args = require('args')
const downloadReadings = require('../lib')
const Options = require('../lib/options')
const chalk = require('chalk')
const { table, getBorderCharacters } = require('table')
const { padColumns, formatColor, getEmoji } = require('./util')

args.option(['d', 'date'], 'Read air quality data for specific date', Options.default.date)
args.option(['s', 'station'], 'Read air quality data for specific station(s)', Options.default.station)
args.option(['t', 'table'], 'Format data as table', false)
args.example('monitoringkrakowpiosgovpl-dl', 'To fetch data from today')
args.example('monitoringkrakowpiosgovpl-dl -d "2018-01-22"', 'To fetch data from January 22nd')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny', 'To fetch data from one station')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny -s nowahuta -s krasinskiego', 'To fetch data from multiple stations')
args.example('monitoringkrakowpiosgovpl-dl -s telimeny -s nowahuta -t', 'Prints out tabbular data')
const getLimit = code => {
  if (code === 'PM10') return 50;
  if (code === 'PM2.5') return 25;
  throw new Error('unknown parameter')
}

const main = async () => {
  const opts = args.parse(process.argv)
  const ratings = await Promise.all(await downloadReadings({ date: opts.date, station: opts.station }))

  let data = {
    byCode: {},
    byStation: {}
  }

  for (const s of ratings) {
    for (const c of s.data) {
      if (!data.byCode[c.code]) {
        data.byCode[c.code] = []
      }
      if (!data.byCode[c.code][0]) {
        data.byCode[c.code][0] = []
      }
      data.byCode[c.code][0].push(s.station.name)
      const limit = getLimit(c.code)
      for (i = 0, j = 1; i < c.data.length; i++, j++) {
        if (!data.byCode[c.code][j]) {
          data.byCode[c.code][j] = []
        }
        data.byCode[c.code][j].push(`${formatColor(limit, (parseFloat(c.data[i].value)).toFixed(1))}`)
      }
    }
  }
  for (const code of Object.keys(data.byCode)) {
    padColumns(data.byCode[code], chalk.gray('-'))
  }

  if (opts.t) {
    options = {
      drawHorizontalLine: (index, size) => index === 0 || index === 1 || index === size,
      border: getBorderCharacters('norc')
    }
    console.log(table(data.byCode['PM2.5'], options))
    console.log(table(data.byCode['PM10'], options))
  } else {
    for (const s of ratings) {
      console.group(`ℹ️  ${chalk.gray(s.station.name)}`)
      for (const c of s.data) {
        const limit = getLimit(c.code)
        console.group(`${chalk.gray(c.label)}`)
        for (const r of c.data) {
          
          console.log(`${r.time} ${formatColor(limit, (parseFloat(r.value)).toFixed(1))} ${getEmoji(limit, r.value)}`)
        }
        console.groupEnd()
      }
      console.groupEnd()
    }
  }
}

main()
