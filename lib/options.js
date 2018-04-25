'use strict'

const defaultOptions = {
  date: new Date()
}

const get = opts =>  Object.assign({}, defaultOptions, opts)

module.exports = {
  get
}