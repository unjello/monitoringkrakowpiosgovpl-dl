'use strict'

const { padColumns } = require('./util')

describe('padColumns', () => {
  test('leaves data table with correct number of columns untouched', () => {
    const data = [
      [1, 2, 3],
      [4, 5, 6]
    ]
    padColumns(data)

    expect(data).toHaveLength(2)
    expect(data[0]).toHaveLength(3)
    expect(data[1]).toHaveLength(3)
    expect(data[0]).toEqual([1, 2, 3])
    expect(data[1]).toEqual([4, 5, 6])
  })
  test('leaves data table with one row untouched', () => {
    const data = [
      [1, 2, 3]
    ]
    padColumns(data)

    expect(data).toHaveLength(1)
    expect(data[0]).toHaveLength(3)
    expect(data[0]).toEqual([1, 2, 3])
  })
  test('if one row has less columns, it pads it with given value', () => {
    const data = [
      [1, 2, 3, 4],
      [5]
    ]
    padColumns(data, '-')

    expect(data).toHaveLength(2)
    expect(data[0]).toHaveLength(4)
    expect(data[1]).toHaveLength(4)
    expect(data[1]).toEqual([5, '-', '-', '-'])
  })
  test('if rows have different number of columns, it pads them all to the max column count', () => {
    const data = [
      [1, 2],
      [3, 4, 5, 6, 7, 8],
      [9, 0, 1, 2],
      [3],
      [4, 5, 6, 7, 8],
      [9]
    ]

    padColumns(data)
    
    expect(data).toHaveLength(6)
    for (const row of data) {
      expect(row).toHaveLength(6)
    }
  })
})
