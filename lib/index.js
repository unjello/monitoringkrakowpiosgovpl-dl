const fetch = require('node-fetch')
const format = require('date-fns/format')
const Options = require('./options')

const krakowPiosConfigurationURL = 'http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/wczytaj-konfiguracje'
const krakowPiosDataURL = 'http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/pobierz'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0'

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

module.exports = async (callback, options) => {
  const opts = Options.get(options)

  try {
    const response = await downloadUrl(krakowPiosConfigurationURL, 'measType=Auto')
    const configuration = await response.json()
    if (!configuration.success) {
      throw new Error(`Couldn't get configuration. API call response indicates failure.`)
    }

    const stations = configuration.config.stations
      .filter(s => opts.station.includes(s.id))
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

    Object.values(stations).forEach(async s => {
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
