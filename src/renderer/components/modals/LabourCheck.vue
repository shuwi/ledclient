<template>
  <Modal id="new-labour-modal" v-model="visible" @on-visible-change="visibleChange" :mask-closable="false" :footer-hide="true"
    width="800" style="padding-bottom:20px;">
    <p slot="header">
      <span style="font-weight:normal;">人员{{ status? '退':'进' }}场</span>
    </p>
    <Table border :columns="columns" :data="userlist" style="margin-bottom:20px;"></Table>
    <Form ref="joinUser" :model="joinUser" :rules="ruleValidate">
      <Row v-if="status">
        <i-col span="24">
          <FormItem label="评价" prop="evaluation">
            <Input v-model="joinUser.evaluation" placeholder="请填写评价" type="textarea" :rows="4" />
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <FormItem>
          <Button type="primary" @click="handleSubmit('joinUser')" shape="circle" style="width:100px;" :loading="loadingPostUser"
            icon="md-checkmark">提交</Button>
          <Button v-if="status" @click="handleReset('joinUser')" style="margin-left: 8px;width:100px;" shape="circle"
            type="warning" icon="ios-undo">重置</Button>
        </FormItem>
      </Row>
    </Form>
  </Modal>
</template>

<script>
  import settingsRepository from '@/repositories/settingsRepository'
  import axios from 'axios'
  export default {
    props: ['token', 'projectId', 'status', 'checkvisible', 'userlist'],
    name: 'labour-check',
    computed: {
      visible: {
        get: function () {
          return this.checkvisible
        },
        set: function () {}
      }
    },
    data() {
      return {
        joinUser: {
          userId: '',
          projectId: '',
          joinStatus: '',
          evaluation: ''
        },
        loadingPostUser: false,
        ruleValidate: {
          evaluation: [{
            type: 'string',
            min: 20,
            max: 500,
            message: '评价信息字符数在20-500之间',
            trigger: 'blur'
          }]
        },
        columns: [{
            title: '姓名',
            key: 'name'
          },
          {
            title: '身份证号',
            key: 'userId'
          }
        ]
      }
    },
    methods: {
      resetInput() {
        this.$refs['joinUser'].resetFields()
      },
      visibleChange(checkvisible) {
        if (!checkvisible) {
          this.$emit('visibleChange', false)
          this.closeModal()
        } else {
          this.$emit('visibleChange', true)
        }
      },
      closeModal() {
        this.loadingPostUser = false
        this.$emit('visibleChange', false)
        this.$emit('reloadPage')
        this.resetInput()
      },
      handleSubmit(name) {
        var d = this.status ? 'joinOutUser' : 'joinInUser'
        var that = this
        var postdata = []
        var uids = []
        that.userlist.forEach(function (value, index, arr) {
          postdata.push({
            userId: value.userId,
            projectId: value.projectId,
            joinStatus: that.status ? '退场' : '进场'
          })
          uids.push("'" + value.userId + "'")
        })

        if (that.status) {
          that.loadingPostUser = true
          axios({
              url: that.$store.state.modals.settings.baseURL + `${d}.whtml`,
              data: {
                joinUser: {
                  joinUser: postdata,
                  evaluation: that.joinUser.evaluation
                }
              },
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                token: that.token
              }
            })
            .then(function (data) {
              console.log(data)
              //console.log(`UPDATE worker set inState = 1 WHERE userId in (${uids.join(',')})`)
              if (data.data.result === 1) {
                that.$Notice.success({
                  title: '提示',
                  desc: data.data.message
                })
                var mysql = require('mysql')
                var db = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
                if (db.isuse === '0') {
                  return
                }
                delete db.isuse
                var connection = mysql.createConnection(db)
                console.log(
                  `UPDATE worker set inState = ${that.status ? '2' : '1'} WHERE userId in (${uids.join(',')})`)
                connection.connect()
                connection.query(
                  `UPDATE worker set inState = ${that.status ? '2' : '1'} WHERE userId in (${uids.join(',')})`,
                  function (
                    error,
                    results,
                    fields
                  ) {
                    if (error) {
                      return that.$Notice.error({
                        title: '提醒',
                        desc: `<p style="font-size:12px;">本地操作失败！</p>`
                      })
                    } else {
                      that.$Notice.success({
                        title: '提示',
                        desc: `<p style="font-size:12px;">本地操作成功！</p>`
                      })
                    }
                  })

              } else
                that.$Notice.error({
                  title: '提醒',
                  desc: data.data.message
                })
            })
            .catch(function (error) {
              that.$Notice.error({
                title: '提醒',
                desc: '系统接口异常'
              })
              console.log(error)
            })
            .finally(() => {
              that.loadingPostUser = false
              that.closeModal()
              that.$refs['joinUser'].resetFields()
            })
        }
        if (!that.status) {
          that.loadingPostUser = true
          axios({
              url: that.$store.state.modals.settings.baseURL + `${d}.whtml`,
              data: {
                joinUser: {
                  joinUser: postdata,
                  evaluation: that.joinUser.evaluation
                }
              },
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                token: that.token
              }
            })
            .then(function (data) {
              console.log(data)
              if (data.data.result === 1) {
                that.$Notice.success({
                  title: '提示',
                  desc: data.data.message
                })
                var mysql = require('mysql')
                var db = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
                if (db.isuse === '0') {
                  return
                }
                delete db.isuse
                var connection = mysql.createConnection(db)
                
                connection.connect()
                connection.query(
                  `UPDATE worker set inState = ${that.status ? '2' : '1'} WHERE userId in (${uids.join(',')})`,
                  function (
                    error,
                    results,
                    fields
                  ) {
                    if (error) {
                      return that.$Notice.error({
                        title: '提醒',
                        desc: `<p style="font-size:12px;">本地操作失败！</p>`
                      })
                    } else {
                      that.$Notice.success({
                        title: '提示',
                        desc: `<p style="font-size:12px;">本地操作成功！</p>`
                      })
                    }
                  })
              } else
                that.$Notice.error({
                  title: '提醒',
                  desc: '操作失败，可能未录入人脸'
                })
            })
            .catch(function (error) {
              that.$Notice.error({
                title: '提醒',
                desc: '系统接口异常'
              })
              console.log(error)
            })
            .finally(() => {
              that.loadingPostUser = false
              that.closeModal()
              that.$refs['joinUser'].resetFields()
            })
        }
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      }
    }
  }

</script>
