<template>
  <div class="topBar">
    {{appname}} v{{version}}
    <div class="actionBtn-container">
      <div class="minimize actionBtn" @click="minimize">
        <Tooltip content="最小化" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="ios-remove-circle" color="#ff9900"></Icon>
        </Tooltip>
      </div>
      <div class="close actionBtn" @click="closeApp">
        <Tooltip content="关闭" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="ios-close-circle" color="#ed4014"></Icon>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script>
  const remote = require('electron').remote

  export default {
    name: 'TopBar',
    computed: {
      version () {
        return this.$store.state.modals.settings.currentVersion
      },
      appname () {
        return this.$store.state.modals.settings.appName
      }
    },
    methods: {
      closeApp () {
        this.$Modal.confirm({
          title: '确认',
          content: '<p>确认关闭并退出本系统？</p>',
          onOk: () => {
            remote.app.quit()
          }
        })
      },
      minimize () {
        remote.BrowserWindow.getFocusedWindow().minimize()
      }
    }
  }
</script>

<style scoped>
  .topBar {
    -webkit-app-region: drag;
    background-color: #ffffff;
    height: 36px;
    position: fixed;
    z-index: -1;
    top: 0px;
    left: 0px;
    width: 100%;
    padding: 6px;
    -webkit-transition: all .3s;
    transition: all .3s;
    user-select: none;
    text-align: center;
    color: rgb(68, 66, 66);
    font-size:12px;
    font-weight: 600;
    background:#f5f5f5;
  }

  .actionBtn-container {
    position: fixed;
    right: 0;
    top: 0;
    display: flex;
  }

  .actionBtn {
    -webkit-app-region: no-drag;
    font-size: 15px;
    width: 25px;
    height: 25px;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
    line-height: 2em;
    font-weight: bold;
    opacity: .7;
  }

  .actionBtn:hover {
    opacity: 1;
  }

  .actionBtn.close:hover {
    color: #f51a06;
  }

  .close {
    margin: 0 8px 0 0;
  }

</style>
