import WinMock from './_WinMock.js'
import test from 'ava'
import lstorage from '../lib/lstorage.js'

global.localStorage = require('localstorage')

test.afterEach(t => {
  localStorage.clear()
})

test('set', t => {
  lstorage.set('username', 'John')
  lstorage.set('user', { firstname: 'John', lastname: 'Doe' })
  lstorage.set('letters', ['a','b'])
  lstorage.set('age', 27)
  lstorage.set('bool', true)
  t.is(localStorage.getItem('lstrg(username)'), '"John"')
  t.is(localStorage.getItem('lstrg(user)'), '{"firstname":"John","lastname":"Doe"}')
  t.is(localStorage.getItem('lstrg(letters)'), '["a","b"]')
  t.is(localStorage.getItem('lstrg(age)'), '27')
  t.is(localStorage.getItem('lstrg(bool)'), 'true')
})

test('get', t => {
  localStorage.setItem('lstrg(username)', '"Paul"')
  localStorage.setItem('lstrg(user)', '{"firstname":"Paul","lastname":"Doe"}')
  localStorage.setItem('lstrg(letters)', '["c","d"]')
  localStorage.setItem('lstrg(age)', '26')
  localStorage.setItem('lstrg(bool)', 'false')
  t.is(lstorage.get('username'), 'Paul')
  t.deepEqual(lstorage.get('user'), { firstname: 'Paul', lastname: 'Doe' })
  t.is(lstorage.get('age'), 26)
  t.is(lstorage.get('bool'), false)
  t.deepEqual(lstorage.get('letters'), ['c','d'])
})

test('update', t => {
  localStorage.setItem('lstrg(counter)', '3')
  localStorage.setItem('lstrg(list)', '["a"]')
  lstorage.update('counter', c => c+1)
  lstorage.update('list', l => l.concat(['b']))
  t.is(localStorage.getItem('lstrg(counter)'), '4')
  t.is(localStorage.getItem('lstrg(list)'), '["a","b"]')
})

test('remove', t => {
  localStorage.setItem('lstrg(a)', '"a"')
  localStorage.setItem('lstrg(b)', '"b"')
  lstorage.remove('b')
  t.not(localStorage.getItem('lstrg(a)'), null)
  t.is(localStorage.getItem('lstrg(b)'), null)
})

test.cb('watch', t => {
  const listener = WinMock.getListener();
  t.plan(3)
  lstorage.watch('counter', ({ prev, next }) => {
    t.is(listener.evt, 'storage')
    t.is(prev, 1)
    t.is(next, 2)
    t.end()
  })
  listener.handler({
    key: 'lstrg(counter)',
    oldValue: '1',
    newValue: '2'
  })
})

test('all', t => {
  localStorage.setItem('lstrg(a)', '"a"')
  localStorage.setItem('lstrg(1)', '1')
  localStorage.setItem('lstrg(arr)', '[1]')
  t.deepEqual(lstorage.all(), [
    { key: 'a', value: 'a' },
    { key: '1', value: 1 },
    { key: 'arr', value: [1] },
  ])
})

test('removeAll', t => {
  localStorage.setItem('a', 'a')
  localStorage.setItem('b', 'b')
  localStorage.setItem('lstrg(a)', '"a"')
  localStorage.setItem('lstrg(b)', '"b"')
  localStorage.setItem('lstrg(c)', '"c"')
  lstorage.removeAll()
  t.is(localStorage.length, 2)
})
