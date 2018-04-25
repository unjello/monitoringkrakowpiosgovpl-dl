const Options = require('./options')
const Date = require('date-fns')

describe('options', () => {
  describe('are set to defaults with empty object', () => {
    const options = Options.get({})
    test('date is set to today', () => {
      expect(Date.isToday(options.date)).toBeTruthy()
    })
  })
})