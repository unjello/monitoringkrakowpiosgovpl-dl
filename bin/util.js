'use strict'

const chalk = require('chalk')

const padColumns = (table, pad) => {
  const maxColumns = table.reduce((a, v) => Math.max(a, v.length), 0)
  return table.forEach(r => {
    const padding = maxColumns - r.length
    if (padding > 0) {
      r.push(...Array.from(Array(padding)).map(a => pad))
    }
  })
}

const formatColor = (limit, value) => {
  if (value > limit * 1.2) {
    return chalk.red.bold(value)
  }
  if (value > limit) {
    return chalk.red(value)
  }
  if (value > limit * 0.75) {
    return chalk.yellow(value)
  }
  return chalk.green(value)
}

module.exports = {
  padColumns,
  formatColor
}