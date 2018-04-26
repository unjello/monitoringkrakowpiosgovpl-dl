const Stations = require('./stations')

describe('stations', () => {
  [ 6, 7, 16, 149, 152, 153, 161, 163 ].forEach(id => {
    test(`station ${id} is of interest`, () => {
      expect(Stations.isOfInterest(id)).toBeTruthy()
    })
  })
})
