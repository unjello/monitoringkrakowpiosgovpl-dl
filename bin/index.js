const args = require('args')
const downloadReadings = require('../lib')
const structureData = require('../lib/structureData')
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


const main = async () => {
  const opts = args.parse(process.argv)
  const ratings = await Promise.all(await downloadReadings({ date: opts.date, station: opts.station }))
  const data = structureData(ratings, (limit, value) => `${formatColor(limit, (parseFloat(value)).toFixed(1))}${getEmoji(limit, value)}`)

  if (opts.t) {
    for (const code of Object.keys(data.byCode)) {
      padColumns(data.byCode[code], chalk.gray('-'))
    }
  
    options = {
      drawHorizontalLine: (index, size) => index === 0 || index === 1 || index === size,
      border: getBorderCharacters('norc')
    }
    console.log(table(data.byCode['PM2.5'], options))
    console.log(table(data.byCode['PM10'], options))
  } else {
    for (const s of Object.keys(data.byStation)) {
      console.group(`ℹ️  ${chalk.gray(s)}`)
      for (const c of Object.keys(data.byStation[s])) {
        console.group(`${chalk.gray(c)}`)
        for (const r of data.byStation[s][c]) {
          console.log(r)
        }
        console.groupEnd()
      }
      console.groupEnd()
    }
  }
}

main()
