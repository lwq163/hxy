<template>
    <div>
		  <tab-menu></tab-menu>
      <div>
        <Form ref='collectInvoRef' :model="invoiceForm" :label-width="80">
          <Row>
            <Col :md="12" :lg="8" :xl="6" :xxl="6">
              <FormItem label="合同编号" prop="contractNo">
                <Input v-model="invoiceForm.contractNo" clearable/>
              </FormItem>
            </Col>
            <Col :md="12" :lg="8" :xl="6" :xxl="6">
              <FormItem label="回款类型" prop="payType">
                <Select clearable v-model="invoiceForm.payType">
                    <Option v-for="(item,index) in incomeType" :key="index" :value="item.value"> 
                        {{item.label}}    
                    </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="12" :lg="8" :xl="6" :xxl="6">
              <FormItem label="回款方式" prop="payMethod">
                <Select clearable v-model="invoiceForm.payMethod">
                    <Option v-for="(item,index) in incomeMethod" :key="index" :value="item.value">
                        {{item.label}}    
                    </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="12" :lg="8" :xl="6" :xxl="6">
              <FormItem label="开始日期" prop="startTime">
                <DatePicker 
                    type="date"
                    v-model="invoiceForm.startTime"
                    placeholder="" 
                    :editable="false" 
                    placement="bottom-start"
                    format="yyyy-MM-dd"
                    clearable>
                </DatePicker>
              </FormItem>
            </Col>
            <Col :md="12" :lg="8" :xl="6" :xxl="6">
              <FormItem label="结束日期" prop="endTime">
                <DatePicker 
                    type="date"
                    v-model="invoiceForm.endTime"
                    placeholder="" 
                    :editable="false" 
                    placement="bottom-start"
                    format="yyyy-MM-dd"
                    clearable>
                </DatePicker>
              </FormItem>
            </Col>
            <Col :md="8" :lg="8" :xl="6" :xxl="6">
              <Button type="primary" icon="ios-search" class="hxy-ml-30 hxy-mr-10" @click="handleInvoiceList">搜索</Button>
              <Button type="default" @click="handleReset('collectInvoRef')" icon="ios-refresh">清空</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="hxy-mt-20">
        <Button class="hxy-mr-10" type="primary" ghost @click="payCollModalBtn">新增回款</Button>
        <Button class="hxy-mr-10" @click="applyInvo">申请开票</Button>
        <Button class="hxy-mr-10" @click="openModal">开票</Button>
        <Button class="hxy-mr-10" @click="invoiceOpenModal">主动开票</Button>
        <Button class="hxy-mr-10" :disabled="disabledBtn" @click="invoCancel">发票作废</Button>
      </div>

      <div class="hxy-mt-20">
        <Table stripe border :columns="invoiceTitle" :data="invoiceData"  @on-selection-change="selectIncomeInvoiceChange"></Table>
      </div>
      <div class="hxy-mt-20 tr">
        <Page :total="total" :page-size="invoiceForm.pageSize" :current="invoiceForm.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
      </div>

      <!-- 新增回款 -->
      <Modal :title="payCollTit" :width="720" :mask-closable="false" v-model="payCollModal">
        <div slot="footer">
          <Button @click="payCollModal = false">取消</Button>
          <Button type="primary" class="btn-warning" @click="handlePayCollSave('addPayColl')">保存</Button>
        </div>
        <Form ref="addPayColl" :label-width="80" :model="addPayCollForm" :rules="addPayCollRules" >
          <FormItem label="合同编号" prop="contractNo">
            <Select placeholder="请选择合同编号"  v-model="addPayCollForm.contractNo" clearable :disabled='payCollDisabled' @on-change='handleListAdd'>
                <Option v-for="(item,index) in contractNo" :key="index" :value="item.contractNo">{{item.contractNo}}</Option>
            </Select>
          </FormItem>
        
          <FormItem label="回款批次" prop="payBatch">
            <Select  placeholder="请选择回款批次"  v-model="addPayCollForm.payBatch" clearable :disabled='payCollDisabled' @on-change='handlePayPrice'>
                <Option v-for="(item,index) in payBatch" :key="index" :value="item.payBatch">{{item.payBatch}}</Option>
            </Select>
          </FormItem>
        
          <FormItem label="回款金额" prop="payPrice">
            <Input v-model="addPayCollForm.payPrice" disabled clearable/>
          </FormItem>
           
          <FormItem label="回款方式" prop="payMethod">
            <Select  placeholder="请选择回款方式"  v-model="addPayCollForm.payMethod" clearable :disabled='payCollDisabled'>
                <Option v-for="(item,index) in incomeMethod" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>

          <FormItem label="回款类型" prop="payType">
            <Select clearable v-model="addPayCollForm.payType">
                <Option v-for="(item,index) in incomeType" :key="index" :value="item.value"> 
                    {{item.label}}    
                </Option>
            </Select>
          </FormItem>

          <FormItem label="回款日期" prop="payTime">
            <DatePicker 
                type="date"
                v-model="addPayCollForm.payTime"
                placeholder="" 
                :editable="false" 
                placement="bottom-start"
                format="yyyy-MM-dd"
                clearable>
            </DatePicker>
          </FormItem>
          <!-- <Button v-show="!payCollDisabled" @click="handlePayCollInfoModal">新增回款信息</Button> -->
          <!-- <FormItem prop="payCollDataModal"> -->
          <!-- <Table border class="hxy-mb-15 hxy-mt-15" ref="payCollTableModal" :columns="payCollDataTitle" :data="payCollDataModal"></Table> -->
          <!-- </FormItem> -->
          
          <!-- <FormItem prop="listenFile"> -->
            
          <!-- </FormItem> -->

          <FormItem label="生成战报" :md="12" :lg="8" :xl="6" :xxl="6" prop="battleTemplate" class="hxy-mt-30">
            <Select  placeholder="请选择"  v-model="addPayCollForm.battleTemplate" clearable :disabled='payCollDisabled'>
                <Option v-for="(item,index) in battleTemplateOpt" :key="index" :value="item.label">{{item.label}}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label=""  prop="code2222" class="hxy-mt-30"> -->
            <modalUpLoad v-show="!payCollDisabled" upLoadText="附件" @listenFile="listenFile" ref="fileOne"></modalUpLoad>
          <!-- </FormItem> -->
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
          <!-- <approve ref="approve_ref" :name="1"></approve> -->
        </Form>
      </Modal>

      <!-- 申请开票 -->
      <Modal v-model="applyAddBus"  width = "750"  title="申请开票">
        <div slot="footer">
          <Button @click="applyAddBus = false">取消</Button>
          <Button type="primary" class="btn-warning" @click="handleAddBusSave('addTic')">保存</Button>
        </div>
        <Form ref="addTic"  :model="addModel"  :rules="addRule"  :label-width="100"  label-position="left">
          <FormItem label="合同编号" :md="12" :lg="8" :xl="6" :xxl="6" prop="contractNo">
            <Input v-model="addModel.contractNo"  @on-change='handleListUnInvoice'></Input>
          </FormItem>
          <FormItem label="回款状态" prop="yewuData">
              <Table stripe border :columns="yewuTitle" :data="yewuData"  @on-selection-change="selectChange"></Table>
          </FormItem>
          <FormItem label="开户行" prop="accountBank">
            <Input v-model="addModel.accountBank" clearable/>
          </FormItem>
          <FormItem label="账户名称" prop="accountName">
            <Input v-model="addModel.accountName" clearable/>
          </FormItem>
          <FormItem label="账户号" prop="accountNo">
            <Input type="number" v-model="addModel.accountNo" clearable/>
          </FormItem>
          <!-- <FormItem label="开票日期" prop="invoiceTime">
            <DatePicker
                type="date"
                v-model="addModel.invoiceTime"
                placeholder="" 
                :editable="false" 
                placement="bottom-start"
                format="yyyy-MM-dd"
                clearable>
            </DatePicker>
          </FormItem> -->
          <FormItem label="开票金额" prop="invoiceMoney">
            <Input type="number" v-model="addModel.invoiceMoney" clearable disabled/>
          </FormItem>
          <FormItem label="开票内容" prop="invoiceContent">
            <Input v-model="addModel.invoiceContent" clearable/>
          </FormItem>
          <FormItem label="票据类型" prop="invoiceType">
            <Select  v-model="addModel.invoiceType"  :label-in-value="true" ref="resetSelectTow">
              <Option  v-for="(val,index) in invoiceType" :value="val.value" :key="index">{{val.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>

      <!-- 开票、主动开票 -->
      <Modal v-model="listApplyInvoiceModelBus"  width = "750"  :title="invoiceTit">
        <div slot="footer">
          <Button @click="listApplyInvoiceModelBus = false">取消</Button>
          <Button type="primary" class="btn-warning" @click="handleListApplyInvoiceModelSave('listApplyInvoiceModelTic')">保存</Button>
        </div>
        <Form ref="listApplyInvoiceModelTic"  :model="listApplyInvoiceModel"  :rules="listApplyInvoiceModelRule"  :label-width="100"  label-position="left">
          <FormItem label="合同编号" :md="12" :lg="8" :xl="6" :xxl="6" prop="towName">
            <Input v-model="listApplyInvoiceModel.contractNo"  @on-change='handleListApplyInvoice'></Input>
          </FormItem>
          <FormItem label="回款状态">
              <Table stripe border :columns="listApplyInvoiceTitle" :data="listApplyInvoiceData"  @on-selection-change="selectListApplyInvoiceChange"></Table>
          </FormItem>
          <FormItem label="开户行" prop="accountBank">
            <Input v-model="listApplyInvoiceModel.accountBank" clearable />
          </FormItem>
          <FormItem label="账户名称" prop="accountName">
            <Input v-model="listApplyInvoiceModel.accountName" clearable />
          </FormItem>
          <FormItem label="账户号" prop="accountNo">
            <Input v-model="listApplyInvoiceModel.accountNo" clearable type="number" />
          </FormItem>
          <FormItem label="开票日期" prop="invoiceTime">
            <DatePicker
                type="date"
                v-model="listApplyInvoiceModel.invoiceTime"
                placeholder="" 
                :editable="false" 
                placement="bottom-start"
                format="yyyy-MM-dd"
                clearable>
            </DatePicker>
          </FormItem>
          <FormItem label="开票金额" prop="invoiceMoney">
            <Input v-model="listApplyInvoiceModel.invoiceMoney" clearable type="number" disabled/>
          </FormItem>
          <FormItem label="开票内容" prop="invoiceContent">
            <Input v-model="listApplyInvoiceModel.invoiceContent" clearable />
          </FormItem>
          <FormItem label="票据类型" prop="invoiceType">
            <Select  v-model="listApplyInvoiceModel.invoiceType"  :label-in-value="true" ref="resetSelectTow">
              <Option  v-for="(val,index) in invoiceType" :value="val.value" :key="index">{{val.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="增值税率" prop="taxRate">
            <Input type='number' v-model="listApplyInvoiceModel.taxRate" clearable />
          </FormItem>
          <FormItem label="发票号" prop='invoiceNo'>
            <Input v-model="listApplyInvoiceModel.invoiceNo" clearable />
          </FormItem>
          <modalUpLoad upLoadText="发票凭证"  ref="file_ref_one" @listenFile="listenFile" class="hxy-mb-20"></modalUpLoad>
        </Form>
      </Modal>

      <!-- 发票作废 -->
      <Modal v-model="invoCancelBus"  width = "750"  title="作废确认">
        <div slot="footer">
          <Button @click="invoCancelBus = false">取消</Button>
          <Button type="primary" class="btn-warning" @click="invoCancelSave('addPayColl')">保存</Button>
        </div>
        <Form :label-width="80" :model="invoiceCancelMod">
          <FormItem label="发票作废">
            <Input v-model="invoiceCancelMod.cancelReason" />
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
import {  mapGetters } from 'vuex'
import { listUnIncomeContract, listAdd, add, list, listUnInvoice, apply, listApplyInvoice, invoiceAdd, invoiceCancel } from '_s/collectInvoice'

export default {
  data() {
    return {
      invoiceTit: '',
      invoiceType: null, // 0开票，1主动开票
      disabledBtn: true,
      total: 0,
      invoiceForm: {
        pageSize: 10,
        pageNum: 1,
        payType: '1',
        payMethod: '1',
      },
      billStatus: [],
      invoiceTitle: [
      {
        type: 'selection',
        width: 60,
      },{
        title: '序号',
        resizable: true,
        width: 80,
        render:(h,params)=>{
          return h("span" ,{},params.index+1)
        }
      },{
        title: '合同编号',
        key: 'contractNo',
        resizable: true,
        width: 250
      },{
        title: '合同创建人',
        key: 'contractBelong',
        resizable: true,
        width: 250
      },{
        title: '回款状态',
        key: 'payStatusName',
        resizable: true,
        width: 250
      },{
        title: '开票状态',
        key: 'invoiceStatus',
        resizable: true,
        width: 250
      },{
        title: '回款批次',
        key: 'payBatch',
        resizable: true,
        width: 250
      },{
        title: '回款金额',
        key: 'payPrice',
        resizable: true,
        width: 250
      },{
        title: '回款方式',
        key: 'payMethodName',
        resizable: true,
        width: 250
      },{
        title: '回款类型',
        key: 'payTypeName',
        resizable: true,
        width: 250
      },{
        title: '回款日期',
        key: 'invoiceTime',
        resizable: true,
        width: 250
      },{
        title: '回款附件',
        key: 'invoiceTime',
        resizable: true,
        width: 250,
        render: (h, params) => {
              return h('div', [
                  h('Button', {
                      props: {
                          type: 'text',
                          size: 'small'
                      },
                      on: {
                          click: () => {
                              this.labelData.splice(params.index, 1)
                              this.getTag()
                          }
                      }
                  }, '详情'),
                  h('Button', {
                      props: {
                          type: 'text',
                          size: 'small'
                      },
                      on: {
                          click: () => {
                              this.labelData.splice(params.index, 1)
                              this.getTag()
                          }
                      }
                  }, '下载')
              ])
          }
      },{
        title: '开户行',
        key: 'accountBank',
        resizable: true,
        width: 250
      },{
        title: '账户名称',
        key: 'accountName',
        resizable: true,
        width: 250
      },{
        title: '账户号',
        key: 'accountNo',
        resizable: true,
        width: 250
      },{
        title: '开票日期',
        key: 'invoiceTime',
        resizable: true,
        width: 250
      },{
        title: '开票金额',
        key: 'invoiceMoney',
        resizable: true,
        width: 250
      },{
        title: '开票内容',
        key: 'invoiceContent',
        resizable: true,
        width: 250
      },{
        title: '票据类型',
        key: 'invoiceType',
        resizable: true,
        width: 250
      },{
        title: '增值税率',
        key: 'taxRate',
        resizable: true,
        width: 250
      },{
        title: '发票号',
        key: 'invoiceNo',
        resizable: true,
        width: 250
      },{
        title: '发票附件',
        key: 'invoiceTime',
        resizable: true,
        width: 250,
        render: (h, params) => {
              return h('div', [
                  h('Button', {
                      props: {
                          type: 'text',
                          size: 'small'
                      },
                      on: {
                          click: () => {
                              this.labelData.splice(params.index, 1)
                              this.getTag()
                          }
                      }
                  }, '详情'),
                  h('Button', {
                      props: {
                          type: 'text',
                          size: 'small'
                      },
                      on: {
                          click: () => {
                              this.labelData.splice(params.index, 1)
                              this.getTag()
                          }
                      }
                  }, '下载')
              ])
          }
      },{
          title: '操作',
          width: 180,
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
                              this.labelData.splice(params.index, 1)
                              this.getTag()
                          }
                      }
                  }, '战报下载')
              ])
          }
      }],
      invoiceData: [],
      contractNo: [],
      payBatch: [],
      // 新增回款
      payCollTit: '', // 新增回款弹框标题
      payCollModal: false,
      addPayCollForm: {},
      addPayCollRules: {
        crmCustomerId: [{required: true,message: '此项不能为空', trigger: 'change'}],
        contractNo: [{required: true,message: '此项不能为空', trigger: 'change'}],
        // contractBelong: [{required: true,message: '此项不能为空', trigger: 'change'}],
        // payCollDataModal: [{required: true,message: '此项不能为空', trigger: 'change'}],
        // listenFile: [{required: true,message: '此项不能为空', trigger: 'change'}],
      },
      payCollDisabled: false,
      customerOpt: [],
      contractNoOpt: [],
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

      // 申请开票
      applyAddBus: false,
      unInvoice: [],
      ids: [],

      // 开票
      listApplyInvoiceModelBus: false,
      listApplyInvoiceModel: {
        type: '1',
        invoiceMoney: null
      },
      listApplyInvoiceModelRule: {
        contractNo: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
				accountBank: [{ required: true, message: '请输入开户行', trigger: 'change' }],
				accountName: [{ required: true, message: '请输入账号名称', trigger: 'change' }],
				accountNo: [{ required: true, message: '请输入账户号', trigger: 'change'}],
        invoiceTime: [{ required: true, message: '请输入账户号', trigger: 'change', type: 'data'}],
        invoiceContent: [{ required: true, message: '请输入账户号', trigger: 'change'}],
        invoiceType: [{ required: true, message: '请输入账户号', trigger: 'change'}],
        taxRate: [{ required: true, message: '请输入账户号', trigger: 'change'}],
        invoiceNo: [{ required: true, message: '请输入账户号', trigger: 'change'}],
      },
      listApplyInvoiceTitle : [
        {
          type: 'selection',
          width: 60,
        },
				{
					title: '序号',
					type : "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '回款状态',
					key: 'payStatus',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '回款批次',
					key: 'payBatch',
					resizable: true,
					align : "center",
					width: 120
				},
				{
					title: '回款金额',
					key: 'payPrice',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '回款方式',
					key: 'payMethodName',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title: '回款类型',
					key: 'payTypeName',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '回款日期',
					key: 'payTime',
					resizable: true,
					align : "center",
					width: 200
			}],
      listApplyInvoiceData: [],
      invoiceIds: [],

      // 新增开票
			addBus: false,
      ticData: [],
      yewuData: [],
      fileList: [],
      addModel: {
        type: '0',
        invoiceMoney: null
      },
      addRule: {
				contractNo: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
				accountBank: [{ required: true, message: '请输入开户行', trigger: 'change' }],
				accountName: [{ required: true, message: '请输入账号名称', trigger: 'change' }],
				accountNo: [{ required: true, message: '请输入账户号', trigger: 'change'}],
			},
      yewuTitle : [
        {
          type: 'selection',
          width: 60,
        },
				{
					title: '序号',
					type : "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '回款状态',
					key: 'payStatus',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '回款批次',
					key: 'payBatch',
					resizable: true,
					align : "center",
					width: 120
				},
				{
					title: '回款金额',
					key: 'payPrice',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '回款方式',
					key: 'payMethodName',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title: '回款类型',
					key: 'payTypeName',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '回款日期',
					key: 'payTime',
					resizable: true,
					align : "center",
					width: 200
			}],
			yewuData  : [],
			ticDataSend : [],		//选择的数据

      // 发票作废
      invoCancelBus: false,
      invoiceType: [],
      invoiceCancelMod: {}
    }
  },
  computed: {
    ...mapGetters({
			config: 'get_config'
		})
  },
  mounted() {
    this.incomeMethod = this.filterDict(this.config, 'income_method') // 回款方式
    this.incomeType = this.filterDict(this.config, 'income_type') // 回款类型
    this.invoiceType = this.filterDict(this.config, 'invoice_type') // 票据类型
    
    // 获取未回款的合同编号
    listUnIncomeContract().then(res => {
      if (res.code === 200) {
        this.contractNo = res.data
      }
    })

    this.getList()
  },
  methods: {
    // 多选回款/开票列表
    selectIncomeInvoiceChange(selection) {
      this.invoiceCancelMod.invoiceIds = selection.map(item => item.invoiceId) // 发票作废id
      this.disabledBtn = !selection.length
    },
    // 发票作废
    invoCancel() {
      this.invoiceCancelMod.cancelReason = ''
      this.invoCancelBus = true
    },
    // 确定作废发票
    invoCancelSave() {
      invoiceCancel(this.invoiceCancelMod).then(res => {
        if (res.code === 200) {
          this.getList()
          this.invoCancelBus = false
        }
      })
    },
    // 开票获取回款状态列表
    handleListApplyInvoice() {
      if (this.invoiceType === 1) { // 主动开票
        if (this.listApplyInvoiceModel.contractNo) {
          listUnInvoice({ contractNo: this.listApplyInvoiceModel.contractNo }).then(res => {
            if (res.code === 200) {
              this.listApplyInvoiceData = res.data
              this.listApplyInvoiceModel.accountBank  =  res.data[0].accountBank ?  res.data[0].accountBank : '' // 开户行
              this.listApplyInvoiceModel.accountName = res.data[0].accountName ?  res.data[0].accountName : '' // 账户名称
              this.listApplyInvoiceModel.accountNo =  res.data[0].accountNo ?  res.data[0].accountNo : '' // 账户号
            }
          })
        }
      } else if (this.invoiceType === 0) { // 开票
        if (this.listApplyInvoiceModel.contractNo) {
          listApplyInvoice({ contractNo: this.listApplyInvoiceModel.contractNo }).then(res => {
            if (res.code === 200) {
              this.listApplyInvoiceData = res.data
              this.listApplyInvoiceModel.accountBank  =  res.data[0].accountBank ?  res.data[0].accountBank : '' // 开户行
              this.listApplyInvoiceModel.accountName = res.data[0].accountName ?  res.data[0].accountName : '' // 账户名称
              this.listApplyInvoiceModel.accountNo =  res.data[0].accountNo ?  res.data[0].accountNo : '' // 账户号
            }
          })
        }
      }
    },
    // 开票多选
    selectListApplyInvoiceChange(selection) {
      if (this.invoiceType === 0) { // 开票
        this.invoiceIds = selection.map(item => item.invoiceId)
      } else if (this.invoiceType === 1) { // 主动开票
        this.invoiceIds = selection.map(item => item.id)
      }
      selection.forEach(item => {
        this.listApplyInvoiceModel.invoiceMoney += item.payPrice
      })
    },
    // 开票，主动开票保存
    handleListApplyInvoiceModelSave() {
      this.listApplyInvoiceModel.ids = this.invoiceIds
      invoiceAdd(this.listApplyInvoiceModel).then(res => {
        if (res.code === 200) {
          this.getList()
          this.listApplyInvoiceModelBus = false
        }
      })
    },
    // 申请开票获取已申请回款状态列表
    handleListUnInvoice() {
      if (this.addModel.contractNo) {
        listUnInvoice({ contractNo: this.addModel.contractNo }).then(res => {
          if (res.code === 200) {
            this.yewuData = res.data
            this.addModel.accountBank  =  res.data[0].accountBank ?  res.data[0].accountBank : '' // 开户行
            this.addModel.accountName = res.data[0].accountName ?  res.data[0].accountName : '' // 账户名称
            this.addModel.accountNo =  res.data[0].accountNo ?  res.data[0].accountNo : '' // 账户号
          }
        })
      }
    },
    // 申请开票回款状态多选框
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
      // 勾选合同状态，计算开票金额
      selection.forEach(item => {
        this.addModel.invoiceMoney += item.payPrice
      })
		},
    // 保存申请开票
    handleAddBusSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.addModel.ids = this.ids
          apply(this.addModel).then(res => {
            if (res.code === 200) {
              console.log(res.data, '申请开票')
              this.getList()
              this.applyAddBus = false
            }
          })
        }
      })
    },
    // 获取合同回款列表
    getList() {
      list(this.invoiceForm).then(res => {
        if (res.code === 200) {
          this.invoiceData = res.rows
        }
      })
    },
    // 合同编号获取回款批次
    handleListAdd() {
      listAdd({ contractNo: this.addPayCollForm.contractNo }).then(res => {
        if (res.code === 200) {
          this.payBatch = res.data
        }
      })
    },
    // 回款批次获取回款金额
    handlePayPrice(e) {
      this.payBatch.filter(item => item.payBatch === e ? this.addPayCollForm.payPrice = item.payPrice : '')
    },
    // 保存新增的回款
    handlePayCollSave() {
      this.addPayCollForm.payTime = this.formatDate(this.addPayCollForm.payTime)
      add(this.addPayCollForm).then(res => {
        if (res.code === 200) {
          this.getList()
          this.payCollModal = false
        }
      })
    },
    // 条件搜索回款/签约
    handleInvoiceList() {
      this.getList()
    },
    // 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
		},
    // 当前页面
		changePage(pages) {
			this.invoiceForm.pageNum = pages
			// this.handleApplyBillList()
		},
		// 每页显示条数
		changePageSize(size) {
			this.invoiceForm.pageSize = size
			// this.handleApplyBillList()
		},
    // 上传附件
    listenFile(data){
			this.fileList = data;
		},
    // 新增回款获取客户名称
    payCollModalBtn() {
      this.payCollTit = '新增回款' // 新增类型
      this.payCollType = 0 // 新增类型
      this.addPayCollForm = {}
      this.payCollDataModal = [] // 新增回款信息表格
      this.payCollModal = true
      // 客户名称
      // getMasterDeptCustomer().then(res => {
      //   if (res.code === 200) {
      //     this.customerOpt = res.data
      //   }
      // })
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
    // 申请开票
    applyInvo() {
      this.applyAddBus = true
    },
    // 开票弹框
		openModal(){
      this.invoiceTit = '开票'
      this.invoiceType = 0
      this.listApplyInvoiceModel = {}
      this.listApplyInvoiceData = []
			this.listApplyInvoiceModelBus = true;
		},
    // 主动开票弹框
    invoiceOpenModal() {
      this.invoiceTit = '主动开票'
      this.invoiceType = 1
      this.listApplyInvoiceModel = {}
      this.listApplyInvoiceData = []
			this.listApplyInvoiceModelBus = true;
    },
    //打开新增信息
		openTickerInfo(){
			if(this.addModel.oneName==''){
				this.$Message.error("请先选择客户");
				return
			}
			console.log("this.addModel.oneName: " + JSON.stringify(this.addModel.oneName));
			basicCustomer(this.addModel.oneName).then(res=>{
				console.log("res: " + JSON.stringify(res));
				this.$refs.ffaddTicInfo.resetFields();
				this.addTicModel.accountBank = res.data.accountBank;   //开户行
				this.addTicModel.accountName = res.data.accountName;   //账户名称
				this.addTicModel.accountNo = res.data.accountNumber;   //账户号
			})
			this.addTicInfo = true;
		},
    
		//合同所属人下放的表格
		selectChangeTow(selection){
			this.ticDataSend = selection.map(item => item.id);
		},
    //客户名称下拉事件
		secChangeDataOne(e){
			//清楚数据
			this.addModel.towList = [];
			this.addModel.towName = "";
			this.addModel.thrName = "";
			this.addModel.htID = "";
			this.ticData = [];
			this.$refs['resetSelectTow'].clearSingleSelect()
			if(e){
				//重新获取数据
				getHetongNumTow(e.value).then(res=>{
					this.addModel.towList = res.data;
				})
			}
		},
  }
}
</script>
<style lang="scss" scoped>
	
</style>