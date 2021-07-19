<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="formInline"  :model="search"  :label-width="100" >
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客户名称" :md="12" :lg="8" :xl="6" :xxl="6" prop="custId">
							<Select v-model="search.custId">
								<Option v-for="item in search.custData" :value="item.id" :key="item.id">{{ item.companyName }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="联系人" :md="12" :lg="8" :xl="6" :xxl="6" prop="custName">
							<Input v-model="search.custName" placeholder="请输入"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="联系人类别" :md="12" :lg="8" :xl="6" :xxl="6" prop="contactID">
							<Select v-model="search.contactID">
								<Option v-for="item in search.contactData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="与其关系" :md="12" :lg="8" :xl="6" :xxl="6" prop="aboutId">
							<Select v-model="search.aboutId">
								<Option v-for="item in search.aboutData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="特殊节日" :md="12" :lg="8" :xl="6" :xxl="6" prop="importDate">
							<Input v-model="search.importDate" placeholder="请输入"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="节日时间" prop="jieRiTime"   :md="12" :lg="8" :xl="6" :xxl="6">
							<DatePicker :value="search.jieRiTime" type="date" placeholder="请选择"  @on-change="selTime" style="width: 100%;"></DatePicker>
						</FormItem>
					</Col>
					
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="状态" :md="12" :lg="8" :xl="6" :xxl="6" prop="aboutId">
							<Select v-model="search.aboutId">
								<Option v-for="item in search.aboutData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					
				</Row>
				<Col span="24" class="tr">
					<Button type="primary" @click="handleSearch('searchForm')" icon="ios-search" class="hxy-mr-10">搜索</Button>
					<Button type="default" @click="handleReset('searchForm')" icon="ios-refresh">清空</Button>
				</Col>
			</Form>
		</div>
		
		
		<div class="hxy-mb-30">
			<!-- <Button type="success" class="hxy-mr-20" @click="openWish" :disabled="ids.length!=1">送祝福</Button>
			<Button type="warning" class="hxy-mr-20" @click="TranFlag=true">栏目标题</Button>
			<Button type="error" class="hxy-mr-20" @click="delWish" :disabled="ids.length!=1">删除</Button> -->
		</div>
		
		
		<div class="hxy-mb-25">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="pageInfo.total" @on-change="changePage"  @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
		</div>
		
		
		
		<!-- 送祝福 -->
		<sendWishTemp  ref="sendWish_ref"   @sureBtn="sureBtn"  @cancleBtnWish="sendWish=false"></sendWishTemp>
		
		<!-- 祝福记录 -->
		<hisWishTemp ref="his_ref"></hisWishTemp>
		
		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
		
	</div>
</template>

<script>
import sendWishTemp from '_c/sendWish/sendWish'
import hisWishTemp from '_c/hisWish/hisWish'
import { getMasterDeptCustomer } from '_s/customer'
import { getList,wish_Add,del_wish} from '_s/serverSafe'
import { mapGetters } from 'vuex'
export default {
    data(){
        return{
			//搜索参数
			search : {
				custId : "",
				custData : [],
				custName	: "",
				contactId	: "",
				contactData : [],
				aboutId		: "",
				aboutData   : [],
				importDate  : "",
				jieRiTime   : ""
			},
			//翻页参数
			pageInfo: {
				pageNum : 1,  // 页数
				pageSize: 10, // 每页显示数量
				total   : 0
			},
			
			

			//列表参数
			pageLoading : false,//页面loading动画
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
					title: '发起人',
					key: 'companyName',
					resizable: true,
					align : "center",
					width: 250
				},
				
				
				{
					title: '客户名称',
					key: 'companyName',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '联系人',
					key: 'contactName',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '性别',
					key: 'contactSex',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '职务',
					key: 'contactPosition',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '电话',
					key: 'contactMobile',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '微信号',
					key: 'contactWechat',
					align : "center",
					resizable: true,
					width: 150
				},
			
				{
					title: '爱好',
					key: 'hobbys',
					align : "center",
					resizable: true,
					width: 150
				},
				
				{
					title: '联系人类别',
					key: 'contactType',
					align : "center",
					resizable: true,
					width: 150
				},
							
				{
					title: '与其关系',
					key: 'relationship',
					align : "center",
					resizable: true,
					width: 150
				},
				
				{
					title: '特殊节日',
					key   : 'specialDate',
					align : "center",
					resizable: true,
					width: 150
				},
							
				{
					title: '节日时间',
					key   : 'festivalDate',
					align : "center",
					resizable: true,
					width: 150
				},
				
				{
					title: '礼品',
					key   : 'festivalDate',
					align : "center",
					resizable: true,
					width: 150,
					render:(h,params)=>{
						return h('div',[
							h('Button',{
								
							},'查看')
						])
					}
				},
				{
					title: '状态',
					key   : 'festivalDate',
					align : "center",
					resizable: true,
					width: 150
				},
				
				
				{
					title:'操作',
					key:'action',
					width: 250,
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
										// this.openHis(params.row)
									}
								}
							}, '通过'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										// this.openHis(params.row)
									}
								}
							}, '驳回'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										// this.openHis(params.row)
									}
								}
							}, '详情')
						])
						// return h('div', [
						// 	h('Button', {
						// 		props: {
						// 			type: 'text',
						// 			size: 'small'
						// 		},
						// 		on: {
						// 			click: () => {
						// 				this.openHis(params.row)
						// 			}
						// 		}
						// 	}, '祝福记录'),
						// ])
					}
				}
			],
			isAgain : true,
			
			
			//以下是送祝福
			sendWish  : false,
			ids  	  : [],
			wishInfo  : {},
			
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
        }
    },
	components: {sendWishTemp,hisWishTemp},
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
	},
    created() {
		this.getTranList();
    },
    mounted(){
		this.search.safeData = this.filterDict(this.config,'wish_type'); 	 	//维护状态
		this.search.contactData = this.filterDict(this.config,'contact_type');	//联系人类别
		this.search.aboutData	= this.filterDict(this.config,'cust_relation'); //与其关系
		this.getCustmer();													 	//客户名称
		this.initList();
    },
    methods: {
		//客户名称
		getCustmer(){
			getMasterDeptCustomer().then(res=>{
				this.search.custData = res.data;
			})
		},
		//选择维护时间
		selTime(e){
			this.search.jieRiTime = e;
		},
		initList(){
			const param = {
				companyName  : this.search.custId || '',
				contactName  : this.search.custName,
				contactType  : this.search.contactId || '',
				festivalDate : this.search.jieRiTime,
				relationship : this.search.aboutId || '',
				specialDate  : this.search.importDate,
				pageNum		 : this.pageInfo.pageNum,
				pageSize	 : this.pageInfo.pageSize
			}
			getList(param).then(res=>{
				this.taskListData = res.rows;
				this.pageInfo.total = res.total;
				this.ids = [];
			})
		},
		
		//以下是送祝福相关事件
		openWish(){
			this.$refs.sendWish_ref.openModel();
			this.$refs.sendWish_ref.getInfo(this.wishInfo);
		},
		sureBtn(data) {
			if(this.isAgain){
				this.isAgain =false;
				const param = {
					crmCustomerContactId : data.crmCustomerContactId,
					gifts	: data.gifts,
					remark	: data.remark,
					wishType: data.wishType,
					specialDate : data.specialDate,
					approvalTempId :data.approvalTempId,
					approvalUserIds : data.approvalUserIds,
					ccUserIds:data.ccUserIds,
					leaveMessage:data.leaveMessage
				}
				wish_Add(param).then(res=>{
					if(res.code==200){
						this.pageInfo.pageNum = 1;
						this.initList();
						this.$refs.sendWish_ref.cancleBtn();
						this.$Message.success("添加成功");
						setTimeout(()=>{
							this.isAgain = true;
						},1000)
					}
				}).catch(error=>{
					this.isAgain = true;
				})
			}
		},
		//送祝福事件结束 
		
		//祝福记录事件
		openHis(data){
			this.$refs.his_ref.open(data);
		},
		//删除祝福
		delWish(){
			del_wish(this.wishInfo.crmCustomerContactId,this.wishInfo.specialDate).then(res=>{
				if(res.code==200){
					this.initList();
					this.pageInfo.pageNum = 1;
					this.$Message.success('操作成功');
				}
			})
		},
		
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.crmCustomerContactId);
			this.wishInfo = selection[0];
		},
		// 底部翻页选择
		changePage(pages) {
			this.pageInfo.pageNum = pages;
			this.initList();
		},
		changePageSize(size) {
			this.pageInfo.pageSize = size;
			this.initList();
		},
		//搜索
		handleSearch(){
			this.initList();
			this.$Message.success('搜索中...');
		},
		//清空
		handleReset(){
			this.$refs['formInline'].resetFields();
			this.pageInfo.pageNum  = 1;
			this.pageInfo.pageSize = 10;  
			this.initList();  
		},   
		//导出
		exportData(){
			const param = {
				companyName  : this.search.custId,
				contactName  : this.search.custName,
				contactType  : this.search.contactId,
				festivalDate : this.search.jieRiTime,
				relationship : this.search.aboutId,
				specialDate  : this.search.importDate,
				pageNum		 : this.pageInfo.pageNum,
				pageSize	 : this.pageInfo.pageSize
			}
			// this.axiosPost('/crm/payment/export',param,'产品付款方式表')
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
</style>