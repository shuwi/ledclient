<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="状态" prop="isuse">
        <i-switch v-model="formValidate.isuse" size="large" true-value="1" false-value="0">
          <span slot="open">启用</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="主机" prop="host">
        <Input v-model="formValidate.host" placeholder="输入主机IP"></Input>
      </FormItem>
      <FormItem label="用户名" prop="user">
        <Input v-model="formValidate.user" placeholder="输入用户名"></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="formValidate.password" type="password" placeholder="输入密码"></Input>
      </FormItem>
      <FormItem label="数据库" prop="database">
        <Input v-model="formValidate.database" placeholder="输入数据库名"></Input>
      </FormItem>
      <FormItem>
        <Button shape="circle" type="primary" @click="handleSubmit('formValidate')" style="width:120px;">提交</Button>
        <Button shape="circle" @click="handleReset('formValidate')" style="width:120px;margin-left:8px;">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import settingsRepository from '@/repositories/settingsRepository'
  export default {
    name: 'GeneralSettings',
    computed: {
      prependNewItems: {
        get () {
          return this.$store.state.settings.prependNewItems
        },
        set (val) {
          this.$store.dispatch('setPrependNewItem', val)
          this.showSuccessNotification()
        }
      },
      markdownMode: {
        get () {
          return this.$store.state.settings.markdownMode
        },
        set (val) {
          this.$store.dispatch('setMarkdownMode', val)
          this.showSuccessNotification()
        }
      },
      darkTheme: {
        get () {
          return this.$store.state.settings.darkTheme
        },
        set (val) {
          this.$store.dispatch('setDarkTheme', val)
          this.$store.dispatch('setRestartRequired')
          this.showSuccessNotification()
        }
      },
      itemCreationDate: {
        get () {
          return this.$store.state.settings.itemCreationDate
        },
        set (val) {
          this.$store.dispatch('setItemCreationDate', val)
          this.showSuccessNotification()
        }
      },
      stickBoardsOnTop: {
        get () {
          return this.$store.state.settings.stickBoardsOnTop
        },
        set (val) {
          this.$store.dispatch('setStickBoardsOnTop', val)
          this.showSuccessNotification()
        }
      }
    },
    data () {
      return {
        formValidate: {
          isuse: '1',
          user: '',
          host: '',
          password: '',
          database: ''
        },
        ruleValidate: {
          user: [{
            required: true,
            message: '用户名必填',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 4,
            message: '至少4个字符',
            trigger: 'blur'
          }
          ],
          host: [{
            required: true,
            message: '主机必填',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '至少6个字符',
            trigger: 'blur'
          }
          ],
          password: [{
            required: true,
            message: '数据库密码必填',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '至少6个字符',
            trigger: 'blur'
          }
          ],
          database: [{
            required: true,
            message: '数据库名必填',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 4,
            message: '至少4个字符',
            trigger: 'blur'
          }
          ]
        }
      }
    },
    methods: {
      showSuccessNotification () {
        this.$Message.success('信息已成功更新！')
        this.$emit('settingsUpdated')
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$store.dispatch('setDBIsUse', this.formValidate.isuse)
            this.$store.dispatch('setDBHost', this.formValidate.host)
            this.$store.dispatch('setDBUser', this.formValidate.user)
            this.$store.dispatch('setDBPassword', this.formValidate.password)
            this.$store.dispatch('setDBDataBase', this.formValidate.database)
            this.showSuccessNotification()
          } else {
            this.$Message.error('请按要求填写后再提交')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    },
    mounted () {
      var db = settingsRepository.getDBSettings()
      this.formValidate.isuse = db.isuse
      this.formValidate.database = db.database
      this.formValidate.host = db.host
      this.formValidate.password = db.password
      this.formValidate.user = db.user
    }
  }
</script>

<style scoped>
  .row {
    margin: 7px 0;
  }

</style>
