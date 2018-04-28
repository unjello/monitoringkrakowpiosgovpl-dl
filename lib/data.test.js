'use strict'

const Data = require('./data')

describe('readings', () => {
  [
    [
      "1524693600",
      "21.7605",
      "2018-04-26T00:00:00+02:00",
      "21.7605"
    ],
    [
      "1524697200",
      "26.6475",
      "2018-04-26T01:00:00+02:00",
      "26.6475"
    ],
    [
      "1524700800",
      "22.257",
      "2018-04-26T02:00:00+02:00",
      "22.257"
    ],
    [
      "1524704400",
      "31.8231",
      "2018-04-26T03:00:00+02:00",
      "31.8231"
    ]
  ].forEach(r => {
    const rr = Data.getReading(r)
    test(`timestamp ${r[0]} is translated to human readable ${r[2]}`, () => {
      expect(rr.date).toEqual(r[2])
    })
    test(`reading value ${r[1]} is left untouched`, () => {
      expect(rr.value).toEqual(r[3])
    })
  })
})