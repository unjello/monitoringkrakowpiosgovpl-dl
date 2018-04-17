const fetch = require('node-fetch')
const format = require('date-fns/format')

const krakowPiosConfigurationURL = 'http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/wczytaj-konfiguracje'
const krakowPiosDataURL = 'http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/pobierz'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0'

const stationsOfInterest = [ 6, 7, 16, 149, 152, 153, 161, 163 ]
const paramsOfInterest = [ 'pm10', 'pm2.5' ]

const headers = {
  'User-Agent': userAgent,
  'Host': 'monitoring.krakow.pios.gov.pl',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0'
}

const buildDataQuery = (station, date, channels) => `query={"measType":"Auto","viewType":"Station","dateRange":"Day","date":"${format(date, 'DD.MM.YYYY')}","viewTypeEntityId":"${station}","channels":[${channels}]}`
const downloadUrl = async (url, body) => fetch(url, { method: 'POST', body, headers })

const defaultOptions = {
  date: new Date()
}

module.exports = async (callback, options) => {
  const opts = Object.assign({}, options, defaultOptions)

  if (typeof opts.date === 'object' && opts.date instanceof Date) {
    // do nothing
  } else if (typeof opts.date === 'string') {
    opts.date = Date.parse(opts.date)
  } else {
    throw new Error(
      'date needs to be either Date object, or string in format respected by Date.parse() method (RFC2822, and version of ISO8601)'
    )
  }
  try {
    const response = await downloadUrl(krakowPiosConfigurationURL, 'measType=Auto')
    const configuration = await response.json()
    if (!configuration.success) {
      throw new Error(`Couldn't get configuration. API call response indicates failure.`)
    }

    const stations = configuration.config.stations
      .filter(s => stationsOfInterest.includes(s.id))
      .reduce((map, s) => {
        map[s.id] = s
        return map
      }, {})

    const channels = configuration.config.channels
      .filter(c => c.station_id in stations)
      .filter(c => paramsOfInterest.includes(c.param_id))
      .reduce((map, c) => {
        map[c.station_id] = map[c.station_id] || []
        map[c.station_id].push(c)
        return map
      }, {})

    Object.values(stations).slice(0, 1).forEach(async s => {
      const filter = channels[s.id].map(c => c.channel_id).join(',')
      const response = await downloadUrl(krakowPiosDataURL, buildDataQuery(s.id, opts.date, filter))
      const readings = await response.json()
      if (!configuration.success) {
        throw new Error(`Couldn't get monitoring data for ${s.name} on ${format(opts.date, 'YYYY-MM-DD')}. API call response indicates failure.`)
      }
      readings.data.series
        .forEach(param => {
          param.data.forEach(reading => {
            callback(null, {station: s, param, reading})
          })
        })
    })
  } catch (e) {
    console.error(e)
  }
}
