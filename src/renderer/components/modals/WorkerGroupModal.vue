<template>
  <Modal id="worker-group-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false"
    :footer-hide="true" width="500" :closable="true">
    <p slot="header">
      <Icon type="md-contacts"></Icon>
      <span style="font-weight:normal;">班组信息</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="150">
      <FormItem prop="name" label="班组名称">
        <i-input type="text" v-model="formInline.name" placeholder="请填写班组名称" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="teamLeader" label="联系人">
        <i-input type="text" v-model="formInline.teamLeader" placeholder="请填写联系人" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="contract" label="联系方式">
        <i-input type="text" v-model="formInline.contract" placeholder="请填写联系方式" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="teamIdNumber" label="班组长身份证号码">
        <i-input type="text" v-model="formInline.teamIdNumber" placeholder="班组长身份证号码" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="responseIdNumber" label="责任人身份证号码">
        <i-input type="text" v-model="formInline.responseIdNumber" placeholder="责任人身份证号码" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="memo" label="备注">
        <i-input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="formInline.memo" placeholder="备注" style="width: 260px"
          clearable>
        </i-input>
      </FormItem>
      <FormItem>
        <Button type="info" @click="handleSubmit('formInline')" shape="circle" style="width:120px;">提交</Button>
        <Button shape="circle" @click="handleReset('formInline')" style="width:120px;margin-left:8px;">重置</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'worker-group-modal',
    computed: {
      isVisible: {
        get () {
          return this.$store.state.modals.workerGroup.isVisible
        },
        set (value) {
          this.$store.state.modals.workerGroup.isVisible = value
        }
      }
    },
    data () {
      return {
        formInline: {
          name: '',
          teamLeader: '',
          teamIdNumber: '',
          responseIdNumber: '',
          contract: '',
          memo: ''
        },
        edit: false,
        ruleInline: {
          name: [{
            required: true,
            message: '请输入班组名称',
            trigger: 'blur'
          }],
          teamLeader: [{
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 2,
            message: '至少2位',
            trigger: 'blur'
          }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          var that = this
          if (valid) {
            that.$Spin.show()
            var posturl = that.$store.state.modals.settings.baseURL + 'addGroupInfo.whtml'
            var postgroup = {
              projectId: that.$store.state.modals.login.projectId.id,
              name: that.formInline.name,
              teamLeader: that.formInline.teamLeader,
              contract: that.formInline.contract,
              teamIdNumber: that.formInline.teamIdNumber,
              responseIdNumber: that.formInline.responseIdNumber,
              memo: that.formInline.memo,
              createUser: that.$store.state.modals.login.username
            }
            if (that.edit) {
              posturl = that.$store.state.modals.settings.baseURL + 'editGroupInfo.whtml'
              postgroup.id = that.$store.state.modals.workerGroup.data.id
            }
            axios({
              url: posturl,
              data: {
                group: postgroup
              },
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                'token': that.$store.state.modals.login.token
              }
            })
              .then(function (data) {
                if (data.data.code === '0') {
                  that.$Notice.success({
                    title: '提醒',
                    desc: data.data.msg
                  })
                } else {
                  that.$Notice.error({
                    title: '提醒',
                    desc: data.data.msg
                  })
                }
                console.log('handleSubmit',data)
              })
              .catch(function (error) {
                that.$Notice.error({
                  title: '提醒',
                  desc: '系统接口异常'
                })
                console.log(error)
              })
              .finally(() => {
                that.edit = false
                that.closeModal()
                that.$emit('classNoGet')
                that.$Spin.hide()
              })
          } else {
            that.$Notice.error({
              title: '提醒',
              desc: '输入数据不符合要求'
            })
          }
        })
      },
      visibleChange (isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          if (!this.$store.state.modals.workerGroup.data.name) { return }
          this.edit = true
          this.formInline.name = this.$store.state.modals.workerGroup.data.name
          this.formInline.contract = this.$store.state.modals.workerGroup.data.contract
          this.formInline.responseIdNumber = this.$store.state.modals.workerGroup.data.responseIdNumber
          this.formInline.teamIdNumber = this.$store.state.modals.workerGroup.data.teamIdNumber
          this.formInline.teamLeader = this.$store.state.modals.workerGroup.data.teamLeader
          this.formInline.memo = this.$store.state.modals.workerGroup.data.memo
        }
      },
      closeModal () {
        this.$store.dispatch('hideWorkerGroup')
        this.handleReset('formInline')
        this.$emit('classNoGet')
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    }
  }
</script>

<style scoped>
  .center {
    text-align: center;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

</style>
