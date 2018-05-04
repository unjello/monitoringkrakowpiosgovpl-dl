'use strict'

const padColumns = (table, pad) => {
  const maxColumns = table.reduce((a, v) => Math.max(a, v.length), 0)
  return table.forEach(r => {
    const padding = maxColumns - r.length
    if (padding > 0) {
      r.push(...Array.from(Array(padding)).map(a => pad))
    }
  })
}

module.exports = {
  padColumns
}