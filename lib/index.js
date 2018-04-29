const fetch = require('node-fetch')
const Options = require('./options')
const moment = require('moment')
const Data = require('./data')

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

const buildDataQuery = (station, date, channels) => `query={"measType":"Auto","viewType":"Station","dateRange":"Day","date":"${moment(date).format('DD.MM.YYYY')}","viewTypeEntityId":"${station}","channels":[${channels}]}`
const downloadUrl = async (url, body) => fetch(url, { method: 'POST', body, headers })
const piosApiCall = async (url, body) => (await downloadUrl(url, body)).json()
const piosApiCallResponse = async (url, body) => {
  const data = await piosApiCall(url, body)
  if (!data.success) {
    throw new Error(`API call to ${url} failed.`)
  }
  return data
}

module.exports = async (callback, options) => {
  const opts = Options.get(options)

  try {
    const configuration = await piosApiCallResponse(krakowPiosConfigurationURL, 'measType=Auto')

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

    return Object.values(stations).map(async s => {
      const filter = channels[s.id].map(c => c.channel_id).join(',')
      const readings = await piosApiCallResponse(krakowPiosDataURL, buildDataQuery(s.id, opts.date, filter))

      const data = readings.data.series.map(p => ({
          label: p.label,
          code: p.paramCode,
          data: p.data.map(r => Data.getReading(r))
        })
      )

      return {
        station: s,
        data
      }
    })
  } catch (e) {
    console.error(e)
  }
}
