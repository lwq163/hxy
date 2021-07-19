<template>
  <div>
    <div class="payment-collection-search">
      <Form ref="paymentColl" :model="paymentCollForm" :label-width="100">
        <Row>
          <Col :md="12" :lg="8" :xl="6" :xxl="6">
            <FormItem label="录入人" prop="createName">
              <Input v-model="paymentCollForm.createName" clearable placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8" :xl="6" :xxl="6">
            <FormItem label="合同编号" prop="contractNo">
              <Input v-model="paymentCollForm.contractNo" clearable @input="handleSearchContractNo" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8" :xl="6" :xxl="6">
            <FormItem label="客户名称" prop="companyName">
              <Input v-model="paymentCollForm.companyName" clearable placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8" :xl="6" :xxl="6">
              <FormItem label="开始时间" prop="startTime">
                  <DatePicker 
                      type="date"
                      :options="beginOption"
                      v-model="paymentCollForm.startTime" 
                      placeholder="请选择" 
                      :editable="false" 
                      placement="bottom-start"
                      clearable>
                  </DatePicker>
              </FormItem>
          </Col>
          <Col :md="12" :lg="8" :xl="6" :xxl="6">
              <FormItem label="结束时间" prop="endTime">
                  <DatePicker 
                      type="date"
                      :options="endOption"
                      v-model="paymentCollForm.endTime" 
                      placeholder="请选择" 
                      :editable="false" 
                      placement="bottom-start" 
                      clearable>
                  </DatePicker>
              </FormItem>
          </Col>
          <Col :md="12" :lg="8" :xl="6" :xxl="6">
            <FormItem label="合同所属人"  prop="contractBelongName">
              <Input v-model="paymentCollForm.contractBelongName" clearable placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8" :xl="6" :xxl="6">
            <Button type="primary" @click="handleSearchIncome" icon="ios-search" class="hxy-ml-30 hxy-mr-10">搜索</Button>
						<Button type="default" @click="handleReset('paymentColl')" icon="ios-refresh">清空</Button>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="payment-collection-btn hxy-mb-15">
      <Button class="hxy-mr-10" type="primary" ghost @click="payCollModalBtn">新增回款</Button>
      <Button class="hxy-mr-10" to="/crmManage/invoicing/invoiceRecord" @click="$router.push">新增开票</Button>
      <Button class="hxy-mr-10" @click="openTran">栏目标题</Button>
      <Button class="hxy-mr-10" :disabled="removeIncomeBtn" @click="handleRemove">删除</Button>
      <!-- <Button class="hxy-mr-10" @click="handleExportFile">导出</Button> -->
    </div>

    <div class="parment-collection-table hxy-mb-15">
      <Table border ref="paymentCollectionTable" :columns="payCollTitle" :data="payCollData" @on-selection-change="selectChange"></Table>
    </div>

    <div class="pos-r tr">
      <Page :total="total" :page-size="paymentCollForm.pageSize" :current="paymentCollForm.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </div>

    <!-- 穿梭框 -->
    <tranFer :dataShow="TranList"  :TranListNo="TranListNo"   v-show="TranFlag" @closeTran="closeTran"></tranFer>

    <Modal :title="payCollTit" :width="720" :footer-hide="true" :mask-closable="false" v-model="payCollModal">
      <Form ref="addPayColl" :label-width="120" :model="addPayCollForm" :rules="addPayCollRules" >
        <Row>
          <Col span="12">
            <FormItem label="客户名称" prop="crmCustomerId">
              <Select placeholder="请选择客户名称"  v-model="addPayCollForm.crmCustomerId" @on-change="handleContract" clearable :disabled='payCollDisabled'>
                  <Option v-for="(item,index) in customerOpt" :key="index" :value="item.customerId">{{item.companyName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="合同编号" prop="contractNo">
              <Select  placeholder="请选择合同编号"  v-model="addPayCollForm.contractNo" @on-change="handleContractNo" clearable :disabled='payCollDisabled'>
                  <Option v-for="(item,index) in contractNoOpt" :key="index" :value="item.contractNo">{{item.contractNo}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="合同所属人" prop="contractBelong">
              <Input v-model="addPayCollForm.contractBelong" disabled clearable/>
            </FormItem>
          </Col>
        </Row>
        
        <Button v-show="!payCollDisabled" @click="handlePayCollInfoModal">新增回款信息</Button>
        <!-- <FormItem prop="payCollDataModal"> -->
          <Table border class="hxy-mb-15 hxy-mt-15" ref="payCollTableModal" :columns="payCollDataTitle" :data="payCollDataModal"></Table>
        <!-- </FormItem> -->
        
        <!-- <FormItem prop="listenFile"> -->
          <modalUpLoad v-show="!payCollDisabled" upLoadText="回款凭证" @listenFile="listenFile" ref="fileOne"></modalUpLoad>
        <!-- </FormItem> -->

        <FormItem label="生成战报" :md="12" :lg="8" :xl="6" :xxl="6" prop="code2222" class="hxy-mt-30">
          <Select  placeholder="请选择"  v-model="addPayCollForm.battleTemplate" clearable :disabled='payCollDisabled'>
              <Option v-for="(item,index) in battleTemplateOpt" :key="index" :value="item.label">{{item.label}}</Option>
          </Select>
        </FormItem>

        <!-- <FormItem label="抄送人" :md="12" :lg="8" :xl="6" :xxl="6" prop="code2222" class="hxy-mt-30">
          <Select  multiple style="width:260px;">
            <Option value="new york">某某某</Option>
          </Select>
          <span class="hxy-ml-15">添加抄送人</span>
        </FormItem> -->
        
        <!-- <FormItem label="发送到群" :md="12" :lg="8" :xl="6" :xxl="6" prop="code2222">
          <Select  multiple style="width:260px">
            <Option value="new york">某某某</Option>
          </Select>
          <span class="hxy-ml-15">添加群</span>
        </FormItem> -->
        <approve ref="approve_ref" :name="1"></approve>
        <Col span="24" class="tr">
          <FormItem>
            <Button @click="payCollModal=false">取消</Button>
            <Button type="primary" style="margin-left: 8px" @click="handleAddPay('addPayColl')">确定</Button>
          </FormItem>
        </Col>
      </Form>
    </Modal>

    <Modal :title="payCollTit" :width="720" :footer-hide="true" :mask-closable="false" v-model="payCollInfoModal">
      <Form ref="payCollInfo" :model="payCollInfoForm" :rules="payCollRules" :label-width="110" >
        <Row>
          <Col span="12">
            <FormItem label="付款方式" prop="payMethod">
              <Select  placeholder="请选择" v-model="payCollInfoForm.payMethod">
                  <Option v-for="(item,index) in payMethodOpt" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="付款批次" prop="payBatch">
              <Select  placeholder="请选择"  v-model="payCollInfoForm.payBatch" @on-change="handleBatchNo">
                  <Option v-for="(item,index) in batchNo" :key="index" :value="item.batchNo">{{item.batchNo}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="付款类型" prop="payType">
              <Select  placeholder="请选择"  v-model="payCollInfoForm.payType">
                  <Option v-for="(item,index) in payTypeOpt" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="回款日期"  prop="payTime">
              <DatePicker 
                  type="date"
                  style="width: 100%"
                  v-model="payCollInfoForm.payTime" 
                  placeholder="请选择" 
                  :editable="false" 
                  placement="bottom-start" 
                  clearable>
              </DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="回款金额" prop="payPrice">
              <Input v-model="payCollInfoForm.payPrice" clearable disabled/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="线下发票状态" prop="offlineInvoiceStatus">
              <Select  placeholder="请选择"  v-model="payCollInfoForm.offlineInvoiceStatus">
                  <Option v-for="(item,index) in offlineInvoiceStatusOpt" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem label="发票号">
              <Input v-model="payCollInfoForm.ind77"/>
            </FormItem>
          </Col> -->
          <Col span="24" class="tr">
            <FormItem>
              <Button @click="payCollInfoModal = false">取消</Button>
              <Button type="primary" style="margin-left: 8px" :disabled="addPayCollBtn" @click="handleAddPayCollInfo('payCollInfo')">确定</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { incomeAdd, incomeList, getContractByCustomerId, listMasterDeptContract, incomeDelete, getIncomeDetail,incomeDetail, income, listAdd, incomeEdit, listBatchAmount } from "_s/collection"
import { queryCurrStaff, getMasterDeptCustomer } from "_s/customer"
import tranFer from '_c/Transfer/Transfer'
import {  mapGetters } from 'vuex'
import approve from '_c/approve'

export default {
  data() {
    return {
      payCollDisabled: false, // 回款详情是否禁用
      payCollInfoTit: '', // 回款信息弹框标题
      payCollTit: '', // 回款弹框标题
      payCollInfoType: null, // 0表示新增
      payCollType: null, // 0表示新增
      paramsInd: '', // 编辑回款信息列表下标
      addPayCollBtn: false, // 是否禁用新增回款信息保存确定按钮
      removeIncomeBtn: true, // 删除列表数据
      payCollModal: false,
      payCollInfoModal: false,
      total: null,
      paymentCollForm: {
        pageNum: 1,
        pageSize: 10
      },
      payCollInfoForm: {}, // 新增回款信息
      payCollRules: {
        payMethod: [{required: true,message: '此项不能为空', trigger: 'change'}],
        payBatch: [{required: true,message: '此项不能为空', trigger: 'change'}],
        payType: [{required: true,message: '此项不能为空', trigger: 'change'}],
        payTime: [{required: true,message: '此项不能为空', trigger: 'change', type: 'date'}],
        offlineInvoiceStatus: [{required: true,message: '此项不能为空', trigger: 'change'}],
      },
      payCollDataTitle: [{
        title: '序号',
        width: 65,
        align: 'center',
        render:(h,params)=>{
          return h("span",{},params.index+1)
        }
      },{
        title: '付款方式',
        width: 160,
        key: 'payMethodName',
        align: 'center'
      },{
        title: '付款批次',
        width: 160,
        key: 'payBatch',
        align: 'center'
      },{
        title: '付款类型',
        width: 160,
        key: 'payTypeName',
        align: 'center'
      },{
        title: '回款日期',
        width: 160,
        key: 'payTime',
        align: 'center'
      },{
        title: '回款金额',
        width: 160,
        key: 'payPrice',
        align: 'center'
      },{
        title: '线下发票状态',
        width: 160,
        key: 'offlineInvoiceStatusName',
        align: 'center'
      },{
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: () => {
                  this.payCollInfoType = 1
                  this.echoPayColl(params.row, params.index)
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: () => {
                  this.payCollDataModal.splice(params.index, 1)
                }
              }
            }, '删除')
          ])
        }
      }], // 新增回款信息key
      payCollDataModal: [], // 回款信息表格
      reportList: [{
        id: 1
      }],
      payCollTitle: [{
        type: 'selection',
        width: 60,
        align: 'center'
      },{
        title: '序号',
        width: 65,
        align: 'center',
        render:(h,params)=>{
          return h("span" ,{},params.index+1)
        }
      },{
        title: '录入人',
        key: 'createName',
        align: 'center'
      },{
        title: '录入日期',
        key: 'createTime',
        align: 'center'
      },{
        title: '客户名称',
        key: 'customerName',
        align: 'center'
      },{
        title: '合同编号',
        key: 'contractNo',
        align: 'center'
      },{
        title: '合同所属人',
        key: 'contractBelong',
        align: 'center'
      },{
        title: '回款信息',
        key: 'payStatus',
        align: 'center'
      },{
        title: '回款凭证',
        key: 'ind7',
        width: 130,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              }
            }, '详情'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              }
            }, '下载')
          ])
        } 
      },{
        title: '操作',
        width: 170,
        fixed: 'right',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: () => {
                  this.payCollTit = '编辑回款'
                  this.payCollType = 1 // 详情类型
                  this.payCollModal = true
                  this.payCollDisabled = false
                  this.getIncome(params.row)
                }
              }
            },'编辑'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: () => {
                  this.payCollTit = '回款详情'
                  this.payCollType = 2 // 详情类型
                  this.payCollModal = true
                  this.payCollDisabled = true
                }
              }
            },'详情'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: () => {
                  let incomeId = []
                  incomeId.push(params.row.incomeId)
                  this.incomeDeleteFn(incomeId)
                }
              }
            },'删除')
          ])
        }
      }], // 回款列表key
      payCollData: [], // 回款列表
      // 穿梭框参数
      TranFlag: false, //开关
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
      customerOpt: [],
      addPayCollForm: {
        battleTemplate: '模板一'
      },
      addPayCollRules: {
        crmCustomerId: [{required: true,message: '此项不能为空', trigger: 'change', type: 'number'}],
        contractNo: [{required: true,message: '此项不能为空', trigger: 'change'}],
        // contractBelong: [{required: true,message: '此项不能为空', trigger: 'change'}],
        // payCollDataModal: [{required: true,message: '此项不能为空', trigger: 'change'}],
        // listenFile: [{required: true,message: '此项不能为空', trigger: 'change'}],
      },
      contractNoOpt: {}, // 合同编号
      payMethodOpt: [],
      payTypeOpt: [],
      offlineInvoiceStatusOpt: [],
      fileList: [],
      battleTemplateOpt: [{
        label: '模板一',
        value: '1'
      },{
        label: '模板二',
        value: '2'
      },{
        label: '模板三',
        value: '3'
      }],
      queryCurrStaff: [], // 录入人
      beginOption: {
        // 开始时间必须小于结束时间
        disabledDate: (date) => {
          if (!this.paymentCollForm.endTime) {
            return date.getTime() < new Date(1970 - 1 - 1).getTime()
          } else {
            return date.getTime() > new Date(this.paymentCollForm.endTime)
          }
        }
      },
      endOption: {
        // 结束时间必须大于开始时间
        disabledDate: (date) => {
          return (
            date.getTime() < new Date(this.paymentCollForm.startTime) ||
            date.getTime() < new Date(1970 - 1 - 1).getTime()
          )
        }
      },
      incomeId: null, // 回款id
      payCollInfoId: null, // 回款信息id
      contractNo: null, // 回款编号
      approvalUserId: [],
      ccUserId: [],
      batchNo: [], // 批次
      payCollType: '' // 判断是新增还是编辑回款
    }
  },
  components: {tranFer, approve},
  computed: {
      ...mapGetters({
        config: 'get_config'
      })
  },
  mounted() {
    this.payMethodOpt = this.filterDict(this.config, 'pay_method') // 付款方式
    this.payTypeOpt = this.filterDict(this.config, 'pay_type') // 付款类型
    this.offlineInvoiceStatusOpt = this.filterDict(this.config, 'offline_invoice_status') // 线下发票状态

    // 审批人、抄送人下拉框
    queryCurrStaff().then(res => {
      if (res.code === 200) {
        this.queryCurrStaff = res.data
      }
    })

    listMasterDeptContract().then(res => {
      if (res.code === 200) {
        this.contractNoOpt = res.data
      }
    }) 

    this.searchIncome()

  },
  methods: {
    // 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.searchIncome()
		},
    // 付款批次
    handleBatchNo(e) {
      if (this.batchNo.length > 0) {
        this.batchNo.forEach(item => {
          if (item.batchNo === e) {
            this.payCollInfoForm.payPrice = item.amount
          }
        })
      }
      this.payCollDataModal.forEach(item => {
        if (item.payBatch === this.payCollInfoForm.payBatch) {
          this.$Message.info('该批次已存在回款信息')
          this.addPayCollBtn = true // 禁用新增回款信息按钮
        } else {
          this.addPayCollBtn = false // 启用新增回款信息按钮
        }
      })
    },
    // 新增回款获取客户名称
    payCollModalBtn() {
      this.payCollTit = '新增回款' // 新增类型
      this.payCollType = 0 // 新增类型
      this.addPayCollForm = {}
      this.payCollDataModal = [] // 新增回款信息表格
      this.payCollModal = true
      // 客户名称
      getMasterDeptCustomer().then(res => {
        if (res.code === 200) {
          this.customerOpt = res.data
        }
      })
    },
    // 回显付款方式
    PayMethodValue(label) {
      this.payMethodOpt.filter(item => {
        if (item.label === label) {
          this.payCollInfoForm.payMethod = item.value
        }
      })
    },
    // 回显付款类型
    payTypeValue(label) {
      this.payTypeOpt.filter(item => {
        if (item.label === label) {
          this.payCollInfoForm.payType = item.value
        }
      })
    },
    // 回显开具发票状态
    offlineInvoiceStatusOptValue(label) {
      this.offlineInvoiceStatusOpt.filter(item => {
        if (item.label === label) {
          this.payCollInfoForm.offlineInvoiceStatus = item.value
        }
      })
    },
    // 新增回款信息
    handlePayCollInfoModal() {
      this.payCollInfoTit = '新增回款信息'
      this.payCollInfoType = 0
      this.payCollInfoForm = {}
      if(this.addPayCollForm.contractNo == null){
				this.$Message.error("请先选择客户和合同编号");
				return
			} else {
        this.payCollInfoModal = true
      }
    },
    // 编辑回款信息
    echoPayColl(params, index) {
      this.payCollInfoTit = '编辑回款信息'
      this.payCollInfoForm = params
      this.paramsInd = index
      this.payCollInfoModal = true
    },
    // 保存新增/修改的回款信息
    handleAddPayCollInfo(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.payCollInfoType === 0) {
            this.getEcho()
            this.payCollDataModal.push(this.payCollInfoForm)
            this.payCollInfoModal = false
          } else if (this.payCollInfoType === 1) {
            this.getEcho()
            this.payCollDataModal.splice(this.paramsInd, 1, this.payCollInfoForm)
            this.payCollInfoModal = false
          }
        }
      })
    },
    // 回显付款方式，付款类型，回款日期，线下发票状态
    getEcho() {
      this.payCollInfoForm.payTime  = this.formatDate(this.payCollInfoForm.payTime)
      this.payMethodOpt.filter(el => {
        if (this.payCollInfoForm.payMethod === el.value) {
          this.payCollInfoForm.payMethodName = el.label
        }
      })
      this.payTypeOpt.filter(el => {
        if (this.payCollInfoForm.payType === el.value) {
          this.payCollInfoForm.payTypeName = el.label
        }
      })
      this.offlineInvoiceStatusOpt.filter(el => {
        if (this.payCollInfoForm.offlineInvoiceStatus === el.value) {
          this.payCollInfoForm.offlineInvoiceStatusName = el.label
        }
      })
    },
    // 编辑回款列表
    getIncome(params) {
      console.log(params, '编辑回款列表')
      this.addPayCollForm = params // 客户名称，合同编号，合同所属人
      this.payCollDataModal = params.listIncomeDetail // 合同回款信息表格

      // this.contractNo = params.contractNo
      // this.incomeId = params.incomeId
      // this.payCollType = 1
      income(params.incomeId).then(res => {
        if (res.code === 200) {
          this.payCollModal = true
          this.addPayCollForm = res.data
          this.payCollDataModal = res.data.listIncomeDetail
        }
      })
    },
    // 批量删除回款
    handleRemove() {
      this.incomeDeleteFn(this.incomeId)
    },
    // 调用删除回款接口
    incomeDeleteFn(params) {
      incomeDelete(params).then(res => {
        if (res.code === 200) {
          this.searchIncome()
        }
      })
    },
    // 查询回款信息列表
    getListAdd() {
      listAdd({ invoiceNo: this.contractNo }).then(res => {
        if (res.code === 200) {
          this.payCollDataModal = res.rows
        }
      })
    },
    // 多选框选中数据
		selectChange(selection) {
      this.incomeId = selection.map(item => item.incomeId)
      this.removeIncomeBtn = false
			this.removeIncomeBtn = !selection.length
		},
    // 条件搜索回款列表
    handleSearchIncome() {
      this.searchIncome()
    },
    // 条件搜索接口
    searchIncome(){
      incomeList(this.paymentCollForm).then(res => {
        if (res.code === 200) {
          this.payCollData = res.rows
          this.payCollData.forEach(item => {
            item.listIncomeDetail.forEach(el => {
              item.payStatus = el.payStatus
            })
          })
          this.total = res.total
        }
      })
    },
    // 选择客户名称获取合同编号
    handleContract() {
      if (this.addPayCollForm.contractNo) {
        getContractByCustomerId(this.addPayCollForm.contractNo).then(res => {
          if (res.code === 200) {
            this.contractNoOpt = res.data
          }
        })
      }
      
      // 切换客户后，清空合同编号,合同所属人
      this.addPayCollForm.contractNo = ''
      this.addPayCollForm.contractBelong = ''
    },
    // 搜索条件选择合同编号获取合同所属人
    handleSearchContractNo(e){
      this.contractNoOpt.filter(item => {
        if (item.contractNo === e) {
          this.paymentCollForm.contractBelongName = item.contractBelongName
        }
      })
    },
    // 合同编号获取合同所属人、付款批次
    handleContractNo(e) {
      this.contractNoOpt.filter(item => {
        if (item.contractNo === e) {
          this.addPayCollForm.contractBelong = item.contractBelong
        }
      })
      // 获取付款批次
      this.contractNoOpt.forEach(item => {
        if (item.contractNo === e) {
          listBatchAmount( item.id ).then(res => {
            if (res.code === 200) {
              this.batchNo = res.data
            }
          })
        }
      })
      // 切换合同编号，清空回款信息列表
      this.payCollDataModal = []
      
    },
    // 新增、编辑回款
    handleAddPay(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = {} 
          //校验审批
          var roveInfo =  this.$refs.approve_ref.check_role();
          if (roveInfo !== -1) {
            if (this.payCollType === 1) { // 保存编辑的回款
              params = {
                listIncomeDetail: this.payCollDataModal,
                files: this.fileList,
                battleTemplate: this.addPayCollForm.battleTemplate,
                contractNo: this.addPayCollForm.contractNo,
                crmCustomerId: this.addPayCollForm.crmCustomerId,
                incomeId: this.incomeId,
                ccUserIds : roveInfo.ccUserIds,
                approvalUserIds : roveInfo.approvalUserIds,
                approvalTempId : roveInfo.approvalTempId,
                leaveMessage: roveInfo.leaveMessage
              }
              incomeEdit(params).then(res => {
                if (res.code === 200) {
                  roveInfo = {}
                  this.payCollModal = false
                  this.searchIncome()
                }
              })
            } else if(this.payCollType === 0){ // 保存新增的回款
              params = {
                listIncomeDetail: this.payCollDataModal,
                files: this.fileList,
                battleTemplate: this.addPayCollForm.battleTemplate,
                contractNo: this.addPayCollForm.contractNo,
                crmCustomerId: this.addPayCollForm.crmCustomerId,
                ccUserIds : roveInfo.ccUserIds,
                approvalUserIds : roveInfo.approvalUserIds,
                approvalTempId : roveInfo.approvalTempId,
                leaveMessage: roveInfo.leaveMessage
              }
              incomeAdd(params).then(res => {
                if (res.code === 200) {
                  this.payCollModal = false
                  this.searchIncome()
                  this.$Message.info('你的回款信息已提交至管理员审核')
                }
              })
            }
          } else {
            this.payCollModal = true
          }
        }
      })
    },
    // 导出
    handleExportFile() {
      let params = {
        contractBelongId: this.paymentCollForm.contractBelongId,
        contractNo: this.paymentCollForm.contractNo,
        createBy: this.paymentCollForm.createBy,
        customerId: this.paymentCollForm.customerId,
        endTime:  this.paymentCollForm.endTime,
        startTime:  this.paymentCollForm.startTime,
				pageNum: this.paymentCollForm.pageNum, 
				pageSize: this.paymentCollForm.pageSize
			}
			let fileName = this.$route.path.split('/').slice(-2)
			let url = '/crm/contract/income/export'
			this.axiosPost(url, params, fileName[0])
    },
    // 上传附件
    listenFile(data){
			this.fileList = data;
		},
    // 穿梭框开始
		openTran(){
			this.TranFlag = true
		},
		closeTran(){
			this.TranFlag = false
		},
    // 当前页面
		changePage(pages) {
			this.paymentCollForm.pageNum = pages
			this.searchIncome()
		},
		// 每页显示条数
		changePageSize(size) {
			this.paymentCollForm.pageSize = size
			this.searchIncome()
		},
  }
}
</script>
<style lang="scss" scoped>
</style>