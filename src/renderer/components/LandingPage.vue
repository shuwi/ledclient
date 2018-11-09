<template>
  <div id="wrapper" :class="{'fixedTabs' : settings.stickBoardsOnTop}">
    <Row>
      <i-col span="24" style="height: 100%;">
      <Tabs v-model="activeBoard" size="small" @on-click="saveActiveBoard" @dblclick.native="handleDblClick" :class="{'fixedTabs' : settings.stickBoardsOnTop}"
        type="line">
        <Tab-pane label="项目信息" class="tpane" icon="md-pie">
          <div style="width:350px;margin:10px auto;">
            <i-circle :size="350" :trail-width="4" :stroke-width="5" :percent="75" stroke-linecap="round" stroke-color="#2db7f5">
              <div class="Circle-custom">
                <h1>{{project.projectProgress}}</h1>
                <p>{{project.name}}</p>
                <span>
                  {{project.place}}
                </span>
              </div>
            </i-circle>
          </div>
        </Tab-pane>
        <Tab-pane label="人员信息" class="tpane" icon="md-person">
          <div style="display:flex;flex-direction:row;align-items:center;height:100%;align-items: flex-start;margin:0px auto;">
            <div style="order:1;flex:1;width:250px;flex-shrink:0;height:100%;backgrouond:#ccc;">
              <Tree :data="treedata" style="width:250px;height:100%;border-right:1px dashed #e8eaec;padding-left:10px;line-height:2em;"
                @on-select-change="kindSelected"></Tree>
            </div>
            <div style="order:2;padding:10px 25px;flex-grow:2;overflow:auto;margin:0;flex-shrink:1;">
              <div style="margin:0 auto 20px auto;width:100%;">
                <Input search placeholder="请输入关键字查询" style="width:300px;margin:0 10px 0 0;" suffix="ios-search" icon="ios-search"
                  clearable @on-search="search" :value="keyword" />
                <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showUserModal" v-if="canAddUser">添加人员</Button>
                <Button shape="circle" icon="md-arrow-round-back" class="btn" type="info" @click="labourout">人员退场</Button>
                <Button shape="circle" icon="md-arrow-round-forward" class="btn" type="success" @click="labourin">人员进场</Button>
                <Button shape="circle" icon="ios-refresh" class="btn" type="warning" @click="testone">更新人员数据</Button>
              </div>
              <Table border width="100%" size="small" ref="selection" :columns="ucolumns" :data="udata"
                @on-selection-change="laboursel"></Table>
              <div style="margin:20px auto;width:100%;">
                <Button @click="handleSelectAll(true)" type="info" shape="circle" style="width:100px;">全选</Button>
                <Button @click="handleSelectAll(false)" type="warning" shape="circle" style="width:100px;">取消全选</Button>
              </div>
              <div style="margin:10px auto;width:100%;">
                <Page :current="current" :total="total" simple style="float:right;" @on-change="userlistChange"
                  :page-size="pagesize" />
              </div>
            </div>
          </div>
        </Tab-pane>
        <Tab-pane label="班组管理" class="tpane" icon="md-pulse">
          <div style="margin:0 auto 20px auto;width:95%;">
            <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showWorkerGroup">添加班组</Button>
          </div>
          <div style="margin:0 auto 20px auto;width:95%;">
            <Table border :columns="classNoColumns" :data="classNoArr" @on-row-click="editWorkerGroup" width="100%"
              size="small"></Table>
          </div>
        </Tab-pane>
        <Tab-pane label="考勤设备管理" class="tpane" icon="logo-rss">
          <div style="margin:0 auto 20px auto;width:95%;">
            <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showMachineInfo">添加设备</Button>
            <Button shape="circle" icon="md-create" class="btn" type="warning" @click="editMachineInfo">修改设备</Button>
            <Button shape="circle" icon="md-close" class="btn" type="error" @click="delMachineInfoDialog">删除设备</Button>
            <Button shape="circle" icon="ios-refresh" class="btn" type="info" @click="refreshMachineList">刷新列表</Button>

            <Input search placeholder="请输入设备名称或序列号" style="width:200px;" suffix="ios-search" icon="ios-search"
              clearable @on-change="search" />
            <Dropdown style="margin-left: 20px" @on-click="dm" trigger="click">
              <Button type="info" shape="circle">
                命令集
                <Icon type="ios-arrow-down" style="margin-left:6px;"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="RestartDevice()">重启设备</DropdownItem>
                <DropdownItem divided name="refresh">同步设备时间</DropdownItem>
                <DropdownItem name="GetDeviceInfo()">获取设备信息</DropdownItem>
                <DropdownItem name="DeleteAllRecord()">清空考勤记录</DropdownItem>
                <DropdownItem name="delone">移除个别人员</DropdownItem>
                <DropdownItem name="DeleteAllEmployee()">删除所有人员</DropdownItem>
                <DropdownItem name="oneman">手动下发人员信息</DropdownItem>
                <DropdownItem divided name="history">历史命令查询</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div style="margin:0 auto 20px auto;width:95%;">
            <Table border width="100%" size="small" ref="selectedMachines" :columns="mcolumns" :data="mdata" @on-select="machinesel"></Table>
          </div>
          <div style="margin:0 auto 20px auto;width:95%;">
            <Button @click="handleSelectAllMachines(true)" type="info" shape="circle" style="width:100px;">全选</Button>
            <Button @click="handleSelectAllMachines(false)" type="warning" shape="circle" style="width:100px;">取消全选</Button>
          </div>
        </Tab-pane>

        <div slot="extra">
          <ButtonGroup>
            <Tooltip content="系统设置" placement="bottom-end" :transfer="true" :delay="500">
              <Button @click="showSettingsModal" size="small" icon="ios-settings" style="margin-right: 12px; margin-top:2px;"
                shape="circle">
              </Button>
            </Tooltip>
          </ButtonGroup>
        </div>
      </Tabs>
      </i-col>
    </Row>
    <footer @click="open('http://www.jsxywg.cn/')">
      &copy;2018 江苏星云网格信息技术有限公司提供全程技术支持
    </footer>
    <input style="display: none;" id="inputForSettingsShortcut" v-shortkey="{win:['ctrl', ','], win2: ['alt' + ','], mac:['meta', ',']}"
      @shortkey="showSettingsModal">
    <input style="display: none;" id="inputForCreateNewBorad" v-shortkey="{win:['ctrl', 'shift', 'n'], win2: ['alt', 'shift', 'n'], mac:['meta', 'shift', 'n']}"
      @shortkey="showUserModal">
    <input style="display: none;" id="inputForActivateNextTab" v-shortkey="{win: ['ctrl', 'shift', '}'], win2:['alt', 'shift', '}'], mac:['meta', 'shift', '}']}"
      @shortkey="activateNextTab">
    <input style="display: none;" id="inputForActivatePrevTab" v-shortkey="{win: ['ctrl', 'shift', '{'], win2:['alt', 'shift', '{'], mac:['meta', 'shift', '{']}"
      @shortkey="activatePreviousTab">
    <new-board-modal @newBoardSubmitted="loadBoards" @reloadPage="getNewData"></new-board-modal>
    <settings-modal></settings-modal>
    <move-to-board-modal></move-to-board-modal>
    <labour-check :status="status" :userlist="sellist" :checkvisible="checkvisible" :token="token" :projectId="projectId"
      @visibleChange="visibleChange"></labour-check>
    <login-modal></login-modal>
    <worker-group-modal @classNoGet="classNoGet"></worker-group-modal>
    <machine-info-modal @refreshMachineList="refreshMachineList"></machine-info-modal>
  </div>
</template>

<script>
  import boardsRepository from '@/repositories/boardsRepository'
  import settingsRepository from '@/repositories/settingsRepository'
  import Board from './board/Board'
  import MoveToBoardModal from './modals/MoveToBoardModal'
  import NewBoardModal from './modals/NewBoardModal'
  import SettingsModal from './modals/settings/SettingsModal'
  import LabourCheck from './modals/LabourCheck.vue'
  import LoginModal from './modals/LoginModal.vue'
  import WorkerGroupModal from './modals/WorkerGroupModal.vue'
  import MachineInfoModal from './modals/MachineModal.vue'

  import axios from 'axios'
  import {
    mapActions
  } from 'vuex'

  export default {
    components: {
      SettingsModal,
      NewBoardModal,
      Board,
      MoveToBoardModal,
      LabourCheck,
      LoginModal,
      WorkerGroupModal,
      MachineInfoModal
    },
    name: 'landing-page',
    data() {
      return {
        singlemachine: {},
        machinedel: false,
        machinesellist: [],
        keyword: '',
        current: 1,
        total: 0,
        pagesize: 10,
        classNoArr: [],
        sellist: [],
        newItem: '',
        token: '',
        projectId: 2163,
        status: false,
        checkvisible: false,
        treedata: [{
          title: '班组',
          expand: true,
          children: []
        }],
        classNoColumns: [{
            title: '名称',
            key: 'name'
          },
          {
            title: '联系人',
            key: 'teamLeader'
          },
          {
            title: '联系方式',
            key: 'contract'
          },
          {
            title: '责任人身份证号码',
            key: 'responseIdNumber'
          },
          {
            title: '班组长身份证号码',
            key: 'teamIdNumber'
          }

        ],
        mcolumns: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'IP',
            key: 'ip'
          },
          {
            title: '端口',
            key: 'port'
          },
          {
            title: '名称',
            key: 'mname'
          }
        ],
        ucolumns: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '手机',
            key: 'mobile'
          },
          {
            title: '身份证号',
            key: 'userId'
          },
          {
            title: '班组',
            key: 'classNo'
          },
          {
            title: '添加时间',
            key: 'addtime'
          },
          {
            title: '籍贯',
            key: 'birthPlaceCode'
          },
          {
            title: '操作',
            key: 'action',
            width: 350,
            align: 'center',
            className: 'address-table-info-column',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    shape: 'circle',
                    icon: 'ios-search'
                  },
                  style: {
                    marginRight: '10px',
                    width: '80px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    shape: 'circle',
                    icon: 'ios-pricetag-outline'
                  },
                  style: {
                    marginRight: '10px',
                    width: '80px'
                  },
                  on: {
                    click: () => {
                      this.editUser(params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    shape: 'circle',
                    icon: 'md-wifi'
                  },
                  style: {
                    width: '80px'
                  },
                  on: {
                    click: () => {
                      this.checkin(params.index)
                    }
                  }
                }, '登记')
              ])
            }
          }
        ],
        udata: [],
        mdata: [],
        value3: false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        formData: {
          name: '',
          url: '',
          owner: '',
          type: '',
          approver: '',
          date: '',
          desc: ''
        }
      }
    },
    computed: {
      isLastBoard() {
        return this.boards.length === 1
      },
      boards() {
        return this.$store.state.boards.boardsList
      },
      activeBoard: {
        set(value) {
          this.$store.dispatch('setActiveBoard', value)
        },
        get() {
          return this.$store.state.boards.activeBoard
        }
      },
      settings() {
        return this.$store.state.settings
      },
      canAddUser() {
        return this.$store.state.modals.login.mode !== '0'
      },
      project() {
        return this.$store.state.modals.login.projectId
      }
    },
    created() {
      this.getNewData()
    },

    methods: {
      ...mapActions([
        'showNewBoardModal',
        'hideNewBoardModal',
        'showSettingsModal',
        'showWorkerGroup',
        'hideWorkerGroup',
        'showMachineInfo',
        'hideMachineInfo'
      ]),
      getNewData() {
        var mysql = require('mysql')
        var that = this
        var db = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
        if (db.isuse === '0') {
          return
        }
        delete db.isuse
        var connection = mysql.createConnection(db)
        connection.connect()
        connection.query(`SELECT * from machine`, function (
          error,
          results,
          fields
        ) {
          if (error) throw error
          that.mdata = results
        })
        
        connection.query(
          `SELECT count(id) as total from worker where classNo like '${that.keyword}%'`,
          function (
            error,
            results,
            fields
          ) {
            if (error) throw error
            that.total = results[0].total
          })
        connection.query(
          `SELECT * from worker where classNo like '${that.keyword}%' limit 0,${that.pagesize}`,
          function (
            error,
            results,
            fields
          ) {
            if (error) throw error
            that.udata = results
          })
        connection.end()
      },
      refreshMachineList() {
        var mysql = require('mysql')
        var that = this
        var db = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
        if (db.isuse === '0') {
          return
        }
        delete db.isuse
        var connection = mysql.createConnection(db)

        connection.connect()
        connection.query(`SELECT * from machine`, function (
          error,
          results,
          fields
        ) {
          if (error) throw error
          that.mdata = results
        })
        connection.end()
      },
      handleDblClick(event) {
        // if (event.target.className === 'ivu-tabs-nav-scroll') {
        //  this.showNewBoardModal()
        // }
        console.log('handleDblClick', event)
      },
      showUserModal() {
        if (this.$store.state.modals.login.mode === '0') {
          this.$Modal.error({
            title: '提醒',
            content: `<p>线上下载模式下暂不支持人员添加！<p>`
          })
          return
        }
        this.$store.dispatch('showNewBoardModal')
        if (this.$store.state.modals.newBoard.isVisible.length === 1) {
          console.log('this.sellist', this.sellist)
        }
      },
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      activateNextTab() {
        const activeTabDOM = document.querySelector('.ivu-tabs-tab-active')
        if (
          activeTabDOM.nextSibling &&
          activeTabDOM.nextSibling.className === 'ivu-tabs-tab'
        ) {
          activeTabDOM.nextSibling.click()
        }
      },
      activatePreviousTab() {
        const activeTabDOM = document.querySelector('.ivu-tabs-tab-active')
        if (
          activeTabDOM.previousSibling &&
          activeTabDOM.previousSibling.className === 'ivu-tabs-tab'
        ) {
          activeTabDOM.previousSibling.click()
        }
      },
      handleBoardRemove(boardLabel, boardId) {
        this.$Modal.confirm({
          title: `Remove board '${boardLabel}' ?`,
          okText: 'OK, remove it',
          cancelText: 'Cancel',
          content: `<p>You are going to remove board <strong>"${boardLabel}"</strong></p>
                    <p>All items will be deleted, are you sure ?</p>`,
          onOk: () => {
            boardsRepository.removeBoard(boardId)
            this.activeBoard = boardsRepository.getFirstBoard().id
            this.loadBoards()
            this.$Message.info('Board removed')
          }
        })
      },
      saveActiveBoard(boardId) {
        this.activeBoard = boardId
        if (this.activeBoard == 1 || this.activeBoard == 2) {
          var that = this
          if (that.$store.state.modals.login.token === '') {
            return
          }
          // 获取项目下所有班组
          //if (that.classNoArr.length > 0) { return }
          axios({
              url: that.$store.state.modals.settings.baseURL + 'getClassNoInfo.whtml',
              method: 'get',
              params: {
                projectId: that.$store.state.modals.login.projectId.id
              },
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': that.$store.state.modals.login.token
              }
            })
            .then(function (data) {
              console.log('getClassNoInfo.whtml = ', data.data.group)
              var tt = []
              data.data.group.forEach(function (value, index, array) {
                tt.push({
                  title: value.name
                })
              })
              that.treedata[0].children = tt
              that.classNoArr = data.data.group
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      },
      loadBoards() {
        this.$store.dispatch('fetchBoards')
      },
      importOldEntries() {
        if (!this.settings.wasImported) {
          boardsRepository.importOldEntries()
          settingsRepository.updateAppSettings({
            wasImported: true
          })
        }
      },
      versionCheck() {
        /*
        axios
          .get('https://api.github.com/repos/czytelny/backlog/releases/latest')
          .then(({
            data
          }) => {
            if (`v${version}` !== data.tag_name) {
              this.$store.dispatch('showUpdateModal')
            }
          })
          */
      },
      handleSelectAll(status) {
        this.$refs.selection.selectAll(status)
      },
      show(index) {
        this.$Modal.info({
          title: '人员信息',
          content: `<table style="font-size:12px;width:100%;">
          <tr><td>姓名：</td><td>${this.udata[index].name}</td></tr>
          <tr><td>身份证号：</td><td>${this.udata[index].userId}</td></tr>
          <tr><td>照片：</td><td><img src="data:image/bmp;base64,${this.udata[index].photo}"/></tr>
          </table>`
        })
      },
      remove(index) {
        this.udata.splice(index, 1)
        this.$Notice.success({
          title: '成功',
          desc: 'Here is the notification description. Here is the notification description. '
        })
      },
      checkin(params) {
        this.$Spin.show()
        setTimeout(() => {
          this.$Spin.hide()
        }, 1000 * 60)
        var that = this
        var net = require('net')
        var iconv = require('iconv-lite')
        var checkininfo = settingsRepository.getCheckinSettings()
        var port = checkininfo.checkinport
        var host = checkininfo.checkinhost
        var client = new net.Socket()

        client.connect(port, host, function () {
          var utf8str =
            `EnrollEmployee(id="${that.userdata[params].userId}" name="${that.userdata[params].name}" dutyrule="1" save="3")`
          client.write(iconv.encode(utf8str, 'GBK'))
          // 向端口写入数据到达服务端
        })
        client.on('data', function (data) {

          if (typeof data === 'object') {
            that.$Spin.hide()
            that.$Modal.success({
              title: '提示',
              content: `<p style="font-size:12px;">操作成功！</p>`
            })
          } else if (data === 'Return(result="success" status="cancel")') {
            that.$Modal.warning({
              title: '提示',
              content: `<p style="font-size:12px;">操作已取消！</p>`
            })
            console.log('操作已取消！')
            that.$Spin.hide()
          } else {
            that.$Modal.warning({
              title: '提示',
              content: `<p style="font-size:12px;">设备故障或设备正忙！</p>`
            })
            console.log('设备故障或设备正忙！')
            that.$Spin.hide()
          }
        })
        client.on('error', function (error) {
          // 错误出现之后关闭连接
          console.log('error:' + error)
          client.destory()
        })
        client.on('close', function () {
          // 正常关闭连接
          console.log('Connection closed')
        })
      },
      test() {
        this.$Notice.success({
          title: '成功',
          desc: 'Here is the notification description. Here is the notification description. '
        })
      },
      search(e) {
        var mysql = require('mysql')
        var that = this
        that.$Loading.start()
        that.keyword = e
        var db = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
        if (db.isuse === '0') {
          return
        }
        delete db.isuse
        var connection = mysql.createConnection(db)

        connection.connect()
        connection.query(
          `SELECT count(id) as total from worker where userId like '${that.keyword}%' or mobile like '${that.keyword}%'`,
          function (
            error,
            results,
            fields
          ) {
            if (error) throw error
            that.total = results[0].total
          })
        connection.query(
          `SELECT * from worker where userId like '${that.keyword}%' or mobile like '${that.keyword}%' limit 0,${that.pagesize}`,
          function (
            error,
            results,
            fields
          ) {
            if (error) throw error
            that.udata = results
          })
        that.$Loading.finish()
        connection.end()
      },
      dm(e) {
        var that = this
        if (typeof that.singlemachine.port === 'undefined') {
          this.$Notice.error({
            title: '错误',
            desc: '请至少选择一项后再进行命令操作'
          })
          return
        }
        var net = require('net')
        var iconv = require('iconv-lite')
        var port = that.singlemachine.port
        var host = that.singlemachine.ip
        var client = new net.Socket()

        client.connect(port, host, function () {
          var utf8str = e
          client.write(iconv.encode(utf8str, 'GBK'))
          // 向端口写入数据到达服务端
        })
        client.on('data', function (data) {
          that.$Notice.success({
            title: '成功',
            desc: data
          })
        })
        client.on('error', function (error) {
          // 错误出现之后关闭连接
          that.$Notice.error({
            title: '错误',
            desc: error
          })
        })
        client.on('close', function () {
          // 正常关闭连接
          console.log('Connection closed')
        })
      },
      laboursel(sel) {
        this.sellist = sel
      },
      labourout() {
        if (this.sellist.length === 0) {
          this.$Notice.error({
            title: '错误',
            desc: '请至少选择一项后再进行退场操作'
          })
          this.checkvisible = false
        } else {
          this.status = true
          this.checkvisible = true
        }
      },
      labourin() {
        if (this.sellist.length === 0) {
          this.$Notice.error({
            title: '错误',
            desc: '请至少选择一项后再进行进场操作'
          })
          this.checkvisible = false
        } else {
          this.status = false
          this.checkvisible = true
        }
      },
      visibleChange(checkvisible) {
        this.checkvisible = checkvisible
      },
      userlistChange(num) {
        var mysql = require('mysql')
        var that = this
        var db = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
        if (db.isuse === '0') {
          return
        }
        delete db.isuse
        var connection = mysql.createConnection(db)
        connection.connect()
        connection.query(
          `SELECT * from worker where userId like '${that.keyword}%' or mobile like '${that.keyword}%' or classNo like '${that.keyword}%' limit ${(num - 1) * that.pagesize},${that.pagesize}`,
          function (
            error,
            results,
            fields
          ) {
            if (error) throw error
            that.udata = results
          })
        connection.end()
      },
      kindSelected(v) {
        var mysql = require('mysql')
        var that = this
        that.keyword = v[0].title
        var db = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
        if (db.isuse === '0') {
          return
        }
        delete db.isuse
        var connection = mysql.createConnection(db)
        that.$Loading.start()
        connection.connect()
        connection.query(
          `SELECT count(id) as total from worker where classNo like '${that.keyword}%'`,
          function (
            error,
            results,
            fields
          ) {
            if (error) throw error
            that.total = results[0].total
          })
        connection.query(
          `SELECT * from worker where classNo like '${that.keyword}%' limit 0,${that.pagesize}`,
          function (
            error,
            results,
            fields
          ) {
            if (error) throw error
            that.udata = results
          })
        that.$Loading.finish()
        connection.end()
      },
      classNoGet() {
        var that = this
        axios({
            url: that.$store.state.modals.settings.baseURL + 'getClassNoInfo.whtml',
            method: 'get',
            params: {
              projectId: that.$store.state.modals.login.projectId.id
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': that.$store.state.modals.login.token
            }
          })
          .then(function (data) {
            that.classNoArr = data.data.group
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      editWorkerGroup(item) {
        this.showWorkerGroup(item)
      },
      machinesel(sel, row) {
        this.machinesellist = sel
        this.singlemachine = row
        console.log('singlemachine = ', this.singlemachine)
      },
      editMachineInfo() {
        if (this.machinesellist.length === 1) {
          this.$store.dispatch('showMachineInfo', this.machinesellist)
        } else {
          this.$Notice.error({
            title: '错误',
            desc: '请选择一项后再进行修改操作'
          })
        }
      },
      delMachineInfoDialog() {
        if (this.machinesellist.length <= 0) {
          this.$Notice.error({
            title: '错误',
            desc: '请选择一项后再进行删除操作'
          })
          return
        }
        var that = this
        that.$Modal.confirm({
          title: `提示`,
          okText: '确认删除',
          cancelText: '取消',
          content: `<p>确认删除吗 ?</p>`,
          onOk: () => {
            that.$Spin.show()
            var mysql = require('mysql')
            var db = JSON.parse(
              JSON.stringify(settingsRepository.getDBSettings())
            )
            if (db.isuse === '0') return
            delete db.isuse
            var connection = mysql.createConnection(db)
            connection.connect()

            var dellist = []
            that.machinesellist.forEach(function (value, index, arr) {
              dellist.push(value.id)
            })
            connection.query(
              `DELETE FROM machine WHERE id in (${dellist.toString()})`,
              function (error, results, fields) {
                if (error) {
                  throw error
                } else {
                  that.$Notice.success({
                    title: '提醒',
                    desc: '操作成功'
                  })
                }
                that.$Spin.hide()
                that.refreshMachineList()
                connection.end()
              }
            )
          },
          onCancel: () => {
            this.handleSelectAllMachines(false)
          }
        })
      },
      handleSelectAllMachines(s) {
        this.$refs.selectedMachines.selectAll(s)
        if (!s) {
          this.machinesellist = []
          this.hideMachineInfo()
        }
      },
      testone() {
        var that = this
        that.$Spin.show()
        axios({
            url: that.$store.state.modals.settings.baseURL + 'queryUserProjectRole.whtml',
            method: 'get',
            params: {
              projectId: that.$store.state.modals.login.projectId.id
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': that.$store.state.modals.login.token
            }
          })
          .then(function (data) {
            console.log('data = ', data)
            if (data.data.list.classInfo.length <= 0) {
              that.$Notice.error({
                title: '提醒',
                desc: '项目下没有工人数据！'
              })
              return
            }
            var workers = data.data.list.classInfo

            var mysql = require('mysql')
            var db = JSON.parse(
              JSON.stringify(settingsRepository.getDBSettings())
            )
            if (db.isuse === '0') return
            delete db.isuse
            var connection = mysql.createConnection(db)
            connection.beginTransaction(function (err) {
              if (err) {
                throw err
              }
            })
            workers.forEach(function (v, i, a) {
              v.workers.forEach(function (value, index, arr) {
                connection.query(
                  `SELECT COUNT(id) as countnum from worker WHERE projectId=${that.$store.state.modals.login.projectId.id} AND userId='${value.userId}'`,
                  function (error, results, fields) {
                    if (error) {
                      return connection.rollback(function () {
                        throw error
                      })
                    }
                    if (results[0].countnum === 0) {
                      connection.query(
                        `INSERT INTO worker(userId,name,mobile,job,groupname,addtime,checkinState,checkinTime,
                      photo,projectId,workDate,urgentContractCellphone,urgentContractName,noBadMedicalHistory,
                      cultureLevelType,joinedTime,politicsType,birthPlaceCode,nation,idCardType,
                      classNo,currentAddresss,personType,homeAddress,workKind,birthday,gender,ptype) 
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [value.idcard, value.name, value.mobile, value.classNo, v.name, new Date(), 0,
                          null,
                          value.photo, that.$store.state.modals.login.projectId.id, value.workDate, value
                          .urgentContractCellphone,
                          value.urgentContractName, value.noBadMedicalHistory,
                          value.cultureLevelType, value.joinedTime, value.politicsType, value.birthPlaceCode,
                          value.nation, value.idCardType,
                          value.classNo, value.currentAddresss, value.personType, value.homeAddress,
                          value.workKind, value.birthday, value.gender, value.ptype
                        ],
                        function (error, results, fields) {
                          if (error) {
                            return connection.rollback(function () {
                              throw error
                            })
                          }
                        })
                    }
                  })
              })
            })

            connection.commit(function (err) {
              if (err) {
                return connection.rollback(function () {
                  that.$Notice.error({
                    title: '提醒',
                    desc: '数据获取失败！'
                  })
                  throw err
                })
              }
              that.$Notice.success({
                title: '提醒',
                desc: '数据获取成功！'
              })
            })
            // connection.end()
          })
          .catch(function (error) {
            console.log(error)
          })
        that.$Spin.hide()
      },
      editUser(param) {
        if (this.$store.state.modals.login.mode === '0') {
          this.$Modal.error({
            title: '提醒',
            content: `<p>线上下载模式下暂不支持人员编辑！<p>`
          })
          return
        }
        
        if (param.row.id > 0)
          this.$store.dispatch('showNewBoardModal', param.row)
      },
      changeWorkKind(v) {
        console.log('base v = ', v)
      }
    }
  }

</script>

<style>
  #wrapper {
    height: 100vh;
    width: 100vw;
  }

  div.fixedTabs .ivu-tabs-bar {
    position: fixed;
    top: 30px;
    z-index: 100;
    width: 100vw;
    left: 0px;
    padding: 2px;
    background: #fff;
    border-bottom: 1px solid #f8f8f9;
  }

  .ivu-tabs-tab-active .close-icon {
    opacity: 1;
  }

  .ivu-tabs-tab:hover .close-icon {
    display: inline-block;
    opacity: 1;
  }

  .close-icon {
    opacity: 0;
    transition: opacity 0.3s;
    position: absolute;
    padding-left: 3px;
  }

  footer {
    position: fixed;
    bottom: 0;
    background: #f8f8f9;
    color: rgb(150, 150, 150);
    text-align: center;
    width: 100%;
    cursor: pointer;
    padding: 10px 0;
    font-size: 1.2rem;
  }

  .ivu-page-simple {
    font-size: 1.2rem;
  }

  .ivu-tabs-bar {
    user-select: none;
    border-bottom: 1px solid #f8f8f9;
  }

  .ivu-table td.address-table-info-column {
    color: #555;
  }

  .ivu-tabs-ink-bar {
    height: 1px;
  }

  .Circle-custom h1 {
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
  }

  .Circle-custom p {
    color: #657180;
    font-size: 14px;
    margin: 10px 0 15px;
  }

  .tpane {
    margin: 50px 0 0 0;
  }

  .ivu-tabs-tab {
    font-size: 12.5px;
  }

  .btn {
    margin-right: 10px;
  }

  .ivu-modal-mask {
    background: -webkit-linear-gradient(left,#e8eaec,#f8f8f9); /* Safari 5.1 - 6 */
  }

  .ivu-modal-content {
    box-shadow: 2px 3px 26px rgba(0, 0, 0, 0.151);
    margin-bottom: 30px;
  }

  .ivu-modal-confirm-head-title {
    font-size: 14px;
  }

  .ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #5cadff;
    color: #fff;
  }

  .ivu-radio-wrapper-checked:hover {
    color: #fff !important;
  }

  .ivu-card-head {
    background: #f8f8f9;
    color: #17233d;
  }

  .ivu-card-body {
    background: #f8f8f9;
    font-size: 12px;
    line-height: 2em;
  }

  textarea.ivu-input {
    font-size: 12px;
  }

  .ivu-collapse {
    border-radius: 6px;
    background: #f8f8f9;
    border: 1px solid #e0e0e0;
  }

  -webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  -webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #EDEDED;
  }

</style>
