<template>
  <div class="topBar">
    {{appname}} v{{version}}
    <div class="actionBtn-container">
      <div class="minimize actionBtn" @click="minimize">
        <Tooltip content="最小化" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="md-remove" color="#000"></Icon>
        </Tooltip>
      </div>
      <div class="close actionBtn" @click="closeApp">
        <Tooltip content="关闭" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="md-close" color="rgb(255, 0, 0)"></Icon>
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
      version() {
        return this.$store.state.modals.settings.currentVersion
      },
      appname() {
        return this.$store.state.modals.settings.appName
      }
    },
    methods: {
      closeApp() {
        this.$Modal.confirm({
          title: '确认',
          content: '<p>确认关闭并退出本系统？</p>',
          onOk: () => {
            remote.app.quit()
          }
        })
      },
      minimize() {
        remote.BrowserWindow.getFocusedWindow().minimize()
      }
    }
  }

</script>

<style scoped>
  .topBar {
    -webkit-app-region: drag;
    cursor: pointer;
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
    color: rgb(49, 49, 49);
    font-size: 12px;
    font-weight: 500;
    background: #f8f8f9;
    border-bottom: 1px solid #e1e4e8;
  }

  .actionBtn-container {
    position: fixed;
    right: 0;
    top: 0;
    display: flex;
  }

  .actionBtn {
    -webkit-app-region: no-drag;
    font-size: 16px;
    width: 25px;
    height: 25px;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
    opacity: .7;
    margin: 0 6px;
  }

  .actionBtn:hover {
    opacity: 1;
  }

  .close {
    margin: 0 10px 0 0;
  }

</style>
