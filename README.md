# :floppy_disk: LStorage.

A simple browser `localStorage` helper, no more.

- :white_check_mark: Store/retrieve string, number, array, object or boolean (json stringified/parsed)
- :white_check_mark: Update stored value
- :white_check_mark: Watch changes from other tabs
- :white_check_mark: IE8+ compatibility
- :white_check_mark: Small (<2Ko minified)
- :x: No polyfills
- :x: No sessionstorage, IndexedDB, WebSQL...

## Installation & usage

```bash
npm install lstorage
```

```javascript
import storage from 'lstorage'
```

## API Reference

. __set__ ( `key`, `value` )

```javascript
storage.set('username', 'Elliot')
storage.set('user', { name: 'Elliot', age: 28 })
```

. __get__ ( `key`, [`defaultValue`] )

```javascript
storage.get('username') // 'Elliot'
storage.get('user') // Object{ name: 'Elliot', age: 28 }
storage.get('counter', 0) // 0 (+implicit storage.set('counter', 0))
```

. __update__ ( `key`, `modifier` )

```javascript
storage.update('counter', c => c+1)
// ...  
storage.update('letters', letters => letters.filter(l => l !== 'b'))
// ...
storage.update('user', user => {
  user.lastname = 'Alderson'
  return user
})
```

. __remove__ ( `key` )

```javascript
storage.remove('username')
// storage.get('username') eq. null
```

. __watch__ ( `key`, `handler` )

```javascript
storage.watch('counter', ({ prev, next }) => {
  console.info('counter modified from another tab')
  console.info('previous value', prev) // 2
  console.info('next value', next) // 3
})
```

. __unwatch__ ( `key`, `handler` )

```javascript
storage.unwatch('counter', counterChangeHandler)
```

. __all__ ( )

```javascript
// returns an array containing all key/values persisted by lstorage
storage.all().forEach(({ key, value }) => {
  console.info(`storage[ ${key} ]`, value)
})
```  

. __removeAll__ ( )

```javascript
storage.removeAll() // removes all elements persisted by lstorage
```
