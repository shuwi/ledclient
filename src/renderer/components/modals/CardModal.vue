<template>
  <Modal id="card-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false" :footer-hide="true"
    width="800" :closable="true">
    <p slot="header">
      <Icon type="logo-foursquare" />
      <span style="font-weight:normal;">{{ formInline.id != 0? '修改':'新增'}}人员资格证书</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="120">
      <div class="container">
        <div>
          <FormItem label="证件类型" prop="idType">
            <Select v-model="formInline.idType" style="width:200px">
              <Option v-for="item in idCardTypeArr" :value="item.datacode" :key="item.datacode">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem prop="idNumber" label="证件编号">
            <i-input type="text" v-model.trim="formInline.idNumber" placeholder="请填写证件编号" clearable style="width: 200px">
            </i-input>
          </FormItem>
        </div>
        <div>
          <FormItem prop="name" label="姓名">
            <i-input type="text" v-model.trim="formInline.name" placeholder="请填写姓名" clearable style="width: 200px">
            </i-input>
          </FormItem>
        </div>
        <div>
          <FormItem prop="cerNo" label="证书编号">
            <i-input type="text" v-model.trim="formInline.cerNo" placeholder="请填写证书编号" clearable style="width: 200px">
            </i-input>
          </FormItem>
        </div>
        <div>
          <FormItem prop="jobType" label="类别/工种">
            <Select v-model="formInline.jobType" style="width:200px" @on-change="workKindChange">
              <Option v-for="item in workKindArr" :value="item.id" :key="item.id">{{ item.kindName }}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem prop="cerName" label="证书名称">
            <i-input type="text" v-model.trim="formInline.cerName" placeholder="请填写证书名称" clearable style="width: 200px">
            </i-input>
          </FormItem>
        </div>
        <div>
          <FormItem prop="validBeginDate" label="证书有效起始时间">
            <DatePicker placeholder="请选择证书有效起始时间" v-model="formInline.validBeginDate" style="width:200px" format="yyyy-MM-dd"></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem prop="validEndDate" label="证书有效截止时间">
            <DatePicker placeholder="请选择有效截止时间" v-model="formInline.validEndDate" style="width:200px" format="yyyy-MM-dd"></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem prop="issueby" label="发证机关">
            <i-input type="text" v-model.trim="formInline.issueby" placeholder="请填写发证机关" clearable style="width: 200px">
            </i-input>
          </FormItem>
        </div>
        <div>
          <FormItem prop="issueDate" label="发证日期">
            <DatePicker placeholder="请选择发证日期" v-model="formInline.issueDate" style="width:200px" format="yyyy-MM-dd"></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem prop="status" label="资质状态">
            <Select v-model="formInline.status" style="width:200px">
              <Option value="1">有效</Option>
              <Option value="2">注销</Option>
              <Option value="3">过期</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem>
            <Button type="info" @click="handleSubmit('formInline')" shape="circle" style="width:120px;">提交</Button>
            <Button shape="circle" @click="handleReset('formInline')" style="width:120px;margin-left:8px;">重置</Button>
          </FormItem>
        </div>
      </div>
    </Form>
  </Modal>
</template>

<script>
  import settingsRepository from '@/repositories/settingsRepository'
  import axios from 'axios'
  export default {
    name: 'card-modal',
    props: ['userDataSend'],
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.card.isVisible
        },
        set(value) {
          this.$store.state.modals.card.isVisible = value
        }
      }
    },
    data() {
      return {
        workKindArr: [],
        idCardTypeArr: [],
        formInline: {
          idType: '',
          idNumber: '',
          jobType: '',
          cerName: '',
          validBeginDate: '',
          validEndDate: '',
          issueby: '',
          issueDate: '',
          status: '',
          cerNo: '',
          id: 0,
          source: 1,
          csId: 0
        },
        ruleInline: {
          idType: [{
            required: true,
            message: '请选择',
            trigger: 'change',
            type: 'number'
          }],
          idNumber: [{
            required: true,
            message: '请输入证件编号',
            trigger: 'blur',
            type: 'string'
          }],
          jobType: [{
            required: true,
            message: '请选择',
            trigger: 'change',
            type: 'number'
          }],
          cerName: [{
            required: true,
            message: '请输入证书名称',
            trigger: 'blur'
          }],
          validBeginDate: [{
            required: true,
            message: '请选择',
            trigger: 'change',
            type: 'date'
          }],
          validEndDate: [{
            required: true,
            message: '请选择',
            trigger: 'change',
            type: 'date'
          }],
          status: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          cerNo: [{
            required: true,
            message: '请输入证书编号',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      handleSubmit(name) {
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
            var stat =
              'INSERT INTO card(idType,idNumber,jobType,cerName,validBeginDate,validEndDate,issueby,issueDate,status,cerNo) VALUES (?,?,?,?,?,?,?,?,?,?)'
            if (that.formInline.id !== 0) {
              stat =
                `UPDATE card SET idType = ?,idNumber = ?,jobType = ?,cerName = ?,validBeginDate = ?,validEndDate = ?,issueby = ?,issueDate = ?,status = ?,cerNo = ? WHERE id = ${that.formInline.id} `
            }
            console.log(stat)
            connection.connect()
            connection.query(
              stat, [
                that.formInline.idType,
                that.formInline.idNumber,
                that.formInline.jobType,
                that.formInline.cerName,
                that.formInline.validBeginDate,
                that.formInline.validEndDate,
                that.formInline.issueby,
                that.formInline.issueDate,
                that.formInline.status,
                that.formInline.cerNo
              ],
              function (error, results, fields) {
                if (error) {
                  console.log('error:', error)
                }
                console.log('results = ',results) 
                that.formInline.id = that.formInline.csId = results.insertId
                that.$Spin.hide()
                that.$store.state.modals.card.data = that.formInline
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
      visibleChange(isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          var that = this
          if (that.workKindArr.length > 0) {
            return
          }
          that.formInline.idNumber = that.userDataSend.userId
          that.formInline.name = that.userDataSend.name
          axios({
              url: that.$store.state.modals.settings.baseURL + 'getWorkKindInfo.whtml',
              method: 'get',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': that.$store.state.modals.login.token
              },
              params: {
                workKindType: 3
              },
            })
            .then(function (data) {
              console.log('特殊工种数据', data)
              that.workKindArr = data.data.workKind
            })
            .catch(function (error) {
              console.log(error)
            })
          if (that.idCardTypeArr.length > 0) {
            return
          }
          axios({
              url: that.$store.state.modals.settings.baseURL + 'getIdCardType.whtml',
              method: 'get',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': that.$store.state.modals.login.token
              }
            })
            .then(function (data) {
              console.log('getIdCardType.whtml', data)
              that.idCardTypeArr = data.data.record
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      },
      closeModal(val) {
        this.$store.dispatch('hideCard')
        //this.handleReset('formInline')
        console.log('this.$store.state.modals.card.data = ',this.$store.state.modals.card.data)
        this.formInline.id = 0
        //this.$emit('refreshMachineList')
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      workKindChange(v) {
        console.log(`子组件${v}`)
        this.$emit('setWorkKindSelected', v)
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
