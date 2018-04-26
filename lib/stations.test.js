const Stations = require('./stations')

describe('stations', () => {
  [ 6, 7, 16, 149, 152, 153, 161, 163 ].forEach(id => {
    test(`station ${id} is of interest`, () => {
      expect(Stations.isOfInterest(id)).toBeTruthy()
    })
  })

  describe('can be passed in different formats', () => {
    test('as number', () => {
      expect(Stations.get(6)).toEqual([6])
    })
    test('as string', () => {
      expect(Stations.get('krasinskiego')).toEqual([6])
    })
  })

  describe('will fail when improper values are passed', () => {
    [ () => ({}), {} ].forEach(t => {
      test(`${typeof t} is not proper station`, () => {
        expect(() => Stations.get(t)).toThrow()
      })
    })
    test('stations is a number, but not supported one', () => {
      expect(() => Stations.get(99)).toThrow()
    })
    test('stations is a string, but not supported one', () => {
      expect(() => Stations.get('matecznego')).toThrow()
    })
  })
})
