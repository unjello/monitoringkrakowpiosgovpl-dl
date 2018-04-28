const Options = require('./options')
const moment = require('moment')

const isToday = date => moment.duration(moment().diff(moment(date))).days() === 0;

describe('options', () => {
  describe('are set to defaults with empty object', () => {
    const options = Options.get({})
    test('date is set to today', () => {
      expect(isToday(options.date)).toBeTruthy()
    })
  })

  describe('defaults can be overriden by user', () => {
    const userOptions = {
      date: new Date(),
      station: 'telimeny'
    }
    const defaults = Options.get({})
    const options = Options.get(userOptions)

    Object.keys(options).forEach(k => {
      test(`${k} default value is overriden by user`, () => {
        expect(options[k]).not.toEqual(defaults[k])
      })
    })
  })

  describe('can be passed in different format', () => {
    const options = Options.get({
      date: '2014-10-06T14:00:00.000+02:00'
    })
    test('date can be passed in RFC3339 format', () => {
      const date = moment(options.date)
      expect(date.date()).toEqual(6)
      expect(date.month()).toEqual(9)
      expect(date.year()).toEqual(2014)
    })
  })

  describe('will fail when improper values are passed', () => {
    test('date is an object but not a Date', () => {
      expect(() => Options.get({date: {}})).toThrow()
    })
    test('date is an array', () => {
      expect(() => Options.get({date: []})).toThrow()
    })
  })
})
