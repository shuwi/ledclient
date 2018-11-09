const {
  db
} = require('electron').remote.require('./persistence')

db.defaults({
  appSettings: {
    'wasImported': false,
    'itemCreationDate': true,
    'prependNewItems': true,
    'showUpdates': true
  },
  dbSettings: {
    isuse: '0',
    host: 'localhost',
    user: 'root',
    password: 'demo123',
    database: 'labour'
  },
  checkinSettings: {
    checkinhost: '192.168.20.5',
    checkinport: 9922
  }
}).write()

export default {
  getAppSettings () {
    return db.get('appSettings')
      .cloneDeep()
      .value()
  },
  updateAppSettings (updateProp) {
    return db.get('appSettings')
      .assign(updateProp)
      .write()
  },
  getDBSettings () {
    return db.get('dbSettings')
      .cloneDeep()
      .value()
  },
  updateDBSettings (updateProp) {
    return db.get('dbSettings')
      .assign(updateProp)
      .write()
  },
  getCheckinSettings () {
    return db.get('checkinSettings')
      .cloneDeep()
      .value()
  },
  updateCheckinSettings (updateProp) {
    return db.get('checkinSettings')
      .assign(updateProp)
      .write()
  }
}
