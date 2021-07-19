<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="formInline" :label-width="100" >
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="录入人" :md="12" :lg="8" :xl="6" :xxl="6">
							<Input v-model="searchForm.preson"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="合同编号" :md="12" :lg="8" :xl="6" :xxl="6">
							<Input v-model="searchForm.custNo"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客户名称" :md="12" :lg="8" :xl="6" :xxl="6">
							<Input v-model="searchForm.custName"></Input>
							<!-- <Select  v-model="searchForm.custName"  :label-in-value="true" style="width: 200px;">
								<Option  v-for="(val,index) in searchForm.custList" :value="val.id" :key="index">{{val.companyName}}</Option>
							</Select> -->
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="录入时间" :md="12" :lg="8" :xl="6" :xxl="6">
							<DatePicker   type="daterange" ref="starttime"  @on-change="startTimeChange" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="合同所属人" :md="12" :lg="8" :xl="6" :xxl="6">
							<Input v-model="searchForm.havePreson"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="回款日期" :md="12" :lg="8" :xl="6" :xxl="6">
							<DatePicker  type="daterange" ref="endtime"  @on-change="endTimeChange" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>
				</Row>
				<Col span="24" class="tr">
					<Button type="primary" @click="handleSearch()" icon="ios-search" class="hxy-mr-10">搜索</Button>
					<Button type="default" @click="handleReset()" icon="ios-refresh">清空</Button>
				</Col>
			</Form>
		</div>
		
		
		<div class="hxy-mb-30">
			<Button type="info" class="hxy-mr-20"    @click="openModal">新增开票</Button>
			<Button type="primary" class="hxy-mr-20" @click="openHx"  :disabled="ids.length!=1">核销发票</Button>
			<Button type="warning" class="hxy-mr-20" @click="TranFlag=true">栏目标题</Button>
			<Button type="error" class="hxy-mr-20" @click="deleteDataAll" :disabled="ids==''">删除</Button>
			<!-- <Button type="primary" class="hxy-mr-20" @click="exportData">导出</Button> -->
		</div>
		
		
		<div class="hxy-mb-25">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange">
				<template slot-scope="{row}" slot="file" >
					<lookFile :row='row.files'></lookFile>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" @on-change="changePage" @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
		</div>
		
		
		
		<!-- 新增开票 -->
		<Modal v-model="addBus"  width = "750"  title="新增开票"   :footer-hide="true">
			<Row class="hxy-mb-15" v-if="isLook">
				<Col :md="12" :lg="8" :xl="6" :xxl="6" >
					录入人 : {{nickname}}
				</Col>
			</Row>
			<Row class="hxy-mb-15" v-if="isLook">
				<Col :md="12" :lg="8" :xl="6" :xxl="6">
					录入日期 : {{nickTime}}
				</Col>
			</Row>
			<Form ref="addTic"  :model="addModel"  :rules="addRule"  :label-width="100"  label-position="left">
				<FormItem label="客户名称" :md="12" :lg="8" :xl="6" :xxl="6" prop="oneName">
					<Select  v-model="addModel.oneName"  :label-in-value="true" style="width: 200px;"  @on-change="secChangeDataOne">
						<Option  v-for="(val,index) in addModel.oneList" :value="val.id" :key="index">{{val.companyName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="合同编号" :md="12" :lg="8" :xl="6" :xxl="6" prop="towName">
					<Select  v-model="addModel.towName"    :label-in-value="true" style="width: 200px;" @on-change="secChangeDataTow" ref="resetSelectTow">
						<Option  v-for="(val,index) in addModel.towList" :value="val.id" :key="index">{{val.contractNo}}</Option>
					</Select>
				</FormItem>
				<FormItem label="合同所属人" :md="12" :lg="8" :xl="6" :xxl="6" >
					<div  style="width: 200px;">{{addModel.thrName}}</div>
				</FormItem>
				
				<div>
					<div  class="hxy-mb-20 hxy-mt-20">合同款项记录</div>
					<Table stripe border :columns="ticTitle" :data="ticData"  @on-selection-change="selectChangeTow"></Table>
				</div>
			
				<div class="addBZ isFlexCenter hxy-mt-30" @click="openTickerInfo"><span class="addBZRed">*</span>新增开票信息</div>
				<div class="hxy-mb-20 hxy-mt-20">
					<Table stripe border :columns="yewuTitle" :data="yewuData"  @on-selection-change="selectChange"></Table>
				</div>
				


				<modalUpLoad upLoadText="发票凭证"  ref="file_ref_one" @listenFile="listenFile" class="hxy-mb-20"></modalUpLoad>
				
				<!-- <FormItem label="抄送人" :md="12" :lg="8" :xl="6" :xxl="6" prop="code2222" class="hxy-mt-30">
					<Select  multiple style="width:260px;">
						<Option v-for="item in csRen" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<span class="hxy-ml-15">添加抄送人</span>
				</FormItem>
				
				<FormItem label="发送到群" :md="12" :lg="8" :xl="6" :xxl="6" prop="code2222">
					<Select multiple style="width:260px">
						<Option v-for="item in csRen" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<span class="hxy-ml-15">添加群</span>
				</FormItem> -->
				
				<approve ref="approve_ref_one" :name="2"></approve>
			</Form>
			<modalBtn @sureBtn="sureBtn('addTic')" @cancleBtn="addBus=false"></modalBtn>
		</Modal>
		
		
		
		
		<!-- 新增开票信息 -->
		<Modal v-model="addTicInfo"  width = "600"  title="新增开票信息"   :footer-hide="true">
			<Form ref="ffaddTicInfo"  :model="addTicModel"  :rules="addTicRule"  :label-width="100"  label-position="left">
				<FormItem label="开户行" :md="12" :lg="8" :xl="6" :xxl="6" prop="accountBank">
					<Input v-model="addTicModel.accountBank" style="width: 200px;"></Input>
				</FormItem>
				<FormItem label="账户名称" :md="12" :lg="8" :xl="6" :xxl="6" prop="accountName">
					<Input v-model="addTicModel.accountName" style="width: 200px;"></Input>
				</FormItem>
				<FormItem label="账户号" :md="12" :lg="8" :xl="6" :xxl="6" prop="accountNo">
					<Input v-model="addTicModel.accountNo" style="width: 200px;"></Input>
				</FormItem>
				<FormItem label="开票日期" :md="12" :lg="8" :xl="6" :xxl="6" prop="invoiceTime">
					<DatePicker type="date"   style="width: 200px" v-model="addTicModel.invoiceTime"  @on-change="invoTimeSec"></DatePicker>
				</FormItem>
				<FormItem label="开票金额" :md="12" :lg="8" :xl="6" :xxl="6" prop="invoiceMoney">
					<Input v-model="addTicModel.invoiceMoney" style="width: 200px;"></Input>
				</FormItem>
				<FormItem label="开票内容" :md="12" :lg="8" :xl="6" :xxl="6" prop="invoiceContent">
					<Input v-model="addTicModel.invoiceContent" style="width: 200px;"></Input>
				</FormItem>
				<FormItem label="票据类型" :md="12" :lg="8" :xl="6" :xxl="6" prop="invoiceType">
					<Select  v-model="addTicModel.invoiceType"  :label-in-value="true" style="width: 200px;">
						<Option  v-for="(val,index) in addTicModel.askTypeSel" :value="val.value" :key="index">{{val.label}}</Option>
					</Select>
				</FormItem>
				<FormItem label="增值税率" :md="12" :lg="8" :xl="6" :xxl="6" prop="taxRate">
					<Input v-model="addTicModel.taxRate" style="width: 200px;"></Input>
				</FormItem>
				<FormItem label="发票号" :md="12" :lg="8" :xl="6" :xxl="6" prop="invoiceNo">
					<Input v-model="addTicModel.invoiceNo" style="width: 200px;"></Input>
				</FormItem>
			</Form>
			<modalBtn  @sureBtn="sureBtn('ffaddTicInfo')" @cancleBtn="addTicInfo=false"></modalBtn>
		</Modal>
		
		
		
		<!-- 查看详情 -->
		<Modal v-model="deflag"  width = "750"  title="查看详情"   :footer-hide="true">
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="8" :xl="6" :xxl="6" >
					录入人 : {{nickname}}
				</Col>
			</Row>
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="12" :xl="12" :xxl="12">
					录入日期 : {{nickTime}}
				</Col>
			</Row>
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="12" :xl="12" :xxl="12">
					客户名称 : {{addModel.oneName}}
				</Col>
			</Row>
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="12" :xl="12" :xxl="12">
					合同编号 : {{addModel.towName}}
				</Col>
			</Row>
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="12" :xl="12" :xxl="12">
					合同所属人 : {{addModel.thrName}}
				</Col>
			</Row>
			<Table stripe border :columns="ticTitle" :data="ticData"  @on-selection-change="selectChangeTow"></Table>
			<div class="hxy-mt-20 hxy-mb-20">开票信息: </div>
			<Table class="hxy-mb-20" stripe border :columns="yewuTitle" :data="yewuData"></Table>
			<div class="hxy-mt-20 hxy-mb-20">发票凭证 : </div>
			<modalUpLoad upLoadText=""  ref="look_ref_file"></modalUpLoad>
			<modalBtn  sureText="关闭" @sureBtn="deflag=false" @cancleBtn="deflag=false"></modalBtn>
		</Modal>
		
		
		
		<!-- 核销发票 -->
		<Modal v-model="m_hx_flag"  width = "720"  title="核销发票"   :footer-hide="true">
			<Form ref="f_ref_hx"  :model="hx_model"  :rules="hx_model_rule"  :label-width="100"  label-position="left">
				<FormItem label="开票日期" :md="12" :lg="8" :xl="6" :xxl="6" prop="dateTime">
					<DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="hx_model.dateTime" disabled></DatePicker>
				</FormItem>
				<FormItem label="开票金额" :md="12" :lg="8" :xl="6" :xxl="6" prop="price">
					<Input type="number"  v-model="hx_model.price" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="票据类型" :md="12" :lg="8" :xl="6" :xxl="6" prop="ticType">
					<Select  v-model="hx_model.ticType"  :label-in-value="true" style="width: 200px;" disabled>
						<Option  v-for="(val,index) in hx_model.ticTypeData" :value="val.value" :key="index">{{val.label}}</Option>
					</Select>
				</FormItem>
				<FormItem label="发票号" :md="12" :lg="8" :xl="6" :xxl="6" prop="ticNo">
					<Input v-model="hx_model.ticNo" style="width: 200px;" disabled></Input>
				</FormItem>
				<approve ref="approve_ref_tow" :name="3"></approve>
			</Form>
			<modalBtn  sureText="确认核销" @sureBtn="sureBtn('f_ref_hx')" @cancleBtn="m_hx_flag=false"></modalBtn>
		</Modal>
		
		
		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
	
	</div>
</template>
<script>
import approve from '_c/approve'
import { getMasterDeptCustomer,contact } from '_s/customer'
import { getHetongNumTow,getHtTicList } from '_s/heTong'
import { addTicket,getTicList,deleteTic,lookMoreTic,cancleTic,basicCustomer } from '_s/openTicket'
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
	},
	components:{
		approve  
	},
    data(){
        return{
			searchForm: {
				startTime:"",
				endTime	 : "",
				havePreson:"",
				backTime:"",
				backEndTime:"",
				preson:"",
				custNo:"",
				custName: "",	//客户名称id,
				custList: [],	//客户名称
				heTong  : [],	//合同所属人
				pageNum : 1,
				pageSize: 10,
			},

		

			
			
			pageLoading : false,//页面loading动画
			isLook		: false,//是否查看详情，true为是
			nickname:"",
			nickTime:"",
			taskListData: [],
			taskListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					type : "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '录入人',
					key: 'createName',
					align : "center",
					resizable: true,
					width: 200
				},
				{
					title: '录入时间',
					key: 'createTime',
					resizable: true,
					align : "center",
					width: 280
				},
				{
					title: '客户名称',
					key: 'customerName',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '合同编号',
					key: 'contractNo',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '合同所属人',
					key: 'contractBelong',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '回款日期',
					key: 'payTime',
					align : "center",
					resizable: true,
					width: 250
				},
				{
					title: '回款金额',
					key: 'payPrice',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '回款方式',
					key: 'payMethod',
					align : "center",
					resizable: true,
					width: 120,
					render:(h,params)=>{
						return h('div',[
							h('span',{},params.row.payMethod || '-')
						])
					}
				},
				{
					title: '回款类型',
					key: 'payType',
					resizable: true,
					align : "center",
					width: 120
				},
				{
					title: '开票信息',
					key: 'invoiceContent',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '发票凭证',
					slot: 'file',
					align : "center",
					resizable: true,
					width: 350
				},

				
				{
					title:'操作',
					key:'action',
					width: 200,
					align : "center",
					fixed : "right",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.lookDefault(params.row)
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
										this.delData(params.row);
									}
								}
							}, '删除')
						])
					}
				}
			],
			total: 0,
			fileList:[],
			
			
			
			
			//以下是新增开票
			addBus  : false,
			addModel: {
				oneList:[],	//客户名称
				towList:[],	//合同编号
				thrList:[],	//合同所属人
				oneName: "",	//客户名称id
				towName:"",		//合同编号显示
				thrName:"",		//所属人显示
				htID   :"",		//合同编号参数
				
				
				code  : "",
				htPreson : ""
			},
			addRule: {
				oneName: [
					{ required: true, message: '客户名称', trigger: 'blur',type:"number" }
				],
				towName: [
					{ required: true, message: '请输入合同编号', trigger: 'blur',type:"number"}
				]
			},
			ticTitle : [
				{
					type: 'selection',
					width: 60,
					key : "_disabled",
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					type : "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '付款批次',
					key: 'payBatch',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '应付全额',
					key: 'needPayAmount',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '回款状态',
					key: 'payStatus',
					resizable: true,
					align : "center",
					width: 200
				},	
				
				{
					title: '付款方式',
					key: 'payMethod',
					resizable: true,
					align : "center",
					width: 150,
					render:(h,params)=>{
						return h('div',[
							h('span',{},
								params.row.payMethod || '-'
							)
						])
					}
				},
				{
					title: '回款类型',
					key: 'payType',
					resizable: true,
					align : "center",
					width: 120,
					render:(h,params)=>{
						return h('div',[
							h('span',{},
								params.row.payType || '-'
							)
						])
					}
				},	
				{
					title: '回款日期',
					key: 'payTime',
					resizable: true,
					align : "center",
					width: 200,
					render:(h,params)=>{
						return h('div',[
							h('span',{},
								params.row.payTime || '-'
							)
						])
					}
				},	
				{
					title: '回款金额',
					key: 'payPrice',
					resizable: true,
					align : "center",
					width: 200,
					render:(h,params)=>{
						return h('div',[
							h('span',{},
								params.row.payPrice || '-'
							)
						])
					}
				},	
				{
					title: '线下开票状态',
					key: 'offlineInvoiceStatus',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title: '发票号',
					key: 'invoiceNo',
					resizable: true,
					align : "center",
					width: 200,
					render:(h,params)=>{
						return h('div',[
							h('span',{},
								params.row.invoiceNo || '-'
							)
						])
					}
				}
			],
			ticData  : [],
			ticDataSend : [],		//选择的数据
			
			
			
			csRen   : [
				{value: 'bbh',label: 'bbh'},
			],
			
			
			
			//新增开票信息
			addTicInfo  : false,
			addTicModel : {
				accountBank:"",   //开户行
				accountName:"",   //账户名称
				accountNo  :"",	  //账户号
				invoiceTime:"",	  //开票日期
				invoiceContent:"",//开票内容
				invoiceMoney:"",  //开票金额
				invoiceType: "",  //票据类型
				askTypeSel : [],  //票据类型
				taxRate:"",		  //增值遂率
				invoiceNo:"",	  //发票号
			},
			addTicRule : {
				invoiceTime: [
					{ required: true, message: '请选择开票日期', trigger: 'change' }
				],
				invoiceMoney: [
					{ required: true, message: '请输入开票金额', trigger: 'blur' }
				],
				invoiceContent: [
					{ required: true, message: '请输入开票内容', trigger: 'blur' }
				],
				invoiceType: [
					{ required: true, message: '请选择票据类型', trigger: 'blur' }
				],
				taxRate: [
					{ required: true, message: '请输入增值税率', trigger: 'blur' }
				],
				invoiceNo: [
					{ required: true, message: '请输入发票号', trigger: 'blur' }
				],
				accountBank: [
					{ required: true, message: '请输入开户行', trigger: 'blur' }
				],
				accountName: [
					{ required: true, message: '请输入账户名称', trigger: 'blur' }
				],
				accountNo: [
					{ required: true, message: '请输入账户号', trigger: 'blur' }
				],
			},
			
			
			
			
			//开票信息列表
			yewuTitle : [
				{
					title: '序号',
					type : "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '开票日期',
					key: 'invoiceTime',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '开票金额',
					key: 'invoiceMoney',
					resizable: true,
					align : "center",
					width: 120
				},
				{
					title: '开票内容',
					key: 'invoiceContent',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '票据类型',
					key: 'invoiceType',
					resizable: true,
					align : "center",
					width: 200
				},	
				
				
				{
					title: '增值税率',
					key: 'taxRate',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '发票号',
					key: 'invoiceNo',
					resizable: true,
					align : "center",
					width: 200
				},	
				
				{
					title: '开户行',
					key: 'accountBank',
					resizable: true,
					align : "center",
					width: 120
				},	
				{
					title: '账户名称',
					key: 'accountName',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title: '账户号',
					key: 'accountNo',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title:'操作',
					key:'action',
					width: 130,
					align : "center",
					fixed : "right",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										if(this.addBus){
											this.delTicInfo(params.row)
										}
									}
								}
							}, '删除')
						])
					}
				}
			],
			yewuData  : [],
			
			
			//查看详情
			deflag : false,
			ids	   : [],
			
			
			//核销发票
			m_hx_flag: false,
			hx_changeData:{},
			hx_model:{
				dateTime : "",
				price    : "",
				ticType  : "",
				ticTypeData:[],
				ticNo    : "",
			},
			hx_model_rule : {
				dateTime: [
					{ required: true, message: '请选择开票日期', trigger: 'change',type:"date" }
				],
				price: [
					{ required: true, message: '请输入开票金额', trigger: 'blur'}
				],
				ticType: [
					{ required: true, message: '请选择开票类型', trigger: 'change' }
				],
				ticNo: [
					{ required: true, message: '请输入发票号', trigger: 'blur' }
				],
			},
			isAgain : true,
			
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
        }
    },
	created() {
		this.addTicModel.askTypeSel = this.filterDict(this.config,'invoice_type');
		this.hx_model.ticTypeData = this.filterDict(this.config,'invoice_type');
		this.getTranList();
	},
    mounted(){
		//列表数据
		this.getInit();
		//获取客户下啦数据
		this.getCustList()
		
    },
    methods: {
		getInit(){
			const param = {
				contractBelongName : this.searchForm.havePreson,	//合同所属人
				contractNo : this.searchForm.custNo,		//合同编号
				createName : this.searchForm.preson,		//录入人
				companyName : this.searchForm.custName,		//客户名称
				incomeStartTime:this.searchForm.backTime,		//回款日期
				incomeEndTime  : this.searchForm.backEndTime,	//回款结束时间
				
				startTime  : this.searchForm.startTime,		//录入开始时间
				endTime  : this.searchForm.endTime,		//录入结束时间	
				valid	   : "1",		//1发票记录2核销记录
				pageNum    : this.searchForm.pageNum,
				pageSize   : this.searchForm.pageSize,
			}
			console.log("param: " + JSON.stringify(param));
			getTicList(param).then(res=>{
				if(res.code==200){
					this.taskListData = res.rows;
					this.ids = [];
					this.searchForm.pageNum = 1;
					this.total = res.total;
				}
			})
		},
		//获取客户名称下拉数据
		getCustList(){
			getMasterDeptCustomer({}).then(res=>{
				this.addModel.oneList = res.data;
				this.searchForm.custList = res.data;
			})
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
		//合同编号下拉事件
		secChangeDataTow(e){
			if(e){
				for(var i=0;i<this.addModel.towList.length;i++){
					var temp = this.addModel.towList[i];
					if(temp.id==e.value){
						this.addModel.thrName = temp.contractBelong;
						this.addModel.htID = temp.contractNo;
						break
					}
				}
				this.setTableOne(e);
			}else{
				this.addModel.thrName = "";
				this.addModel.htID  = "";
			}
		},
		//获取下方表格数据
		setTableOne(e){
			this.ticData = [];
			const param = {
				contractNo   : e.label
			}
			getHtTicList(param).then(res=>{
				console.log("res: " + JSON.stringify(res));
				if(res.code==200){
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].crmInvoiceId == 0 ) {			//未开票，可以勾选
							this.$set(res.data[i],'_disabled',false)
						}else{
							this.$set(res.data[i],'_disabled',true)
						}
					}
					this.ticData = res.data;
				}
			})
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.invoiceId)
			this.hx_changeData = selection[0];
		},
		//合同所属人下放的表格
		selectChangeTow(selection){
			this.ticDataSend = selection.map(item => item.id);
		},
		//核销按钮
		openHx(){
			this.$refs.f_ref_hx.resetFields();
			//回填核销数据
			this.hx_model.dateTime = this.hx_changeData.invoiceTime;
			this.hx_model.price = this.hx_changeData.invoiceMoney.toString();
			this.hx_model.ticType = this.hx_changeData.invoiceType;
			this.hx_model.ticNo = this.hx_changeData.invoiceNo;
			this.m_hx_flag = true;
		},
		//按钮新增开票
		openModal(){
			this.addBus = true;
			this.ticData = [];
			this.yewuData= [];
			this.$refs.addTic.resetFields();
			this.$refs.file_ref_one.changeData([]);
			this.fileList = [];
		},

		// 底部翻页选择
		changePage(pages) {
			this.searchForm.pageNum = pages;
			this.getInit();
		},
		changePageSize(size) {
			this.searchForm.pageSize = size;
			this.getInit();
		},
		
		//搜索
		handleSearch(){
			this.getInit();
			this.$Message.success('搜索中...');
		},
		//清空
		handleReset(){
			this.searchForm.havePreson = "";
			this.searchForm.custNo = "";
			this.searchForm.preson = "";
			this.searchForm.custName = "";
			this.searchForm.backTime = "";
			this.searchForm.backEndTime = "";
			this.searchForm.startTime = "";
			this.searchForm.endTime = "";
			this.searchForm.pageNum = 1;
			this.searchForm.pageSize= 10;
			this.$refs.starttime.handleClear()
			this.$refs.endtime.handleClear()
			this.getInit();
		},
		//导出
		exportData(){
			const param = {
				// contractBelongId : this.searchForm.havePreson,	//合同所属人
				// contractNo : this.searchForm.custNo,			//合同编号
				// createBy   : this.searchForm.preson,			//录入人
				// customerId : this.searchForm.custName,			//客户名称
				// incomeStartTime:this.searchForm.backTime,		//回款日期
				// startTime  : this.searchForm.startTime,			//录入开始时间
				// valid	   : "1",								//1发票记录2核销记录
			}
			this.axiosPost('/crm/contract/invoice/export',param,'合同开票表')
		},
		startTimeChange(refName) {
			this.searchForm.startTime = refName[0];
			this.searchForm.endTime = refName[1];
		},
		endTimeChange(refName) {
			this.searchForm.backTime = refName[0];
			this.searchForm.backEndTime = refName[1];
		},
		//开票日期
		invoTimeSec(e){
			this.addTicModel.invoiceTime = e;
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
		//删除信息
		delTicInfo(data){
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					_this.yewuData.splice(data._index,1);
				}
			});
		},
		lookDefault(data){
			lookMoreTic(data.invoiceId).then(res=>{
				this.nickname = res.data.createName;
				this.nickTime = res.data.createTime;
				this.addModel.oneName = res.data.customerName;
				this.addModel.towName = res.data.contractNo;
				this.addModel.thrName = res.data.contractBelong;
				this.yewuData = res.data.listInvoice;
				this.$refs.look_ref_file.changeData(res.data.files);
				var param = {
					label : data.contractNo
				}
				this.setTableOne(param);
				this.deflag = true;
			})
		},
		//获取上传附件的数据
		listenFile(data){
			this.fileList = data;
		},
		
		//删除单个
		delData(data){
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					deleteTic([data.invoiceId]).then(res=>{
						if(res.code==200){
							this.$Message.success('Success!');
							_this.getInit();
						}
					})
				}
			});
		},
		//删除多个
		deleteDataAll(){
			if(this.ids==''){
				this.$Message.error('请选择要删除的数据！');
				return
			}
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					deleteTic(_this.ids).then(res=>{
						if(res.code==200){
							this.$Message.success('Success!');
							_this.getInit();
						}
					})
				}
			});
		},
		
		sureBtn(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(name=="addTic"){
						this.addTicApi();
					}else if(name=="ffaddTicInfo"){
						this.addticInfo()
					}else if(name=='f_ref_hx'){
						this.hxApi()
					}
				}
			})
		},
		//新增开票
		addTicApi(){
			if(this.yewuData==''){
				this.$Message.error('请先增加开票信息！');
				return
			}
			if(this.ticDataSend.length!=1){
				this.$Message.error('请选择一条未开票的合同款项记录！');
				return
			}
			this.yewuData.forEach((item)=>{
				this.$set(item,'incomeDetailId',this.ticDataSend[0])
			})
			//校验审批
			var roveInfo =  this.$refs.approve_ref_one.check_role();
			if(roveInfo==-1){
				return
			}
			if(this.isAgain){
				this.isAgain = false
				const _this = this;
				const param = {
					contractNo  : this.addModel.htID,				//合同编号
					crmCustomerId  : this.addModel.oneName,	//客户id
					files  : this.fileList,				//文件列表
					listInvoice  : this.yewuData,	//开票信息
					ccUserIds : roveInfo.ccUserIds,
					approvalUserIds : roveInfo.approvalUserIds,
					approvalTempId : roveInfo.approvalTempId,
					leaveMessage:roveInfo.leaveMessage
				}
				addTicket(param).then(res=>{ 
					if(res.code==200){
						_this.getInit();
						this.$Message.success("开票成功，请等待审批!")
						this.addBus = false;
						setTimeout(()=>{
							this.isAgain = true
						},1000)
					}
				}).catch(error=>{
					setTimeout(()=>{
						this.isAgain = true
					},1000)
				})
			}
		},
		//新增开票信息（不走接口）
		addticInfo(){
			var obj = {
				accountBank:this.addTicModel.accountBank,			//开户行
				accountName:this.addTicModel.accountName, 		 //账户名称
				accountNo  :this.addTicModel.accountNo,	  		//账户号
				invoiceTime:this.addTicModel.invoiceTime,	  //开票日期
				invoiceContent:this.addTicModel.invoiceContent,//开票内容
				invoiceMoney:this.addTicModel.invoiceMoney, //开票金额
				invoiceType:this.addTicModel.invoiceType,  //票据类型
				taxRate:this.addTicModel.taxRate,		  //增值遂率
				invoiceNo:this.addTicModel.invoiceNo	  //发票号
			}
			if(this.isAgain){
				this.isAgain = false
				this.yewuData.push(obj);
				this.addTicInfo = false;
				setTimeout(()=>{
					this.isAgain = true
				},1000)
			}
		},
		//核销发票
		hxApi(){
			let _this = this;
			//校验审批
			var roveInfo =  this.$refs.approve_ref_tow.check_role();
			if(roveInfo==-1){
				return
			}
			this.$Modal.confirm({
				title: "确定核销当前发票吗？",
				cancelText : "取消",
				onOk(){
					const param = {
						invoiceId : _this.hx_changeData.invoiceId,
						ccUserIds : roveInfo.ccUserIds,
						approvalUserIds : roveInfo.approvalUserIds,
						approvalTempId : roveInfo.approvalTempId,
						leaveMessage:roveInfo.leaveMessage
					}
					cancleTic(param).then(res=>{
						if(res.code==200){
							_this.m_hx_flag = false;
							_this.$Message.success("你的核销任务已提交审核")
							_this.getInit();
						}
					})
				}
			});
		},
		
		
		
		
		
		
		
		
		// 以下是穿梭框逻辑
		openTran(){
			this.TranFlag = true
		},
		closeTran(){
			this.TranFlag = false
		},
		refresh(e){
			//把选择框，序号，操作详情的数据，合并当前要显示的模块
			this.taskListTitle = this.TranListNo.concat(e);
		},
		getTranList(){
			//显示要的数据
			this.TranList = this.taskListTitle.filter((item)=>{
				if(item.key&&item.key!='id'&&item.key!='action'){
					return item
				}
			})
			//不要显示的数据
			this.TranListNo = this.taskListTitle.filter((item)=>{
				if(!item.key||item.key=='id'||item.key=='action'){
					return item
				}
			})
		}
    }
}
</script>
<style lang="scss" scoped>
	.ivu-form-item-label{
		text-align: left !important;
	}
	.loadImg{
		width: 40px;
		height: 40px;
	}
	.addBZ{
		border-radius: 4px;
		height: 36px;
		width: 110px;
		background-color: #2D8CF0;
		color: white;
		cursor: pointer;
		.addBZRed{
			color: red;
			font-size: 20px;
		}
	}
	.guigeBox{
		padding: 16px;
		box-sizing: border-box;
		border: 1px solid #eee;
		border-radius: 4px;
		background: #F5F2F0;
		.guigeList{
			border: 1px solid #eee;
			border-radius: 4px;
			padding:12px 8px;
			background: white;
			box-sizing: border-box;
		}
	}
	
	.priceHead{
		text-align: center;
		.xh{
			width: 100px;
		}
		.level{
			width:200px;
		}
		.priceInp{
			
		}
	}
	
	
	.addBZ{
		border-radius: 4px;
		height: 36px;
		width: 110px;
		background-color: #2D8CF0;
		color: white;
		cursor: pointer;
		.addBZRed{
			color: red;
			font-size: 20px;
		}
	}
</style>