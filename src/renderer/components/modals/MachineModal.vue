<template>
  <Modal id="worker-group-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false"
    :footer-hide="true" width="460" :closable="true">
    <p slot="header">
      <Icon type="md-finger-print" />
      <span style="font-weight:normal;">{{ formInline.id != 0? '修改':'新增'}}考勤机主信息</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="110">
      <FormItem prop="ip" label="IP">
        <i-input type="text" v-model.trim="formInline.ip" placeholder="请填写IP" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="mport" label="端口">
        <InputNumber :max="10000" :min="0" v-model.number="formInline.mport" style="width: 260px"></InputNumber>
      </FormItem>
      <FormItem prop="mname" label="名称">
        <i-input type="text" v-model.trim="formInline.mname" placeholder="请填写考勤机名称" clearable style="width: 260px">
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
  import settingsRepository from '@/repositories/settingsRepository'
  export default {
    name: 'machine-info-modal',
    computed: {
      isVisible: {
        get () {
          return this.$store.state.modals.machineInfo.isVisible
        },
        set (value) {
          this.$store.state.modals.machineInfo.isVisible = value
        }
      }
    },
    data () {
      return {
        formInline: {
          ip: '',
          mport: null,
          mname: '',
          id: 0
        },
        ruleInline: {
          mname: [{
            required: true,
            message: '请输入考勤机名称',
            trigger: 'blur'
          }],
          mport: [{
            required: true,
            message: '请输入端口号',
            trigger: 'blur',
            type: 'number'
          }
          ],
          ip: [{
            required: true,
            message: '请输入IP',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 4,
            message: 'IP至少4位',
            trigger: 'blur'
          }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate(valid => {
          var that = this
          
          if (valid) {
            that.$Spin.show()
            var mysql = require('mysql')
            var db = JSON.parse(
              JSON.stringify(settingsRepository.getDBSettings())
            )
            if (db.isuse === '0') return
            delete db.isuse
            var connection = mysql.createConnection(db)
            var stat = 'INSERT INTO machine(port,ip,mname) VALUES (?,?,?)'
            if (that.formInline.id !== 0) { stat = `UPDATE machine SET port = ?, ip = ?, mname = ? WHERE id = ${that.formInline.id} ` }
            console.log('stat = ',stat)
            connection.connect()
            connection.query(
              stat, [
                that.formInline.mport,
                that.formInline.ip,
                that.formInline.mname
              ],
              function (error, results, fields) {
                if (error) {
                  throw error
                } else {
                  console.log('results = ',results)
                  that.$Notice.success({
                    title: '提醒',
                    desc: '操作成功'
                  })
                }
                that.$Spin.hide()
                that.closeModal()
                connection.end()
              }
            )
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
          if (this.$store.state.modals.machineInfo.data.length !== 1) { return }
          this.handleReset('formInline')
          this.formInline.mname = this.$store.state.modals.machineInfo.data[0].mname
          this.formInline.mport = this.$store.state.modals.machineInfo.data[0].port
          this.formInline.ip = this.$store.state.modals.machineInfo.data[0].ip
          this.formInline.id = this.$store.state.modals.machineInfo.data[0].id
        }
      },
      closeModal () {
        this.$store.dispatch('hideMachineInfo')
        this.handleReset('formInline')
        this.formInline.id = 0
        this.$emit('refreshMachineList')
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
