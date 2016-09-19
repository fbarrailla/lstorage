'use strict'
let listener

global.window = {
  addEventListener(evt, handler) {
    listener = {
      evt,
      handler
    }
  }
}

exports.getListener = () => listener
