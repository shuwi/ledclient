<template>
  <div class="topBar">
    {{appname}} v{{version}}
    <div class="actionBtn-container">
      <div class="minimize actionBtn" @click="minimize">
        <Tooltip content="最小化" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="md-remove" color="#333"></Icon>
        </Tooltip>
      </div>
      <div class="close actionBtn" @click="closeApp">
        <Tooltip content="关闭" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="md-close" color="#ed4014"></Icon>
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
    color: rgb(68, 66, 66);
    font-size:12px;
    font-weight: 400;
    background:-webkit-gradient(linear,center top,center bottom,from(#f8f8f8),to(#f1f1f1));
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

  .actionBtn.close:hover {
    color: #f51a06;
  }

  .close {
    margin: 0 8px 0 0;
  }

</style>
