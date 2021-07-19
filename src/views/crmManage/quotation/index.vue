<template>
    <div class="quotation">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="受理单编号" prop="applyBillCode">
                            <Input type="text" v-model="searchForm.applyBillCode" placeholder="请输入受理单编号"></Input>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="报价方式" prop="quotationMethod">
							<Select v-model="searchForm.quotationMethod" placeholder="请选择" clearable>
								<Option v-for="(item,index) in quoMethodData" :value="item.value" :key="index">{{item.label}}</Option>
							</Select>
						</FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <FormItem label="审批状态" prop="approveStatus">
							<Select v-model="searchForm.approveStatus" clearable placeholder="请选择" >
								<Option v-for="(val,index) in appStatusData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <FormItem label="报价时间" prop="createTime">
					        <DatePicker
								style="width: 100%"
								type="date"
								v-model="searchForm.createTime" 
								placeholder="报价时间" 
								@on-change="change_offer_time"
								clearable>
							</DatePicker>
					    </FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <FormItem label="付款方式" prop="payMethod">
							<Select v-model="searchForm.payMethod" placeholder="请选择"  :clearable="true">
								<Option v-for="(val,index) in payMethodData" :value="val.id" :key="index">{{val.name}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <Button type="primary" @click="handleSearch()"  icon="ios-search" class="hxy-ml-30 hxy-mr-10">搜索</Button>
						<Button type="default" @click="handleReset()"   icon="ios-refresh">清空</Button>
					</Col>
				</Row>
			</Form>
		</div>
        <div class="hxy-mb-25">
			<Button type="primary"  class="hxy-mr-10" @click="openQuotationDialog">新增报价</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="quotationListTitle" :data="quotationListData" >
				<template slot-scope="{row}" slot="file_one" >
					<lookFile :row='row.quotationFileList'></lookFile>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="pageInfo.total" :page-size="pageInfo.pageSize" :current="pageInfo.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>
        <!-- 新增报价 -->
		<Modal
            :title="title"
            v-model="quotationDialog"
            :width="1000"
			:z-index="1000"
			:mask-closable="false"
			>
			<div class="isMenban" v-if="isLook"></div>
            <Form :model="quotationForm" ref="quotationForm_ref" :rules="rulesQuotation" label-position="left" :label-width="100">
				<Row :gutter="20">
					<Col span="12" v-if="isAddOrEdit">
						<FormItem label="受理单ID" prop="applyBillId">
							<Select
								ref="serch_bill"
								:filterable="true" 
								:clearable="true" 
								:remote = "true"
								v-model="quotationForm.applyBillId"
								:remote-method="onBlur_applyBillId"
								@on-change="onChangeBill"
								@on-clear="onClearBill"
								placeholder="请输入">
								<Option v-for="item in BillIdData" :value="item.id" :key="item.id" style="width: 80px">{{item.applyBillCode}}</Option>
							</Select>
						</FormItem> 
					</Col>
					<Col span="12" v-if="!isAddOrEdit">
						<FormItem label="受理单ID" prop="applyBillId">
							{{quotationForm.applyBillCode}}
						</FormItem> 
					</Col>
					<Col span="12" >
						<FormItem    :label-width="0" prop="quotaionOrder">
							报价次序 ： {{quotationForm.quotaionOrder}}
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="20">
					<Col span="24" >
						<FormItem label="产品及服务" prop="serviceInsertDtoList">
							<div  v-if="!isLook"><Button type="primary" class="hxy-mb-15" @click="open_pro_ser_sheet">增加产品及服务</Button></div>
							<Table stripe border :columns="pro_ser_title" :data="quotationForm.serviceInsertDtoList" >s
							</Table>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="20" style="padding-left: 100px;">
					<Col span="6" >
						<FormItem label="合同报价（元）: " prop="quotaionAmount"   :label-width="120">
							{{quotationForm.quotaionAmount}}
						</FormItem>
					</Col>
					<Col span="6" >
						<FormItem label="产品数量 :" prop="productCount">
							{{quotationForm.productCount}}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="报价方式" prop="quotaionMethod"> 
							<Select v-model="quotationForm.quotaionMethod" placeholder="请选择" clearable>
								<Option v-for="(item,index) in quoMethodData" :value="item.value" :key="index">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="付款方式" prop="payMethod">
							<Select v-model="quotationForm.payMethod" placeholder="请选择付款方式"  :clearable="true"  @on-change="selPayMent"  :label-in-value="true">
								<Option v-for="(val,index) in payMethodData" :value="val.id" :key="index">{{val.name}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<div v-for="(obj,index) in quotationForm.payTimeList" :key="index">
					<Row v-if="index==0">
						<Col span="20">
							<FormItem  :label-width="0" style="padding-left:100px;">
								<div class="isFlexalitem" style="width: 100%;">
									<div style="width: 380px;">第一期付款比例 {{obj.payProportion}}  <span class="hxy-mr-15 hxy-ml-15"> 付款金额(元) :  {{obj.payAmount||'-'}} </span> <span style="color: red;">* </span>付款时间 : </div>
									<DatePicker 
										type="date"
										v-model="obj.payTime"
										@on-change="selectPayTime($event,index)"
										placeholder="第一期付款时间" 
										style="width:40%">
									</DatePicker>
								</div>
							</FormItem>
						</Col>
						<!-- <Col span="5" class="hxy-ml-20">
							<FormItem    label="付款金额(元) :"  :label-width="100">
								<Input placeholder="请输入" type="number" v-model="obj.payAmount"></Input>
							</FormItem>
						</Col> -->
					</Row>
					<Row v-if="index==1">
						<Col span="20">
							<FormItem  :label-width="0" style="padding-left:100px;">
								<div class="isFlexalitem" style="width: 100%;">
									<div style="width: 380px;">第二期付款比例 {{obj.payProportion}}  <span class="hxy-mr-15 hxy-ml-15"> 付款金额(元) :  {{obj.payAmount||'-'}} </span> <span style="color: red;">* </span>付款时间 : </div>
									<DatePicker 
										type="date"
										v-model="obj.payTime"
										@on-change="selectPayTime($event,index)"
										placeholder="第二期付款时间" 
										style="width:40%">
									</DatePicker>
								</div>
							</FormItem>
						</Col>
					</Row>
					<Row v-if="index==2">
						<Col span="20">
							<FormItem  :label-width="0" style="padding-left:100px;">
								<div class="isFlexalitem" style="width: 100%;">
									<div style="width: 380px;">第三期付款比例 {{obj.payProportion}}  <span class="hxy-mr-15 hxy-ml-15"> 付款金额(元) :  {{obj.payAmount||'-'}} </span> <span style="color: red;">* </span>付款时间 : </div>
									<DatePicker 
										type="date"
										v-model="obj.payTime"
										@on-change="selectPayTime($event,index)"
										placeholder="第三期付款时间" 
										style="width:40%">
									</DatePicker>
								</div>
							</FormItem>
						</Col>
					</Row>
				</div>
				<Row>
					<Col span="12">
						<FormItem label="备注" prop="remark">
							<Input type="textarea" :maxlength="500" show-word-limit  placeholder="请输入"  v-model="quotationForm.remark"></Input>
						</FormItem>
					</Col>
				</Row>
				<modalUpLoad   v-show="!isLook" upLoadText="添加附件" @listenFile="listenFile" ref="file_ref"></modalUpLoad>
				<div class="hxy-mt-20" v-if="!isLook"><approve ref="approve_ref" :name="8"></approve></div>
            </Form>
			<div slot="footer">
                <Button type="default" @click="quotationDialog=false">取消</Button>
                <Button type="primary" @click="handleSubmit">确定</Button>
            </div>
        </Modal>

		<!-- 增加产品及服务 -->
		<Modal
            :title="pro_isAddOrEdit?'增加产品及服务':'编辑产品及服务'"
            v-model="pro_ser_sheet"
            :width="650"
			:z-index="1001"
			:mask-closable="false">
			<Form :model="bussnessForm" ref="bussnessForm_ref" :rules="rulesBussness" label-position="left" :label-width="100">
				<Row v-show="pro_isAddOrEdit">
					<Col span="12">
						<FormItem label="产品名称" prop="serviceId">
							<Select v-model="bussnessForm.serviceId" @on-change="selOne"  :label-in-value="true" >
								<Option :value="item.id" v-for="(item,index) in productOnlineList" :key="index">{{item.productName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品数量" prop="serviceCount" >
							<Input type="number" v-model="bussnessForm.serviceCount" placeholder="请输入产品数量"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品单价" prop="unitPrice">
							<Input type="number" v-model="bussnessForm.unitPrice" placeholder="请输入产品单价"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="联系人" prop="contactId">
							<Select v-model="bussnessForm.contactId"  @on-change="selTow"  :label-in-value="true">
								<Option :value="item.id" v-for="(item,index) in contactData" :key="index">{{item.contactName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="跟单人" prop="followId">
							<Select v-model="bussnessForm.followId"  @on-change="selThr"  :label-in-value="true">
								<Option :value="item.userId" v-for="(item,index) in followData" :key="index">{{item.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
                <Button type="default" @click="pro_ser_sheet=false">取消</Button>
                <Button type="primary" @click="bussnessSubmit">确定</Button>
            </div>
		</Modal>
	
    </div>
</template>
<script>
import approve from '_c/approve'
import { getInp_biil_id} from '_s/followUp'
import { paymentList } from '_s/product'
import { queryCurrStaff } from "_s/customer"
import { getCrmTemp } from "_s/approval"
import { getProductList,addOffer,listOffer,defaultOffer,deleteOffer,editOffer,getPrudctOnline,getContactList,getAllUser } from '_s/offerPrice'
import { mapGetters} from 'vuex'
export default {
	computed : {
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
				applyBillCode : "",	//受理单编号
				approveStatus : "",	//审批状态
				createTime	  : "",	//报价时间
				payMethod	  : "",	//付款方式
				quotationMethod :"",//报价方式
			},
			pageInfo : {
				total   : 0,
				pageNum : 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			//公共的下拉选择数据
			quoMethodData  	: [],			//报价方式
			appStatusData	: [],			//审批状态
			payMethodData	: [],			//付款方式
			BillIdData		: [],			//受理单关键字搜索数据
			productOnlineList: [],			//在线产品
			contactData		: [],			//联系人数据
			followData		: [],			//跟单人数据
			//新增报价
			title	: "",
			isAddOrEdit:true,
			isLook : false,
			quotationDialog: false,
			quotationForm: {
				applyBillCode : "",			//受理单编号
				applyBillId   : "",			//受理单id
				payMethod	  : "",			//付款方式
				payTimeList   : [],			//付款时间集合
				productCount  : 0,			//产品数量
				quotaionAmount: 0,			//报价总额
				quotaionMethod: "",			//报价方式
				quotaionOrder : "",			//报价次序
				remark		  : "",			//备注
				serviceInsertDtoList : [],	//产品及服务
				quotationFileList:[]		//附件
			},
			rulesQuotation: {
				applyBillId: [
					{ required: true, message: '请输入受理单ID', trigger: 'change',type:"number" }
				],
				quotaionMethod: [
					{ required: true, message: '请选择报价方式', trigger: 'change'}
				],
				payMethod: [
					{ required: true, message: '请选择付款方式', trigger: 'change',type:"number" }
				],
				serviceInsertDtoList : [
					{ required: true, message: '请添加产品及服务信息', trigger: 'change',type:"array" }
				]
			},
			//产品及服务列表
			pro_isAddOrEdit:true,
			pro_Cindex    : 0,
			pro_customerId: "",
			pro_ser_sheet : false,
			pro_ser_title : [
				{
					title: '序号',
					type : "index",
					resizable: true,
					width: 80,
					align: 'center'
				},
				{
					title: '产品及服务',
					key: 'serviceName',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '产品数量',
					key: 'serviceCount',
					// slot: 'serviceCount',
					resizable: true,
					width: 120,
					align: 'center'
				},
				{
					title: '产品单价(默认标价)',
					key: 'unitPrice',
					resizable: true,
					width: 110,
					align: 'center'
				},
				{
					title: '联系人',
					key: 'contactName',
					resizable: true,
					width: 120,
					align: 'center'
				},
				{
					title: '跟单人',
					key: 'followName',
					resizable: true,
					width: 120,
					align: 'center'
				},
				{
					title: '操作',
					key: 'offerRemark',
					resizable: true,
					align: 'center',
					render:(h,params)=>{
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style : {
									display : this.isLook?'none':"inline-block"
								},
								on: {
									click: () => {
										this.proEdit(params.row)
									}
								}
							}, "编辑"),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style:{
									'margin-left': '10px',
									display : this.isLook?'none':"inline-block"
								},
								on: {
									click: () => {
										this.proDel(params.row)
									}
								}
							}, "删除"),
						])
					}
				},
			],
			//产品与服务弹窗
			bussnessForm: {
				contactId : "",		//联系人id
				followId  : "",		//跟单人id
				serviceCount :"",	//产品数量
				serviceId : "",		//产品服务id
				unitPrice : "",		//产品单价
				serviceName : "",	
				contactName : "",
				followName  : ""
			},
			rulesBussness:{
				serviceId: [
					{ required: true, message: '请选择产品名称', trigger: 'change',type:"number" }
				],
				serviceCount: [
					{ required: true, message: '请输入产品数量', trigger: 'change' }
				],
				unitPrice: [
					{ required: true, message: '请输入产品单价', trigger: 'change' }
				],
				contactId: [
					{ required: true, message: '请选择联系人', trigger: 'change',type:"number"  }
				],
				followId: [
					{ required: true, message: '请选择跟单人', trigger: 'change',type:"number" }
				]
			},
			//列表
			quotationDialogTow : false,
			quotationListData: [],
			quotationListTitle: [
				{
					title: '序号',
					type : "index",
					resizable: true,
					width: 80,
					align: 'center'
				},
				{
					title: '报价单编号',
					key: 'quotaionCode',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '受理单编号',
					key: 'applyBillCode',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '报价次序',
					key: 'quotaionOrder',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '客户名称',
					key: 'customerName',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '跟单人',
					key: 'followName',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '报价人',
					key: 'createByName',
					resizable: true,
					width: 180,
					align: 'center'
				},
				{
					title: '报价时间',
					key: 'createTime',
					resizable: true,
					width: 170,
					align: 'center'
				},
				{
					title: '报价方式',
					key: 'quotaionMethodCh',
					resizable: true,
					width: 180,
					align: 'center'
				},
				{
					title: '付款方式',
					key: 'payMethodCh',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '总金额(元)',
					key: 'quotaionAmount',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '备注',
					key: 'remark',
					resizable: true,
					width: 200,
					align: 'center',
					render:(h,params)=>{
						return h('div', [
							h('span', {
								props: {
									type: 'primary',
									size: 'small'
								},
							}, params.row.remark || '-'),
						])
					}
				},
				{
					title: '附件',
					slot : 'file_one',
					key : "quotationFileList",
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '审批状态',
					key: 'approveStatusCh',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
			                        color: '#2d8cf0',
									display: params.row.approveStatus==1?"none":"inline-block"
			                    },
								on: {
									click: () => {
										this.isLook = false;
										this.title = "编辑报价信息"
										this.toEdit(params.row)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
			                        color: '#2d8cf0'
			                    },
								on: {
									click: () => {
										this.isLook = true;
										this.title = "报价详情"
										this.toEdit(params.row)
									}
								}
							}, '详情')
						])
					}
				}
			]
		}
	},
	created() {
		this.quoMethodData = this.filterDict(this.config,'offer_way');			//报价方式
		this.appStatusData = this.filterDict(this.config,'crm_approval_status');//审批状态
		this.getPayMent();	//付款方式
	},
	mounted(){
		this.getQuotationList()	//列表数据
		//审批人数据
		this.initApprove();
	},
	methods: {
		async initApprove(){
			queryCurrStaff().then(res => {
				this.$refs['approve_ref'].setData_mount(res.data);
			})
			await getCrmTemp({ formName: 8 }).then(res => {
				if (res.code === 200) {
					this.$refs['approve_ref'].setData_init(res);
				}
			})
		},
		//获取付款方式
		getPayMent(){
			paymentList({}).then(res=>{
				if(res.code==200){
					this.payMethodData = res.rows;
					console.log("this.payMethodData : " + JSON.stringify(this.payMethodData ));
				}
			})
		},
		//在线产品
		getPrudctOnlineData(id){
			getPrudctOnline(id).then(res=>{
				this.productOnlineList = res.data;
			})
		},
		//受理单输入关键字列表
		onBlur_applyBillId(query){
			if(query!==''){
				getInp_biil_id(query).then(res=>{
					this.BillIdData = res.data;
				})
			}else{
				this.$refs['serch_bill'].setQuery("");
				this.BillIdData = [];
				this.productOnlineList = [];
			}
		},
		onChangeBill(e){
			if(!e){
				return
			}
			this.onClearBill();
			var str = this.BillIdData.filter((item)=>{
				if(item.id == e){
					return item
				} 
			})
			getProductList(str[0].id).then(res=>{
				this.quotationForm.quotaionOrder = res.data.quotaionOrder;
				this.pro_customerId = res.data.customerId;
				if(res.data.billServiceBaseList!=''&&res.data.billServiceBaseList){
					for(let i=0;i<res.data.billServiceBaseList.length;i++){
						let temp = res.data.billServiceBaseList[i];
						var obj = {
							contactId : temp.contactId,
							followId  : temp.followId,
							serviceCount : "",
							serviceId : temp.serviceId,
							unitPrice : temp.unitPrice+"",
							serviceName : temp.serviceName,
							contactName : temp.contactName,
							followName  : temp.followName
						}
						this.quotationForm.serviceInsertDtoList.push(obj);
					}
					this.setTotal();
				}
			})
			this.getPrudctOnlineData(str[0].customerId);
		},
		onClearBill(){
			this.productOnlineList = [];
			this.quotationForm.serviceInsertDtoList = [];
			this.quotationForm.quotaionOrder = "";
			this.pro_customerId  = "";
		},
		//获取上传附件的数据
		listenFile(data,unType){
			this.quotationForm.quotationFileList = data;
		},
		// 打开新增报价弹框
		openQuotationDialog() {
			this.title = '新增报价';
			this.$refs['quotationForm_ref'].resetFields();
			this.quotationForm.payTimeList = [];
			this.productOnlineList = [];
			this.quotationDialog = true;
			this.isAddOrEdit = true;  
			this.isLook = false;
			this.quotationForm.quotationFileList = [];
			this.$refs.file_ref.changeData([]);
			this.$refs.approve_ref.clearData()
		},
		//打开---增加产品与服务开关
		open_pro_ser_sheet(){
			this.pro_isAddOrEdit = true;
			if(this.isAddOrEdit){
				this.setSheetData();
			}else{
				this.pro_ser_sheet = true;
				this.$refs['bussnessForm_ref'].resetFields(); 
			}
		},
		setSheetData(){
			this.contactData = [];	//联系人数据
			this.followData  = [];	//跟单人数据
		
			if(this.pro_customerId){
				getContactList(this.pro_customerId).then(res=>{		 //联系人
					this.contactData = res.data; 	
				})
				getAllUser({}).then(res=>{
					this.followData = res.data; //跟单人
				})
			}
			this.pro_ser_sheet = true;
			this.$refs['bussnessForm_ref'].resetFields(); 
		},
		//产品数量输入绑定
		setCountData(e, index, type){
			this.quotationForm.serviceInsertDtoList[index][type] = e.target.value;
			this.setTotal();
		},
		selOne(e){
			if(!e){
				return
			}
			console.log("valu: " + JSON.stringify(e));
			var str = this.productOnlineList.filter((temp)=>{
				if(temp.id==e.value){
					return temp
				}
			})
			this.bussnessForm.unitPrice = str[0].standardPrice + "";		//默认显示产品单价
			this.bussnessForm.serviceName = e.label;
		},
		selTow(e){
			if(!e){
				return
			}
			this.bussnessForm.contactName = e.label;
		},
		selThr(e){
			if(!e){
				return
			}
			this.bussnessForm.followName = e.label;
		},
		async proEdit(data){
			this.pro_isAddOrEdit = false;
			this.pro_Cindex = data._index;
			if(this.isAddOrEdit){
				await this.setSheetData();
				this.pro_ser_sheet = true;
			}else{
				this.pro_ser_sheet = true;
			}
			this.bussnessForm.contactId	   = data.contactId;
			this.bussnessForm.followId 	   = data.followId;
			this.bussnessForm.serviceCount = data.serviceCount;
			this.bussnessForm.serviceId	   = data.serviceId;
			this.bussnessForm.unitPrice    = data.unitPrice;
			this.bussnessForm.serviceName  = data.serviceName;
			this.bussnessForm.contactName  = data.contactName;
			this.bussnessForm.followName   = data.followName;
		},
		proDel(data){
			this.quotationForm.serviceInsertDtoList.splice(data._index,1);
			this.setTotal();
		},
		setTotal(){
			this.quotationForm.quotaionAmount = 0;
			this.quotationForm.productCount = 0;
			this.quotationForm.serviceInsertDtoList.filter((item)=>{
				this.quotationForm.quotaionAmount+=Number(item.unitPrice)*Number(item.serviceCount);
				this.quotationForm.productCount+=Number(item.serviceCount);
			})
			this.quotationForm.quotaionAmount =  Math.round(this.quotationForm.quotaionAmount * 100) / 100;  //截取两位
			this.setTotalPay();
		},
		setTotalPay(){
			//计算下方付款方式金额占比
			if(this.quotationForm.payMethod&&this.quotationForm.quotaionAmount){
				for(var i=0;i<this.quotationForm.payTimeList.length;i++){
					var temp = this.quotationForm.payTimeList[i];
					var str  = temp.payProportion.split("%");
					temp.payAmount = Number(this.quotationForm.quotaionAmount)*str[0]/100
				}
			}	
		},
		//选择付款方式
		selPayMent(e){
			if(!e){
				return
			}
			this.quotationForm.payTimeList = [];
			for(var i=0;i<this.payMethodData.length;i++){
				var temp = this.payMethodData[i];
				if(e.value==temp.id){
					var json = JSON.parse(temp.config);
					if(temp.type==0){			//1期
						var obj  = {
							payAmount 	  : "",			 	//付款金额
							payBatch  	  : 1,	//付款期数
							payProportion : json[1]+"%",  	//付款占比
							payTime		  : ""				//付款时间
						}
						this.quotationForm.payTimeList.push(obj)
					}else{						//3期
						var len = 3;
						if(json[3]==""){	//如果第三条没数据
							len = 2;
						}
						for(var j=1;j<=len;j++){
							var obj2  = {
								payAmount 	  : "",			 	//付款金额
								payBatch  	  : j,				//付款期数
								payProportion : json[j]+"%",  	//付款占比
								payTime		  : ""				//付款时间
							}
							this.quotationForm.payTimeList.push(obj2)
						}
					}
					break;
				}
			}
			this.setTotalPay()
		},
		//选择报价时间
		change_offer_time(e){
			this.searchForm.createTime = e;
		},
		//选择时间
		selectPayTime(e,index){
			this.quotationForm.payTimeList[index].payTime = e;
		},
		
		// 提交添加业务信息
		bussnessSubmit() {
			this.$refs['bussnessForm_ref'].validate((valid) => {
				if(valid) {
					var obj = JSON.stringify(this.bussnessForm);
					var toJson = JSON.parse(obj)
					this.$util.checkIsAgain(()=>{
						if(this.pro_isAddOrEdit){		//新增
							this.quotationForm.serviceInsertDtoList.push(toJson);
						}else{							//编辑
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].contactId = toJson.contactId;
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].followId = toJson.followId;
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].serviceCount = toJson.serviceCount;
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].serviceId = toJson.serviceId;
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].unitPrice = toJson.unitPrice;
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].serviceName = toJson.serviceName;
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].contactName = toJson.contactName;
							this.quotationForm.serviceInsertDtoList[this.pro_Cindex].followName = toJson.followName;
						}
						this.pro_ser_sheet = false;
						this.setTotal();
					})
				}
			})
		},
		// 提交新增报价
		handleSubmit() {
			if(this.isLook){
				this.quotationDialog =false;
				return
			}
			this.$refs['quotationForm_ref'].validate((valid) => {
				if(valid) {
					this.sendAdd()
				}
			})
		},
		//新增报价
		sendAdd(){
			if(this.quotationForm.serviceInsertDtoList==''){
				this.$Message.error("产品及服务不能为空");
				return
			}
			//校验付款时间 如果有一条数据没填时间或者金额就返回
			var isOk = true;
			for(let i=0;i<this.quotationForm.payTimeList.length;i++){
				var temp = this.quotationForm.payTimeList[i];
				if(temp.payTime=='' || temp.payBatch==''){
					this.$Message.error("请完善付款时间信息！");
					isOk = false;
					break;
				}
			}
			if(!isOk){
				return
			}
			//校验审批
			var roveInfo =  this.$refs.approve_ref.check_role();
			if(roveInfo==-1){
				return
			}
			const param = {
				applyBillCode : this.quotationForm.applyBillCode,			//受理单编号
				applyBillId   : this.quotationForm.applyBillId,				//受理单id
				payMethod	  : this.quotationForm.payMethod,				//付款方式
				payTimeList   : this.quotationForm.payTimeList,				//付款时间集合
				productCount  : this.quotationForm.productCount,			//产品数量
				quotaionAmount: this.quotationForm.quotaionAmount,			//报价总额
				quotaionMethod: this.quotationForm.quotaionMethod,			//报价方式
				quotaionOrder : this.quotationForm.quotaionOrder,			//报价次序
				remark		  : this.quotationForm.remark,					//备注
				serviceInsertDtoList : this.quotationForm.serviceInsertDtoList	,//产品及服务
				quotationFileList : this.quotationForm.quotationFileList	,//附件
				
				//审批参数
				approvalTempId : roveInfo.approvalTempId,
				approvalUserIds: roveInfo.approvalUserIds,
				examineUserIds : roveInfo.examineUserIds,
				ccUserIds	   : roveInfo.ccUserIds,
				leaveMessage   : roveInfo.leaveMessage
			}
			this.$util.checkIsAgain(()=>{
				if(this.isAddOrEdit){
					addOffer(param).then(res=>{
						if(res.code==200){
							this.quotationDialog = false;
							this.$Message.info("添加成功");
							this.clearInitData();
						}
					})
				}else{
					param.id = this.quotationForm.id;
					console.log("param: " + JSON.stringify(param));
					editOffer(param).then(res=>{
						if(res.code==200){
							this.quotationDialog = false;
							this.$Message.info("编辑成功");
							this.clearInitData();
						}
					})
				}
			})
		},
		clearInitData(){
			this.pageInfo.pageNum  = 1;
			this.pageInfo.pageSize = 10;
			this.getQuotationList();
		},
		//提交编辑报价
		toEdit(data){
			this.$refs['quotationForm_ref'].resetFields();
			this.isAddOrEdit = false;
			//回填数据
			defaultOffer(data.id).then(res=>{
				console.log("res: " + JSON.stringify(res));
				var apiInfo = res.data;
				this.quotationForm.id			 = apiInfo.id;
				this.quotationForm.applyBillCode = data.applyBillCode;
				this.quotationForm.applyBillId = apiInfo.applyBillId;
				this.quotationForm.payMethod   = Number(apiInfo.payMethod);
				this.quotationForm.payTimeList = apiInfo.payTimeList;
				this.quotationForm.productCount= apiInfo.productCount;
				this.quotationForm.quotaionAmount = apiInfo.quotaionAmount;
				this.quotationForm.quotaionMethod = apiInfo.quotaionMethod;
				this.quotationForm.quotaionOrder = apiInfo.quotaionOrder;
				this.quotationForm.remark = apiInfo.remark;
				apiInfo.serviceDetailList.filter((item)=>{
					item.unitPrice = item.unitPrice+"";
					item.serviceCount = item.serviceCount+"";
				})
				this.quotationForm.serviceInsertDtoList = apiInfo.serviceDetailList;
				this.quotationForm.quotationFileList = apiInfo.quotationFileList;
				this.$refs['file_ref'].changeData(apiInfo.quotationFileList?apiInfo.quotationFileList:[]);
				this.contactData = [];	//联系人数据
				this.followData  = [];	//跟单人数据
				if(apiInfo.customerId){
					if(!this.isLook){
						getContactList(apiInfo.customerId).then(res=>{		 //联系人
							this.contactData = res.data; 	
						})
						getAllUser({}).then(res=>{
							this.followData = res.data; //跟单人
						})
						//获取产品
						this.getPrudctOnlineData(apiInfo.customerId);
					}
				}
				this.quotationDialog = true;
			})
		},

	
		
		//删除单个
		deleteData(data){
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					deleteOffer([data]).then(res=>{
						if(res.code==200){
							_this.getQuotationList()
							this.clearInit();
							this.$Message.success('Success!');
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
					deleteOffer(_this.ids).then(res=>{
						if(res.code==200){
							_this.getQuotationList()
							_this.clearInit();
							this.$Message.success('Success!');
						}
					})
				}
			});
		},
		
		

		
		
		// 搜索
		handleSearch() {
			this.$Message.success("搜索中...")
            this.getQuotationList()
		},
		// 清空搜索
		handleReset() {
			this.$refs['searchForm'].resetFields()
			this.getQuotationList()
		},
		// 当前页面
		changePage(pages) {
			this.pageInfo.pageNum = pages
			this.getQuotationList()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageInfo.pageSize = size
			this.getQuotationList()
		},
		
	
		// 获取列表数据
		getQuotationList() {
			const param = {
				applyBillCode : this.searchForm.applyBillCode,	//受理单编号
				approveStatus : this.searchForm.approveStatus,	//审批状态
				createTime	  : this.searchForm.createTime,		//报价时间
				payMethod	  : this.searchForm.payMethod,		//付款方式
				quotationMethod :this.searchForm.quotationMethod,//报价方式
				pageNum : this.pageInfo.pageNum,
				pageSize : this.pageInfo.pageSize,
			}
			console.log("param: " + JSON.stringify(param));
			listOffer(param).then(res=>{
				console.log("res: " + JSON.stringify(res));
				if(res.code==200){
					this.quotationListData = res.rows;
					this.pageInfo.total = res.total;
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
	.isMenban{
		position: absolute;
		width: 100%;
		height: calc(100% - 100px);
		box-sizing: border-box;
		top: 50px;
		left: 0;
		z-index: 3;
	}
</style>