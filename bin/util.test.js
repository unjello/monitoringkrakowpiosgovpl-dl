'use strict'

const { padColumns, formatColor } = require('./util')
const chalk = require('chalk')

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

describe('formatColor', () => {
  test('creates red-bold for values over 120% of limit', () => {
    [121, 150, 200].forEach(x => {
      expect(formatColor(100, x)).toEqual(chalk.red.bold(x))
    })
  })
  test('creates red for values between 100% and 120% of limit', () => {
    [101, 120].forEach(x => {
      expect(formatColor(100, x)).toEqual(chalk.red(x))
    })
  })
  test('creates yellow for values between 75% and 100% of limit', () => {
    [76, 80, 100].forEach(x => {
      expect(formatColor(100, x)).toEqual(chalk.yellow(x))
    })
  })
  test('creates green for values below 75% of limit', () => {
    [0, 1, 40, 75].forEach(x => {
      expect(formatColor(100, x)).toEqual(chalk.green(x))
    })
  })
})