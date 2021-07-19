<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="formInline" :label-width="100" >
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="核销人" :md="12" :lg="8" :xl="6" :xxl="6">
							<Input v-model='searchForm.preson'></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="开票日期" :md="12" :lg="8" :xl="6" :xxl="6">
							<DatePicker type="daterange"  ref="starttime" style="width: 100%"  @on-change="startTimeChange"></DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="发票号" :md="12" :lg="8" :xl="6" :xxl="6">
							<Input v-model="searchForm.custNo"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="核销时间" :md="12" :lg="8" :xl="6" :xxl="6">
							<DatePicker type="daterange"  ref="endtime"  style="width: 100%"  @on-change="endTimeChange" ></DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="票据类型" :md="12" :lg="8" :xl="6" :xxl="6">
							<Select  v-model="searchForm.ticType">
								<Option v-for="item in searchForm.ticTypeData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="账户号" :md="12" :lg="8" :xl="6" :xxl="6">
							<Input v-model="searchForm.cardNo"></Input>
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
			<Button type="primary" class="hxy-mr-20" @click="openHx"  :disabled="ids.length!=1">核销发票</Button>
			<Button type="warning" class="hxy-mr-20" @click="TranFlag=true">栏目标题</Button>
			<Button type="error" class="hxy-mr-20" @click="deleteDataAll">删除</Button>
			<!-- <Button type="primary" class="hxy-mr-20" @click="exportData">导出</Button> -->
		</div>
		
		
		<div class="hxy-mb-25">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange">
				<template slot-scope="{ row, index }" slot="file">
					<div v-if="row.files==''">暂无</div>
					<div v-if="row.files!=''">
						<div style="height: 15px;"></div>
						<div v-for="(item,num) in  row.files" :key="num" >
							{{index}}
						</div>
					</div>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" @on-change="changePage" @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
		</div>
		
		 
		
		<!-- 核销发票 -->
		<Modal v-model="m_hx_flag"  width = "720"  title="核销发票"   :footer-hide="true">
			<Form ref="f_ref_hx"  :model="hx_model"  :rules="hx_model_rule"  :label-width="100"  label-position="left">
				<FormItem label="发票号" :md="12" :lg="8" :xl="6" :xxl="6" prop="ticNo">
					<Input v-model="hx_model.ticNo" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="开票日期" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input   v-model="hx_model.dateTime" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="开票金额" :md="12" :lg="8" :xl="6" :xxl="6" >
					<Input type="number"  v-model="hx_model.price" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="票据类型" :md="12" :lg="8" :xl="6" :xxl="6">
					<Select  v-model="hx_model.ticType"  :label-in-value="true" style="width: 200px;" disabled>
						<Option  v-for="(val,index) in hx_model.ticTypeData" :value="val.value" :key="index">{{val.label}}</Option>
					</Select>
				</FormItem>
				<approve ref="approve_ref" :name="3"></approve>
			</Form>
			<modalBtn  sureText="确认核销" @sureBtn="sureBtn('f_ref_hx')" @cancleBtn="m_hx_flag=false"></modalBtn>
		</Modal>
		
		
		
		
		
		<!-- 详情 -->
		<Modal v-model="l_tic_sheet"  width = "600"  title="发票详情信息"   :footer-hide="true">
			<Form   :model="defaultModel"  :label-width="100"  label-position="left">
				<FormItem label="开户行" :md="12" :lg="8" :xl="6" :xxl="6" >
					<Input v-model="defaultModel.accountBank" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="账户名称" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input v-model="defaultModel.accountName" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="账户号" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input v-model="defaultModel.accountNo" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="核销人" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input v-model="defaultModel.cancelName" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="核销日期" :md="12" :lg="8" :xl="6" :xxl="6" >
					<Input v-model="defaultModel.cancelTime" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="开票日期" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input v-model="defaultModel.invoiceTime" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="开票内容" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input v-model="defaultModel.invoiceContent" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="票据类型" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input v-model="defaultModel.invoiceType" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="增值税率" :md="12" :lg="8" :xl="6" :xxl="6">
					<Input v-model="defaultModel.taxRate" style="width: 200px;" disabled></Input>
				</FormItem>
				<FormItem label="发票号" :md="12" :lg="8" :xl="6" :xxl="6" >
					<Input v-model="defaultModel.invoiceNo" style="width: 200px;" disabled></Input>
				</FormItem>
			</Form>
			<!-- <modalUpLoad upLoadText="发票凭证"  @listenFile="listenFile" ref="set_file_data"></modalUpLoad> -->
			<modalBtn sureText="关闭"  @sureBtn="l_tic_sheet=false" @cancleBtn="l_tic_sheet=false"></modalBtn>
		</Modal>
		
		
		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
	</div>
</template>

<script>
import approve from '_c/approve'
import { mapGetters } from 'vuex'
import { getTicList,deleteTic,cancleTic } from '_s/openTicket'
export default {
    data(){
        return{
			searchForm: {
				preson:"",		//核销人
				startTime:"",	//开票日期
				endTime	: "",
				custNo:"",		//发票号
				hxTime:"",		//核销时间
				ticType: "",	
				ticTypeData: [],//票据类型
				cardNo:"",		//账户号
				cancelStartTime : '',
				cancelEndTime   : '',
				pageNum : 1,
				pageSize: 10,
			},
			total: 0,
			ids	 : [],
			
			
			
			pageLoading : false,//页面loading动画
			taskListData: [],
			taskListTitle: [
				{
					type: 'selection',
					width: 60,
					key : '_disabled',
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					type:"index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '核销人',
					key: 'cancelName',
					align : "center",
					resizable: true,
					width: 200
				},
				{
					title: '核销日期',
					key: 'cancelTime',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '审批状态',
					key: 'hxState',
					resizable: true,
					align : "center",
					width: 300
				},
				{
					title: '开票日期',
					key: 'invoiceTime',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '开票内容',
					key: 'invoiceContent',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '票据类型',
					key: 'invoiceType',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '回款方式',
					key: 'payMethod',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '增值税率',
					key: 'taxRate',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '发票号',
					key: 'fph',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '开户行',
					key: 'accountBank',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '账户名称',
					key: 'accountName',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '账户号',
					key: 'accountNo',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '发票凭证',
					slot: 'file',
					align : "center",
					resizable: true,
					width: 150,
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
			
		
			//详情
			l_tic_sheet: false,
			defaultModel:{
				accountBank:"",
				accountName:"",
				accountNo:"",
				cancelName:"",
				cancelTime:"",
				invoiceTime:"",
				invoiceContent:"",
				invoiceType:"",
				taxRate:"",
				invoiceNo:"",
			},
			
			//以下是核销发票
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

			approveModel : {
				spData: [
					{value: 'bbh',label: 'bbh'},
				],
				spList: [],
				csData: [
					{value: '大专院校',label: '大专院校'},
					{value: '科研单位',label: '科研单位'},
					{value: '事业单位',label: '事业单位'},
					{value: '个人',label: '个人'},
				],
				csList : [],
				isFlag : "",
				inpLeave:""
			},

			
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
        }
    },
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
	},
	components:{
		approve  
	},
	created() {
		this.getTranList();
		
		//获取搜索的票据类型
		this.searchForm.ticTypeData = this.filterDict(this.config,'invoice_type');
		//获取核销发票弹窗里面的票据类型
		this.hx_model.ticTypeData = this.filterDict(this.config,'invoice_type');
	},
    mounted(){
		//列表数据
		this.getInit();
    },
    methods: {
		getInit(){
			const param = {
				updateName : this.searchForm.preson,				//核销人
				invoiceStartTime: this.searchForm.startTime,		//开票日期
				invoiceEndTime  : this.searchForm.endTime,	
				invoiceNo : this.searchForm.custNo,				//发票号
				cancelStartTime:this.searchForm.cancelStartTime,//核销时间
				cancelEndTime:this.searchForm.cancelEndTime,	//核销时间
				
				invoiceType : this.searchForm.ticType || '',	//票据类型
				accountNo  : this.searchForm.cardNo,			//账户号
				valid	   : 2,									//1发票记录2核销记录
				pageNum    : this.searchForm.pageNum,
				pageSize   : this.searchForm.pageSize,
			}
			console.log("param: " + JSON.stringify(param));
			getTicList(param).then(res=>{
				if(res.code==200){
					for (let i = 0; i < res.rows.length; i++) {
						if (res.rows[i].valid == 2 ) {			//已开票，不可勾选
							this.$set(res.rows[i],'_disabled',true)
						}else{
							this.$set(res.rows[i],'_disabled',false)
						}
					}
					this.taskListData = res.rows;
					this.total = res.total;
					this.ids   = [];
					this.searchForm.pageNum = 1;
				}
			})
		},
		
		
		
		
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.invoiceId)
			this.hx_changeData = selection[0];
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
		
		

		//弹窗确定
		sureBtn(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.hxApi()
				}
			})
		},
		//核销发票
		hxApi(){
			let _this = this;
			//校验审批
			var roveInfo =  this.$refs.approve_ref.check_role();
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
							_this.$Message.success("核销成功")
							_this.getInit();
						}
					})
				}
			});
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
			this.$Message.success('Success!');
		},
		//清空
		handleReset(){
			this.searchForm.preson = "";
			this.searchForm.startTime = "";
			this.searchForm.endTime = "";
			this.searchForm.cancelStartTime = "";
			this.searchForm.cancelEndTime = "";
			
			this.searchForm.custNo = "";
			this.searchForm.hxTime = "";
			this.searchForm.ticType = "";
			this.searchForm.cardNo = "";
			this.searchForm.pageNum = 1;
			this.searchForm.pageSize= 10;
			this.$refs.starttime.handleClear()
			this.$refs.endtime.handleClear()
			this.getInit();
		},
		//导出
		exportData(){
			const param = {
				updateBy : this.searchForm.preson,			//核销人
				invoiceTime: this.searchForm.startTime,		//开票日期
				invoiceNo : this.searchForm.custNo,			//发票号
				incomeStartTime:this.searchForm.cancelStartTime,//核销时间
				invoiceType : this.searchForm.ticType,			//票据类型
				accountNo  : this.searchForm.cardNo,			//账户号
				valid	   : 2,									//1发票记录2核销记录
				pageNum    : this.searchForm.pageNum,
				pageSize   : this.searchForm.pageSize,
			}
			this.axiosPost('/crm/contract/cancelInvoice/export',param,'核销开票表')
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
			console.log("this.ids: " + JSON.stringify(this.ids));
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
		lookDefault(data){
			this.l_tic_sheet = true;
			

			this.defaultModel.accountBank = data.accountBank;
			this.defaultModel.accountName= data.accountName;
			this.defaultModel.accountNo= data.accountNo;
			this.defaultModel.cancelName= data.accountBank;
			this.defaultModel.cancelTime= data.accountBank;
			this.defaultModel.invoiceTime= data.invoiceTime;
			this.defaultModel.invoiceContent= data.invoiceContent;
			this.defaultModel.invoiceType= data.invoiceType;
			this.defaultModel.taxRate= data.taxRate;
			this.defaultModel.invoiceNo= data.invoiceNo;
			this.$refs.set_file_data.changeData(data.files);
		},
		//获取上传附件的数据
		listenFile(data){
			this.fileList = data;
		},
		startTimeChange(refName) {
			this.searchForm.startTime = refName[0];
			this.searchForm.endTime = refName[1];
		},
		endTimeChange(refName) {
			this.searchForm.cancelStartTime = refName[0];
			this.searchForm.cancelEndTime = refName[1];
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
				if(item.key&&item.key!='_disabled'&&item.key!='action'){
					return item
				}
			})
			//不要显示的数据
			this.TranListNo = this.taskListTitle.filter((item)=>{
				if(!item.key||item.key=='_disabled'||item.key=='action'){
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