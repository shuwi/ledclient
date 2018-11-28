import settingsRepository from '@/repositories/settingsRepository'

const state = {
  wasImported: true,
  itemCreationDate: true,
  prependNewItems: true,
  stickBoardsOnTop: true,
  markdownMode: true,
  dbLocation: 'resources/db.json',
  darkTheme: false,
  showUpdates: false,
  isuse: '0',
  host: 'localhost',
  user: 'root',
  password: 'demo123',
  database: 'labour',
  databaseport: 3306,
  chechinhost: '192.168.20.5',
  checkinport: 9922
}

const mutations = {
  SET_SETTINGS (state, settings) {
    Object.assign(state, settings)
  },
  SET_DB_LOCATION (state, newDbLocation) {
    state.dbLocation = newDbLocation
  },
  SET_PREPEND_NEW_ITEM (state, val) {
    state.prependNewItems = val
  },
  SET_MARKDOWN_MODE (state, val) {
    state.markdownMode = val
  },
  SET_DARK_THEME (state, val) {
    state.darkTheme = val
  },
  SET_ITEM_CREATION_DATE (state, val) {
    state.itemCreationDate = val
  },
  SET_STICK_BOARDS_ON_TOP (state, val) {
    state.stickBoardsOnTop = val
  },
  SET_SHOW_UPDATES (state, val) {
    state.showUpdates = val
  },
  SET_DB_ISUSE (state, val) {
    state.isuse = val
  },
  SET_HOST (state, val) {
    state.host = val
  },
  SET_USER (state, val) {
    state.user = val
  },
  SET_PASSWORD (state, val) {
    state.password = val
  },
  SET_DATABASE (state, val) {
    state.database = val
  },
  SET_DATABASEPORT (state, val) {
    state.databaseport = val
  },
  SET_CHECKINHOST (state, val) {
    state.checkinhost = val
  },
  SET_CHECKINPORT (state, val) {
    state.checkinport = val
  }
}

const actions = {
  fetchSettings ({
    commit
  }) {
    commit('SET_SETTINGS', settingsRepository.getAppSettings())
  },
  setDbLocation ({
    commit
  }, dbLocation) {
    commit('SET_DB_LOCATION', dbLocation)
    settingsRepository.updateAppSettings({
      dbLocation
    })
  },
  setPrependNewItem ({
    commit
  }, prependNewItems) {
    commit('SET_PREPEND_NEW_ITEM', prependNewItems)
    settingsRepository.updateAppSettings({
      prependNewItems
    })
  },
  setMarkdownMode ({
    commit
  }, markdownMode) {
    commit('SET_MARKDOWN_MODE', markdownMode)
    settingsRepository.updateAppSettings({
      markdownMode
    })
  },
  setDarkTheme ({
    commit
  }, darkTheme) {
    commit('SET_DARK_THEME', darkTheme)
    settingsRepository.updateAppSettings({
      darkTheme
    })
  },
  setItemCreationDate ({
    commit
  }, itemCreationDate) {
    commit('SET_ITEM_CREATION_DATE', itemCreationDate)
    settingsRepository.updateAppSettings({
      itemCreationDate
    })
  },
  setStickBoardsOnTop ({
    commit
  }, stickBoardsOnTop) {
    commit('SET_STICK_BOARDS_ON_TOP', stickBoardsOnTop)
    settingsRepository.updateAppSettings({
      stickBoardsOnTop
    })
  },
  setShowUpdates ({
    commit
  }, showUpdates) {
    commit('SET_SHOW_UPDATES', showUpdates)
    settingsRepository.updateAppSettings({
      showUpdates
    })
  },
  setDBIsUse ({
    commit
  }, isuse) {
    commit('SET_DB_ISUSE', isuse)
    settingsRepository.updateDBSettings({
      isuse
    })
  },
  setDBHost ({
    commit
  }, host) {
    commit('SET_HOST', host)
    settingsRepository.updateDBSettings({
      host
    })
  },
  setDBUser ({
    commit
  }, user) {
    commit('SET_USER', user)
    settingsRepository.updateDBSettings({
      user
    })
  },
  setDBPassword ({
    commit
  }, password) {
    commit('SET_PASSWORD', password)
    settingsRepository.updateDBSettings({
      password
    })
  },
  setDBDataBase ({
    commit
  }, database) {
    commit('SET_DATABASE', database)
    settingsRepository.updateDBSettings({
      database
    })
  },
  setDBDataBasePort ({
    commit
  }, port) {
    commit('SET_DATABASEPORT', port)
    settingsRepository.updateDBSettings({
      port
    })
  },
  setCheckinHost ({
    commit
  }, checkinhost) {
    commit('SET_CHECKINHOST', checkinhost)
    settingsRepository.updateCheckinSettings({
      checkinhost
    })
  },
  setCheckinPort ({
    commit
  }, checkinport) {
    commit('SET_CHECKINPORT', checkinport)
    settingsRepository.updateCheckinSettings({
      checkinport
    })
  },
  setUserLoginMode ({
    commit
  }, mode) {
    settingsRepository.updateUserlog({
      mode
    })
  },
  setUserLoginName ({
    commit
  }, username) {
    settingsRepository.updateUserlog({
      username
    })
  },
  setUserLoginPassword ({
    commit
  }, password) {
    settingsRepository.updateUserlog({
      password
    })
  }
}

export default {
  state,
  mutations,
  actions
}
