<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="formInline" :label-width="100"  :model="search" >
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客诉状态" prop="keSuId">
						   <Select v-model="search.keSuId">
								<Option v-for="item in search.keSuData" :value="item.value" :key="item.value">{{ item.label }}</Option>
						   </Select>
						</FormItem>
					</Col>
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客户名称" :md="12" :lg="8" :xl="6" :xxl="6" prop="custer">
							<Select v-model="search.custer">
								<Option v-for="item in search.custerData" :value="item.id" :key="item.id">{{ item.companyName }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="处理方式" :md="12" :lg="8" :xl="6" :xxl="6" prop="chuliId">
							<Select v-model="search.chuliId">
								<Option v-for="item in search.chuliData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="责任人" :md="12" :lg="8" :xl="6" :xxl="6" prop="zeRen">
							<Input v-model="search.zeRen"  placeholder="请输入"></Input>
						</FormItem>
					</Col>
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客诉日期" prop="keSuTime" :md="12" :lg="8" :xl="6" :xxl="6">
							<DatePicker :value="search.keSuTime" type="date" placeholder="请选择"  @on-change="selTime" style="width: 100%;"></DatePicker>
						</FormItem>
					</Col>
					
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="联系人" :md="12" :lg="8" :xl="6" :xxl="6" prop="contact">
							<Input v-model="search.contact" placeholder="请输入"></Input>
						</FormItem>
					</Col>
					
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客诉途径" :md="12" :lg="8" :xl="6" :xxl="6"  prop="keSuTj">
							<Select v-model="search.keSuTj">
								<Option v-for="item in search.keSuTjData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>

					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="指定投诉人" :md="12" :lg="8" :xl="6" :xxl="6" prop="zdKesu">
							<Input v-model="search.zdKesu" placeholder="请输入"></Input>
						</FormItem>
					</Col>
					
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="处理人" :md="12" :lg="8" :xl="6" :xxl="6" prop="chuliRen">
							<Input v-model="search.chuliRen" placeholder="请输入"></Input>
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
			<Button type="primary" ghost class="hxy-mr-20" @click="open_add">新增客诉</Button>
			<!-- <Button type="warning" class="hxy-mr-20" @click="TranFlag=true">栏目标题</Button> -->
			<!-- <Button type="error" class="hxy-mr-20"   :disabled="ids.length==''" @click="deleteDataAll">删除</Button> -->
		</div>
		
		
		<div class="hxy-mb-25">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange">
				<template slot-scope="{row}" slot="file_one" >
					<lookFile :row='row.files'></lookFile>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="pageInfo.total" @on-change="changePage" @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
		</div>
		
		
		<!-- 新增客诉 -->
		<Modal v-model="addkesu"  width = "600"  title="新增客诉"   :footer-hide="true">
			<Form  ref="addkesu_ref" :model="addModel"  :rules="addModelRule"  :label-width="100" label-position="left">
				<Row>
					<Col span="13">
						<FormItem label="客户名称" prop="customerId">
							<Select v-model="addModel.customerId" placeholder="请输入客户名称"   @on-change="custSel" style="width: 250px;">
								<Option v-for="(item,index) in customerList" :value="item.id" :key="index">{{item.companyName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="13">
						<FormItem label="联系人" prop="crmCustomerContactId">
							<Select v-model="addModel.crmCustomerContactId" placeholder="请选择联系人名称"   style="width: 250px;">
								<Option v-for="(item,index) in crmCustomerContactData" :value="item.id" :key="index">{{item.contactName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="13">
						<FormItem label="联系电话" prop="tel">
							<Input v-model="addModel.tel" style="width: 250px;"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="13">
						<FormItem label="客诉途径"  prop="keSuTj">
							<Select v-model="addModel.keSuTj" style="width:250px;">
								<Option v-for="item in keSuTjData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="13">
						<FormItem label="指定客诉人"  prop="presonIds" >
							<Select  multiple  v-model="addModel.presonIds" style="width:250px;">
								<Option v-for="(item,index) in presonList"  :key="index"  :value="item.userId">{{item.nickname}}</Option>
							</Select>  
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="13">
						<FormItem label="客诉内容" prop="cont">
							<Input v-model="addModel.cont" style="width: 250px;"></Input>
						</FormItem>
					</Col>
				</Row>
				<modalUpLoad upLoadText="上传附件"  @listenFile="listenFile" ref="file_ref"></modalUpLoad>
				<modalBtn  sureText="确认"  @sureBtn="sureBtn('addkesu_ref')"  @cancleBtn="addkesu=false"></modalBtn>
			</Form>
		</Modal>	

		
		
		<!-- 处理 -->
		<Modal v-model="chuli"  width = "600"  title="处理客诉"   :footer-hide="true">
			<!-- <Row class="hxy-mb-15">
				<Col :md="12" :lg="8" :xl="8" :xxl="8">处理人：{{user.nickName}}</Col>
				<Col :md="12" :lg="8" :xl="8" :xxl="8">处理日期：{{chuliDate}}</Col>
			</Row>
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="12" :xl="12" :xxl="12">客户名称：{{chuliInfo.companyName}}</Col>
			</Row> -->
			
			<Form  ref="chuliModel_ref" :model="chuliModel"  :rules="chuliRule"  :label-width="80" label-position="left">
				<!-- <Row>
					<Col :md="12" :lg="8" :xl="8" :xxl="8">
						<FormItem label="合同编号" prop="number"><Input v-model="chuliModel.number" style="width: 250px;"  @on-change="inpchange"></Input></FormItem>
					</Col>
				</Row>
			
				<div class="hxy-mb-20">
					<Table stripe border :columns="chuliTitle" :data="chuliData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
				</div> -->
				<Row>
					<Col :md="12" :lg="8" :xl="8" :xxl="8">
						<FormItem label="处理方式"  prop="chuliType">
							<Select v-model="chuliModel.chuliType" style="width:250px;">
								<Option v-for="item in search.chuliData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col :md="12" :lg="8" :xl="8" :xxl="8">
						<FormItem label="处理结果" prop="finsh">
							<Input v-model="chuliModel.finsh" style="width: 250px;"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col :md="12" :lg="8" :xl="8" :xxl="8">
						<FormItem label="备注" prop="beizhu">
							<Input v-model="chuliModel.beizhu" style="width: 250px;"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col :md="12" :lg="8" :xl="8" :xxl="8" >
						<FormItem label="责任人" prop="presonIds">
							<Select  multiple  v-model="chuliModel.presonIds" style="width:250px;">
								<Option v-for="(item,index) in presonList"  :key="index"  :value="item.userId">{{item.userName}}</Option>
							</Select>  
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col :md="12" :lg="8" :xl="8" :xxl="8">
						<FormItem label="责任内容" prop="cont">
							<Input v-model="chuliModel.cont" style="width: 250px;"></Input>
						</FormItem>
					</Col>
				</Row>
			<!-- 	<Row>
					<Col span="13">
						<div class="isFlexSpace" >
							<span>是否结束处理</span>
							<Switch    @on-change="changeTow"  />
						</div>
					</Col>
				</Row> -->
				
				<modalBtn  sureText="保存"  @sureBtn="sureBtn('chuliModel_ref')"  @cancleBtn="chuli=false"></modalBtn>
			</Form>
		</Modal>
		
		<!-- 处理记录 -->
		<Modal v-model="backHis"  width = "600"  title="处理记录"   :footer-hide="true">
			<div>
				<Table stripe border :columns="backHisTitle" :data="backHisData"  @on-selection-change="selectChange"></Table>
			</div>
			<modalBtn  sureText="确认"  @sureBtn="backHis=false"  @cancleBtn="backHis=false"></modalBtn>
		</Modal>
		
		
		<!-- 报批 -->
		<Modal v-model="talkSheet"  width = "600"  title="报批">
			<div slot="footer">
				<Button @click="talkSheet = false">取消</Button>
				<Button type="primary" class="btn-warning" @click="talkSheetOK">保存</Button>
			</div>
			<Form ref="addkesu_ref" :model="talkSheet_model"  :rules="talkSheet_rules"  :label-width="150" label-position="left">
				<FormItem label="设置审核人  审核人员" :md="12" :lg="8" :xl="6" :xxl="6" prop="examineUserIds">
					<Select multiple filterable style="width:260px;" v-model="talkSheet_model.examineUserIds" >
						<Option v-for="(item,index) in presonList"   :key="index" :value="item.userId">{{item.nickName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="审核意见填写提示" :md="12" :lg="8" :xl="6" :xxl="6" prop="examineAlertMessage">
					<Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="talkSheet_model.examineAlertMessage"></Input>
				</FormItem>
				
				
				<FormItem label="设置审批人  抄送人员" :md="12" :lg="8" :xl="6" :xxl="6" prop="approvalUserIds">
					<Select multiple filterable style="width:260px;" v-model="talkSheet_model.approvalUserIds">
						<Option v-for="(item,index) in presonList"   :key="index" :value="item.userId">{{item.nickName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="审批意见填写提示" :md="12" :lg="8" :xl="6" :xxl="6" prop="alertMessage">
					<Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="talkSheet_model.alertMessage"></Input>
				</FormItem>
				
				
				<FormItem label="设置抄送人 抄送成员" :md="12" :lg="8" :xl="6" :xxl="6" prop="ccUserIds">
					<Select multiple filterable style="width:260px;" v-model="talkSheet_model.ccUserIds" >
						<Option v-for="(item,index) in presonList"   :key="index" :value="item.userId">{{item.nickName}}</Option>
					</Select>
				</FormItem>
				<!-- <FormItem label="审批意见填写提示" :md="12" :lg="8" :xl="6" :xxl="6" prop="approvalUserIds">
					<Input type="textarea" autosize="{minRows: 2,maxRows: 5}"></Input>
				</FormItem> -->
				
				
				<FormItem prop="isFlag" :label-width="0">
					<div class="isFlexSpace" style="width: 200px;">
						通过聊天发送给审批人<Switch v-model="talkSheet_model.isFlag"></Switch>
					</div>
				</FormItem>
				
				<FormItem label="留言" :md="12" :lg="8" :xl="6" :xxl="6" class="hxy-mt-20" prop="leaveMessage">
					<Input  style="width:260px;"  v-model="talkSheet_model.leaveMessage"></Input>
				</FormItem>
				
			</Form>
		</Modal>
		
		<!-- 详情 -->
		<Modal
			title="客诉详情"
			v-model="look_sheet"
			:mask-closable="false"
			:width="720">
			<div>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						客诉时间：{{look_Info.customerComplaintTime || ''}}
					</Col>
					<Col span="12">
						客户名称：{{look_Info.companyName || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						客诉状态：{{look_Info.customerComplaintStatusDesc || ''}}
					</Col>
					<Col span="12">
						联系人：{{look_Info.contactName || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						联系电话 ：{{look_Info.customerContactTelPhone || ''}}
					</Col>
					<Col span="12">
						客诉途径：{{look_Info.customerComplaintMethodDesc || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						指定客诉人 ：{{look_Info.guestComplainant || ''}}
					</Col>
					<Col span="12">
						客诉内容：{{look_Info.customerComplaintContent || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12" >
						附件 ：
						<lookFile :row='look_Info.files'></lookFile>
					</Col>
				</Row>
				
				<!-- <modalUpLoad upLoadText=""  ref="look_file_ref"></modalUpLoad> -->
			</div>
		</Modal>
		
	
		
		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
		
		
		
		
		<!-- 附件图片预览 -->
		<Modal 
			title="图片预览" 
			v-model="previewDialog">
			<img :src="imgUrl" style="width: 100%">
			<div slot="footer">
				<Button type="default" @click="previewDialog = false">关闭</Button>
			</div>
		</Modal>
		
	</div>
</template>
<script>
import sendWishTemp from '_c/sendWish/sendWish'
import modalUpLoad from '_c/modalUpLoad/index'
import { getMasterDeptCustomer,queryCurrStaff, listContact } from '_s/customer'
import { findCustCant} from '_s/offerPrice'
import { getProInfo} from '_s/heTong'
import { serve_add,serve_list, serve_look,chuli_add,chuli_list,del_serve, reportForApproval} from '_s/serverSafe'
import { mapGetters } from 'vuex'
import { getCrmTemp } from "_s/approval"

export default {
    data(){
        return{
			search : {
				keSuId : "",
				keSuData : [],
				custer : "",
				custerData :[],
				chuliId: "",
				chuliData:[],
				zeRen:"",
				keSuTime : "",
				contact  : "",
				keSuTj   : "",
				keSuTjData:[],
				zdKesu   : "",
				chuliRen : ""
			},
			ids : [],
			pageInfo : {
				pageNum : 1,
				pageSize:10,
				total   : 0
			},
			customerList : [],			//弹窗的客户名称
			crmCustomerContactData: [], //弹窗里的联系人数据
			keSuTjData  : [],			//弹窗里的客诉途径
			presonList	: [],			//弹窗里的指定客诉人
			fileList	: [],			
			
		
		
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
					type : 'index',
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '客诉时间',
					key: 'customerComplaintTime',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '客户名称',
					key: 'companyName',
					align : "center",
					resizable: true,
					width: 200
				},
				{
					title: '客诉状态',
					key: 'customerComplaintStatusDesc',
					resizable: true,
					align : "center",
					width: 200
				},
				{
					title: '联系人',
					key: 'contactName',
					resizable: true,
					align : "center",
					width: 300
				},
				{
					title: '联系电话',
					key: 'customerContactTelPhone',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '客诉途径',
					key: 'customerComplaintMethodDesc',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '指定客诉人',
					key: 'guestComplainant',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '客诉内容',
					key: 'customerComplaintContent',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '图片',
					slot: 'file_one',
					key : "file_one",
					align : "center",
					resizable: true,
					width: 220
				},
				
				{
					title: '处理人',
					key: 'createByName',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '处理完成时间',
					key: 'updateTime',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '处理方式',
					key: 'processingMethod',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '处理结果',
					key: 'processResult',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '责任人',
					key: 'responsibilityUsers',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '责任内容',
					key: 'responsibilityContent',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '备注',
					key: 'remark',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '审批状态',
					key: 'customerComplaintStatus',
					align : "center",
					resizable: true,
					width: 150
				},
				
				
				{
					title:'操作',
					key:'action',
					width: 300,
					align : "center",
					fixed : "right",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style : {
									display : params.row.customerComplaintStatus == 2?"none":"inline-block"
								},
								on: {
									click: () => {
										this.cliChuli(params.row);
									}
								}
							}, '处理'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.look_sheet= true;
										this.look_Info = params.row;
										this.$refs['look_file_ref'].changeData(params.row.pic)
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
										this.handleCrmTemp()
										this.open_talkSheet(params.row)
									}
								}
							}, '报批')
							// h('Button', {
							// 	props: {
							// 		type: 'text',
							// 		size: 'small'
							// 	},
							// 	on: {
							// 		click: () => {
							// 			this.open_chuliHis(params.row)
							// 		}
							// 	}
							// }, '处理记录')
						])
					}
				}
			],
			

			//新增客诉
			addkesu   : false,
			addModel  : {
				customerId : "",
				crmCustomerContactId:"",
				tel : "",
				keSuTj : "",
				presonIds : "",
				cont  : ""
			},
			addModelRule:{
				customerId: [
					{ required: true, message: '请选择客户名称', trigger: 'change',type:"number" }
				],
				crmCustomerContactId: [
					{ required: true, message: '请选择联系人', trigger: 'change',type:"number"}
				],
				tel: [
					{ required: true, message: '请填写联系人电话', trigger: 'blur' }
				],
				keSuTj: [
					{ required: true, message: '请选择客诉途径', trigger: 'blur' }
				],
				cont: [
					{ required: true, message: '请填写客诉内容', trigger: 'blur' }
				],
			},
			
	
			//处理
			chuli : false,
			chuliInfo : "",
			chuliDate :"",
			chuliModel : {
				number : "",
				chuliType : "",
				finsh : "",
				beizhu: "",
				presonIds: "",
				cont  : "",
				isFinish:0
			},
			chuliRule:{
				number: [
					{ required: true, message: '请填写合同编号', trigger: 'blur' }
				],
				chuliType: [
					{ required: true, message: '请选择处理方式', trigger: 'blur' }
				],
				finsh: [
					{ required: true, message: '请填写处理结果', trigger: 'blur' }
				],
				presonIds: [
					{ required: true, message: '请填写责任人' }
				],
				cont: [
					{ required: true, message: '请填写责任内容', trigger: 'blur' }
				],
			},
			chuliTitle : [
				{
					title: '序号',
					type: "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '产品名称',
					key: 'productName',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '产品数量',
					key: 'count',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '产品单价',
					key: 'unitPrice',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '交付标准',
					key: 'standardName',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '付款方式',
					key: 'paymentType',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '第一期付款比例',
					key: 'payScale01',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '付款时间',
					key: 'payTime01',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '第二期付款比例',
					key: 'payScale02',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '付款时间',
					key: 'payTime02',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '第三期付款比例',
					key: 'payScale03',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '付款时间',
					key: 'payTime03',
					resizable: true,
					align : "center",
					width: 150
				},
			],
			chuliData  : [],
			
			
			//处理记录
			backHis : false,
			backHisTitle : [
				{
					title: '序号',
					type : 'index',
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '合同编号',
					key: 'contractNo',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '产品信息',
					key: 'productNames',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '处理人',
					key: 'handler',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '处理时间',
					key: 'processingTime',
					resizable: true,
					align : "center",
					width: 250
				},	
				{
					title: '需求内容',
					key: 'responsibilityContent',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '处理方式',
					key: 'processingMethodDesc',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title: '处理结果',
					key: 'processResult',
					resizable: true,
					align : "center",
					width: 150
				},	
				{
					title: '备注',
					key: 'remark',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '责任人',
					key: 'responsible',
					resizable: true,
					align : "center",
					width: 150
				},	
				{
					title: '责任内容',
					key: 'responsibilityContent',
					resizable: true,
					align : "center",
					width: 200
				}
			],
			backHisData : [],
			
			//报批
			talkSheet:false,
			talkSheet_model: {},
			talkSheet_rules: {},
			
			//查看详情
			look_sheet : false,
			look_Info  : "",
			
			//图片附件预览
			previewDialog: false,
			imgUrl: '',
			isAgain : true,
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
        }
    },
	components: { sendWishTemp, modalUpLoad },
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
		this.initList();
		this.getCustmer();	//客户名称
		this.getKesuPreson();//指定客诉人

		this.search.keSuData	= this.filterDict(this.config,'customer_complaint_status');  //客诉状态
		this.search.chuliData	= this.filterDict(this.config,'processing_method');			 //处理方式
		this.search.keSuTjData	= this.filterDict(this.config,'customer_complaint_method');  //客诉途径
		this.keSuTjData  = this.filterDict(this.config,'customer_complaint_method');  //客诉途径弹窗里的
    },
    methods: {
		//客户名称
		getCustmer(){
			getMasterDeptCustomer().then(res=>{
				this.search.custerData = res.data;
				this.customerList = res.data;
			})
		},
		//指定客诉人
		getKesuPreson(){
			queryCurrStaff().then(res=>{
				this.presonList = res.data;
			})
		},
		handleCrmTemp() {
			getCrmTemp({ formName: 13 }).then(res => {
				if (res.code === 200) {
					this.talkSheet_model.approvalTempId = res.data.id
				}
			})
		},
		// 报批客诉
		talkSheetOK() {
			reportForApproval(this.talkSheet_model).then(res => {
				if (res.code === 200) {
					this.talkSheet = false
					this.initList()
				}
			})
		},
		//选择客户
		custSel(e){
			if(!e){
				return
			}
			//获取联系人数据
			// const param = {
			// 	crmCustomerId : e
			// }
			this.addModel.crmCustomerContactId = ''
			listContact(e).then(res=>{
				this.crmCustomerContactData = res.data
			})
		},
		//打开新增客诉按钮
		open_add(){
			this.$refs['addkesu_ref'].resetFields();
			this.fileList = [];
			this.$refs.file_ref.changeData([]);
			this.addkesu = true;
		},
		//上传附件
		listenFile(data){
			this.fileList = data;
		},
		//列表
		initList(){
			const param = {	
				companyName : this.search.custer || '', 	//客户名称
				contactName : this.search.contact,	//联系人
				customerComplaintMethod : this.search.keSuTj || '',	//客诉途径
				customerComplaintStatus : this.search.keSuId || '',	//客诉状态	
				customerComplaintTime   : this.search.keSuTime, //客诉时间
				guestComplainant		: this.search.zdKesu,	//指定客诉人
				handler					: this.search.chuliRen,	//处理人
				processingMethod        : this.search.chuliId || '',	//处理方式
				responsible				: this.search.zeRen,	//责任人
				pageSize				: this.pageInfo.pageSize,
				pageNum					: this.pageInfo.pageNum,
			}
			serve_list(param).then(res=>{
				this.taskListData = res.rows;
				this.pageInfo.total = res.total;
				this.ids = [];
			})
		},
		//打开新增-处理弹窗
		cliChuli(data){
			this.chuliDate = this.$util.getNowTime();
			this.chuliInfo = data;
			this.chuli = true;
			this.chuliData = [];
			this.$refs['chuliModel_ref'].resetFields();
		},
		changeTow(e){
			this.chuliModel.isFinish = e?1:0;
		},
		//查询处理记录
		open_chuliHis(data){
			chuli_list(data.id).then(res=>{
				console.log("res: " + JSON.stringify(res));
				this.backHisData = res.data;
				this.backHis = true;
			})
		},
		//打开报批
		open_talkSheet(){
			this.talkSheet = true;
		},
		inpchange(){
			if(this.chuliModel.number.length>=22&&this.chuliModel.number.length<25){
				getProInfo(this.chuliModel.number).then(res=>{
					console.log("res: " + JSON.stringify(res));
					if(res.code==200){
						this.chuliData = res.data;
					}
				}).catch(error=>{
					this.chuliData = []
				})
			}else{
				this.chuliData = []
			}
		},
		
		
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
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
			this.$Message.success('正在搜索当前匹配内容');
		},
		//清空
		handleReset(){
			this.$refs['formInline'].resetFields();
			this.pageInfo.pageNum  = 1;
			this.pageInfo.pageSize = 10;  
			this.initList();  
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
					del_serve(_this.ids).then(res=>{
						if(res.code==200){
							this.$Message.success(res.msg);
							_this.pageInfo.pageNum = 1;
							_this.initList();
						}
					})
				}
			});
		},
		//导出
		exportData(){
			this.$Message.info("接口未完善")
			// const param = {
			// 	companyName : this.search.custer, 	//客户名称
			// 	contactName : this.search.contact,	//联系人
			// 	customerComplaintMethod : this.search.keSuTj,	//客诉途径
			// 	customerComplaintStatus : this.search.keSuId,	//客诉状态	
			// 	customerComplaintTime   : this.search.keSuTime, //客诉时间
			// 	guestComplainant		: this.search.zdKesu,	//指定客诉人
			// 	handler					: this.search.chuliRen,	//处理人
			// 	processingMethod        : this.search.chuliId,	//处理方式
			// 	responsible				: this.search.zeRen,	//责任人
			// }
			// this.axiosPost('/crm/payment/export',param,'客诉处理表')
		},
		
		
		
		sureBtn(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					switch(name){
						case "addkesu_ref" : 
						this.add_keSu_api()
						break;
						case "chuliModel_ref" :
						this.add_keSu_chuli_api()
						break;
					}
				}
			})
		},
		// 新增客诉
		add_keSu_api(){
			console.log("this.isAgain: " + JSON.stringify(this.isAgain));
			if(this.isAgain){
				this.isAgain = false
				const param = {
					customerId  : this.addModel.customerId,						//客户ID
					customerContactId  : this.addModel.crmCustomerContactId,	//联系人ID
					customerContactTelPhone : this.addModel.tel,				//联系电话
					customerComplaintMethod	 : this.addModel.keSuTj,			//客诉途径
					complaintPersonIds : this.addModel.presonIds,				//指定客诉人id集合
					customerComplaintContent : this.addModel.cont,				//客诉内容
					files : this.fileList
				}
				serve_add(param).then(res=>{
					if(res.code==200){
						this.$Message.success(res.msg);
						this.addkesu = false;
						this.initList();
						this.clearIsagain();
					}
				}).catach(error=>{
					this.clearIsagain();
				})
			}
		},
		// 新增客诉处理
		add_keSu_chuli_api(){
			// if(this.chuliData==''){
			// 	this.$Message.success('请输入有效的合同编号！');
			// 	return
			// }
			if(this.isAgain){
				this.isAgain = false;
				const param = {
					contractNo : this.chuliModel.number,			//合同编号
					customerComplaintId : this.chuliInfo.id,		//客户记录id
					isEndProcessing : this.chuliModel.isFinish,		//是否结束处理
					processResult   : this.chuliModel.finsh,		//处理结果
					processingMethod: this.chuliModel.chuliType,	//处理方式
					remark			: this.chuliModel.beizhu,		//备注
					responsibilityContent : this.chuliModel.cont,	//责任内容
					responsible	    : this.chuliModel.presonIds,	//责任人id集合
					isEndProcessing: 1
				}
				chuli_add(param).then(res=>{
					if(res.code==200){
						this.initList();
						this.$Message.success(res.msg);
						this.chuli = false;
						this.clearIsagain();
					}
				}).catach(error=>{
					this.clearIsagain();
				})
			}
		},
		clearIsagain(){
			setTimeout(()=>{
				this.isAgain = true;
			},1000)
		},
		
		//选择维护时间
		selTime(e){
			this.search.keSuTime = e;
		},
		// 附件预览
		preview(data) {
			this.previewDialog = true;
			this.imgUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
		},
		//下载附件
		load(data){
			this.$Message.success("功能未开放")
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