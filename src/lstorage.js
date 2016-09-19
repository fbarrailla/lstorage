'use strict'
const KEY_REG = /^lstrg\((.+)\)$/

const getKey = k => `lstrg(${k})`

const getAllKeys = () => Object.keys(localStorage).filter(k => KEY_REG.test(k))

const listeners = {}

window.addEventListener('storage', handleStorageChange)

export default {

  set(key, value) {
    if (key.length) {
      localStorage.setItem(getKey(key), JSON.stringify(value))
    }
  },

  get(key, defaultValue=null) {
    const entry = localStorage.getItem(getKey(key))
    if (entry === null && defaultValue !== null) {
      this.set(key, defaultValue)
    }
    return entry ? JSON.parse(entry) : defaultValue
  },

  update(key, modifier) {
    const data = this.get(key)
    if (data !== null && typeof modifier === 'function') {
      this.set(key, modifier(data))
    }
  },

  remove(key) {
    localStorage.removeItem(getKey(key))
  },

  watch(key, handler) {
    const _k = getKey(key)
    listeners[_k] = listeners[_k] || []
    if (listeners[_k].indexOf(handler) === -1) {
      listeners[_k].push(handler)
    }
  },

  unwatch(key, handler) {
    const _k = getKey(key)
    if (listeners[_k]) {
      listeners[_k] = listeners[_k].filter(h => h !== handler)
    }
  },

  all() {
    return getAllKeys().map(k => ({
      key: k.match(KEY_REG)[1],
      value: JSON.parse(localStorage[k])
    }))
  },

  removeAll() {
    getAllKeys().forEach(k => {
      localStorage.removeItem(k)
    })
  }
}

function handleStorageChange(evt) {
  if (KEY_REG.test(evt.key) && listeners[evt.key]) {
    listeners[evt.key].forEach(handler => handler({
      prev: JSON.parse(evt.oldValue),
      next: JSON.parse(evt.newValue)
    }))
  }
}
