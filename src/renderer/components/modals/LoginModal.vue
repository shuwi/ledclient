<template>
  <Modal id="new-board-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false"
    :footer-hide="true" width="460" :closable="false">
    <p slot="header" style="text-align:center;">
      <span style="font-weight:normal;">系统登录</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="90">
      <FormItem prop="user" label="用户名">
        <i-input type="text" v-model="formInline.user" placeholder="用户名" clearable style="width: 300px">
          <Icon type="ios-person" slot="prefix" />
        </i-input>
      </FormItem>
      <FormItem prop="password" label="密码">
        <i-input type="password" v-model="formInline.password" placeholder="密码" clearable style="width: 300px" @on-enter="handleSubmit('formInline')">
          <Icon type="md-lock" slot="prefix"></Icon>
        </i-input>
      </FormItem>
      <FormItem prop="modal" label="登录模式">
        <RadioGroup v-model="formInline.modal" type="button">
          <Radio label="0">线上下载模式</Radio>
          <Radio label="1">C端录入模式</Radio>
          <Radio label="2">本地化模式</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button @click="handleSubmit('formInline')" shape="circle" style="width:260px;margin-left:0px;" type="primary" :loading="loading">登录</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import axios from 'axios'
  export default {
    computed: {
      isVisible: {
        get () {
          return this.$store.state.modals.login.isVisible
        },
        set (value) {
          this.$store.state.modals.login.isVisible = value
        }
      }
    },
    data () {
      return {
        loading: false,
        formInline: {
          user: 'NTJZXM002503',
          password: '123456',
          modal: '1'
        },
        ruleInline: {
          user: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '密码至少6位',
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
            that.loading = true
            axios({
              url: that.$store.state.modals.settings.baseURL + 'loginClient.whtml',
              params: {
                userName: that.formInline.user,
                password: that.formInline.password
              },
              method: 'post',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
              .then(function (data) {
                if (data.data.code === '0') {
                  console.log('登录',data)
                  that.$store.dispatch('setToken', data.data.token)
                  that.$store.dispatch('setProjectId', data.data.project)
                  that.$store.dispatch('setUserName', that.formInline.user)
                  that.$store.dispatch('setMode', that.formInline.modal)
                  that.visibleChange(false)
                } else {
                  that.$Notice.error({
                    title: '提醒',
                    desc: data.data.msg
                  })
                }
              })
              .catch(function (error) {
                that.$Notice.error({
                  title: '提醒',
                  desc: '登录异常，请联系管理员'
                })
                console.log(error)
              })
              .finally(() => {
                that.$Spin.hide()
                that.loading = false
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
        }
      },
      closeModal () {
        if (this.$store.state.modals.login.token !== '') { this.$store.dispatch('hideLoginModal') } else { this.$store.dispatch('showLoginModal') }
        this.resetInput()
      },
      resetInput () {
        this.$refs['formInline'].resetFields()
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
