<template>
  <Modal :value="isVisible" @on-ok="closeModal" @on-visible-change="visibleChange" :scrollable="true" :mask-closable="false"
    footer-hide>
    <p slot="header" style="color:#555;">
      <Icon type="md-hammer" />
      <span>系统设置</span>
    </p>
    <div class="row title-row">
      <div class="title">
        <h4>{{appName}}</h4>&nbsp;&nbsp;
        <h6>v{{currentVersion}}</h6>
      </div>
    </div>
    <Collapse v-model="settingsCollapse" accordion>
      <Panel name="0">
        数据库设置
        <p slot="content">
          <general-settings />
        </p>
      </Panel>
      <Panel name="1">
        登记设备设置
        <p slot="content">
          <checkin-settings />
        </p>
      </Panel>
      <Panel name="2">
        元数据获取
        <p slot="content">
          <Button shape="circle" class="btn" type="primary" @click="nationpull">民族</Button>
          <Button shape="circle" class="btn" type="warning" @click="workkindpull">岗位</Button>
          <Button shape="circle" class="btn" type="info" @click="cardtypepull">证件类型</Button>
        </p>
      </Panel>
    </Collapse>
  </Modal>
</template>

<script>
  import axios from 'axios'
  import draggable from 'vuedraggable'
  import boardsRepository from '@/repositories/boardsRepository'
  import GeneralSettings from './GeneralSettings'
  import UpdatesCheckSettings from './UpdatesCheckSettings'
  import DatabaseLocation from './DatabaseLocation'
  import CheckinSettings from './CheckinSettings'

  const {
    dialog
  } = require('electron').remote

  export default {
    name: 'settings-modal',
    components: {
      DatabaseLocation,
      UpdatesCheckSettings,
      GeneralSettings,
      CheckinSettings,
      draggable
    },
    created () {
      this.fetchSettingsBoardsList()
    },
    computed: {
      isVisible () {
        return this.$store.state.modals.settings.isVisible
      },
      currentVersion () {
        return this.$store.state.modals.settings.currentVersion
      },
      appName () {
        return this.$store.state.modals.settings.appName
      },
      restartRequired () {
        return this.$store.state.modals.settings.restartRequired
      }
    },
    data () {
      return {
        boardsLocal: [],
        settingsCollapse: ''
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      createBackup () {
        const vm = this
        dialog.showSaveDialog({
          filters: [{
            name: 'json',
            extensions: ['json']
          }]
        }, function (fileName) {
          boardsRepository
            .exportDbToJSON(fileName)
            .then(() => {
              vm.$Message.success('File saved successfully')
            })
            .catch((err) => {
              vm.$Message.error({
                content: err.message,
                duration: 0,
                closable: true
              })
            })
        })
      },
      importBackup () {
        const vm = this
        dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{
            name: 'json',
            extensions: ['json']
          }]
        }, function (filePath) {
          boardsRepository.importDbFromJSON(filePath[0])
            .then(() => {
              vm.$Message.success('File imported successfully')
              vm.$store.dispatch('fetchBoards')
            })
            .catch((err) => {
              vm.$Message.error({
                content: err.message,
                duration: 0,
                closable: true
              })
            })
        })
      },
      fetchSettingsBoardsList () {
        this.$store.dispatch('fetchSettingsBoardsList')
          .then(() => {
            this.boardsLocal = JSON.parse(JSON.stringify(this.$store.state.modals.settings.boardsList))
          })
      },
      visibleChange (isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          this.fetchSettingsBoardsList()
        }
      },
      boardOrderChanged () {
        this.$store.dispatch('setRestartRequired')
      },
      showSuccessNotification () {
        this.$Message.success('Setting updated')
      },
      saveBoards () {
        this.$store.dispatch('saveBoardsArray', this.boardsLocal)
      },
      closeModal () {
        if (this.restartRequired) {
          this.saveBoards()
          this.$store.dispatch('showRestartReqCloak')
          this.$store.dispatch('hideSettingsModal')
        } else {
          this.$store.dispatch('hideSettingsModal')
        }
      },
      openSaveDialog (boardId) {
        const vm = this
        dialog.showSaveDialog({
          filters: [{
            name: 'JSON',
            extensions: ['json']
          }]
        }, function (fileName) {
          boardsRepository
            .exportBoardToJSON(fileName, boardId)
            .then(() => {
              vm.$Message.success('File saved successfully')
            })
            .catch((err) => {
              vm.$Message.error({
                content: err.message,
                duration: 0,
                closable: true
              })
            })
        })
      },
      nationpull () {
        var that = this
        axios({
          url: that.$store.state.modals.settings.baseURL + 'getNation.whtml',
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': that.$store.state.modals.login.token
          }
        })
          .then(function (data) {
            console.log('nationpull = ', data)
            // that.nationArr = data.data.record
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      workkindpull () {

      },
      cardtypepull () {

      }
    }
  }
</script>

<style scoped>
  .restart-required {
    font-size: 1em;
    color: #f0565e;
  }

  .row.title-row {
    border-bottom: 1px solid #f3f3f3;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-size: 1.5em;
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  .address {
    text-align: center;
    font-size: .5em;
    cursor: pointer;
  }

  .download-icon {
    cursor: pointer;
    margin-left: 5px;
    font-size: 1.5em;
  }

  h4 {
    margin: 5px 0;
  }

  .row {
    margin: 7px 0;
  }

  .board {
    position: relative;
    margin: 2px 0;
    padding: 2px;
    transition: all .3s;
  }

  .separator {
    border-bottom: 1px solid #f5f5f5;
    margin: 15px 0
  }

  .movable-icon {
    position: absolute;
    top: 2px;
    left: 3px;
    transform: rotate(90deg);
    font-size: 2em;
    opacity: .1;
    transition: all .25s;
    color: #41B883;
  }

  .draggable:hover .movable-icon {
    opacity: .8;
  }

</style>
