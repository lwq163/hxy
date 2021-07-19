<template>
	<div class="followUp">
		<div class="search hxy-mb-25">
			<Form ref="searchForm_ref" :model="searchForm" :label-width="100">
				<Row :gutter="20">
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="受理单编号" prop="billId">
							<Input placeholder="请输入" v-model="searchForm.billId"  />
						</FormItem>   
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="跟进方式" prop="followMethod" >
							<Select v-model="searchForm.followMethod" clearable>
								<Option v-for="(val,index) in folTypeData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="计划二次拜访时间" :label-width="140" prop="nextTime" >
							<DatePicker v-model="searchForm.nextTime" format="yyyy-MM-dd HH:mm:ss" clearable  @on-change="change_nextTime" type="datetime" :editable="false"  placeholder="请选择" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>   
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客户名称" prop="customerName">
							<Input placeholder="请输入" v-model="searchForm.customerName"  />
						</FormItem>   
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="计划时间" prop="planTime">
							<DatePicker v-model="searchForm.planTime"  clearable format="yyyy-MM-dd HH:mm:ss" @on-change="change_planTime" type="datetime" :editable="false"  placeholder="请选择" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="出行方式" prop="goMethod">
							<Select v-model="searchForm.goMethod" clearable>
								<Option v-for="(val,index) in outTypeData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="跟进单状态"prop="delFlag">
							<Select v-model="searchForm.delFlag" clearable>
								<Option v-for="(val,index) in folOrderData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="审批状态" prop="approveStatus">
							<Select v-model="searchForm.approveStatus" clearable>
								<Option v-for="(val,index) in approveTypeData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div style="display: flex;justify-content: flex-end;">
				<Button type="primary" @click="handleSearch()"  icon="ios-search" class="hxy-ml-30 hxy-mr-10">搜索</Button>
				<Button type="default" @click="handleReset()"   icon="ios-refresh">清空</Button>
			</div>
		</div>
		<div class="hxy-mb-25">
			<Button type="primary"  class="hxy-mr-10" @click="openFollowDialog">新增跟进</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="followListTitle" :data="followListData" :loading="pageInfo.pageLoading">
				<template slot-scope="{row}" slot="file_one" >
					<lookFile :row='row.visitFileList'></lookFile>
				</template>
				<template slot-scope="{row}" slot="file_tow" >
					<lookFile :row='row.contendFileList'></lookFile>
				</template>
				<!-- 审批中或者跟进状态为作废或者关闭状态  ，所以按钮不显示 -->
				<template slot-scope=" { row }" slot="action" >
					<!-- approveStatus 审核通过，审核驳回，待审核    -->
					<!-- delFlag 正常，冻结 -->
					<div v-if="row.approveStatus!=1 && row.delFlag!=3 && row.delFlag!=1" style="padding-top: 15px;">
						<Button @click="changeBtn(1,row.id)" class="hxy-mr-15 hxy-mb-15" v-if="row.approveStatus==2&&row.delFlag!=2">关闭</Button> 
						<Button @click="changeBtn(2,row.id)" class="hxy-mr-15 hxy-mb-15" v-if="row.delFlag!=2">转交</Button>
						<Button @click="changeBtn(3,row.id)" class="hxy-mr-15 hxy-mb-15" v-if="row.delFlag!=2">冻结</Button>
						<Button @click="changeBtn(4,row.id)" class="hxy-mr-15 hxy-mb-15">作废</Button>
						<Button @click="changeBtn(5,row.id)" class="hxy-mr-15 hxy-mb-15" v-if="row.delFlag==2">解冻</Button>
						<Button @click="changeBtn(6,row.id,row)" class="hxy-mr-15 hxy-mb-15" v-if="row.delFlag!=2">变更时间</Button>
					</div>
					<span v-if="row.approveStatus==1 || row.delFlag==3 || row.delFlag==1">-</span>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="pageInfo.total" :page-size="pageInfo.pageSize" :current="pageInfo.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>
		

		<!-- 创建跟进 -->
		<Modal
            title="创建跟进"
            v-model="add_model_sheet"
            @on-cancel="handleCancel"
            :width="720"
			:z-index="1000"
			:mask-closable="false"
			>
            <Form :model="add_model" ref="add_model_ref" :rules="add_model_rule" label-position="left" :label-width="100">
				<Row>
					<Col span="12">
						<FormItem label="受理单ID" prop="applyBillId">
							<Select
								ref="serch_bill"
								:filterable="true" 
								:clearable="true" 
								v-model="add_model.applyBillId"
								:remote-method="onBlur_applyBillId"
								@on-change="onChangeBill"
								@on-clear="onClearBill"
								placeholder="请输入">
								<Option v-for="(item, index) in BillIdData" :value="item.id" :key="index" style="width: 80px">{{item.applyBillCode}}</Option>
							</Select>
						</FormItem>   
					</Col>
				</Row>
				
				<Row>
					<Col span="12">
						<FormItem label="计划时间" prop="planTime">
							<DatePicker v-model="add_model.planTime"  format="yyyy-MM-dd HH:mm:ss" @on-change="change_form_planTime" type="datetime" :editable="false"  placeholder="开始时间" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>  
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="跟进方式" prop="followMethod">
							<Select v-model="add_model.followMethod" placeholder="请选择跟进方式">
								<Option v-for="(val,index) in folTypeData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<!-- 面访客户才显示以下div -->
				<div v-if="add_model.followMethod==1">
					<Row>
						<Col span="12">
							<FormItem label="出行工具" prop="goMethod">
								<Select v-model="add_model.goMethod" placeholder="请选择出行工具">
									<Option v-for="(val,index) in outTypeData" :value="val.value" :key="index">{{val.label}}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
							<FormItem label="出发地" prop="goAddress">
								<Input type="text" v-model="add_model.goAddress" placeholder="请输入出发地"></Input>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
							<FormItem label="目的地" prop="toAddress">
								<Input type="text" v-model="add_model.toAddress" placeholder="请输入目的地"></Input>
							</FormItem>
						</Col>
					</Row>
				</div>
				<Row>
					<Col span="12">
						<FormItem label="联系人" prop="contactId">
							<Select ref="ref_contact"  not-found-text="当前受理单ID没有联系人"  v-model="add_model.contactId" :clearable="true"  placeholder="选择联系人">
								<Option v-for="(val,index) in contactData" :value="val.id" :key="index">{{val.contactName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="跟进事项" prop="followDesc">
							<Input type="textarea" :maxlength="500" show-word-limit  v-model="add_model.followDesc" placeholder="请输入"></Input>
						</FormItem>
					</Col>
				</Row>
				<!-- 审批 -->
				<approve ref="approve_ref" :name="7"></approve>
            </Form>
            <div slot="footer">
                <Button type="default" @click="add_model_sheet=false">取消</Button>
                <Button type="primary" @click="handleSubmit">确定</Button>
            </div>
		</Modal>
		
		<!-- 作废 -->
		<Modal v-model="cause_sheet" title="作废">
			<div class='isFlexalitem'>
				<span class="hxy-mr-20">作废原因</span>
				<Input style="flex:1" placeholder="请输入" v-model="inpCause"  />
			</div>
			<div slot="footer">
				<Button type="default" @click="cause_sheet=false">取消</Button>
				<Button type="primary" @click="handleSubmitCause">确定</Button>
			</div>
		</Modal>
		
		
		<!-- 冻结 -->
		<Modal v-model="cold_sheet" title="冻结">
			<div class='isFlexalitem'>
				<span class="hxy-mr-20">冻结原因</span>
				<Input style="flex:1" placeholder="请输入" v-model="inpColdCause"  />
			</div>
			<div slot="footer">
				<Button type="default" @click="cold_sheet=false">取消</Button>
				<Button type="primary" @click="handleSubmitCold">确定</Button>
			</div>
		</Modal>
		
		
		<!-- 转交 -->
		<Modal v-model="deliver_sheet" title="转交" :width="720">
			<div class='isFlexalitem'>
				<span class="hxy-mr-30"><span style='color: reds;'>*</span> 转交原因</span>
				<Input style="flex:1" placeholder="请输入"  type="textarea"  v-model="inpDeliverCause"  />
			</div>
			<!-- <RadioGroup  value="转移至直属上级"   @on-change="changeRadio_de">
				<div class="hxy-mt-20">
					<Radio label="转移至直属上级"  ></Radio>
				</div>
				<div class="hxy-mt-20 hxy-mb-20 isFlexalitem">
					<Radio label="转移到成员"</Radio>
					<Select v-model="deId" style="width: 240px;" ref="deliver_ref" :clearable="true" >
						<Option v-for="(val,index) in deData" :value="val.value" :key="index">{{val.label}}</Option>
					</Select>
				</div>
			</RadioGroup> -->
			<div class="hxy-mt-20 hxy-mb-20 isFlexalitem">
				<span class="hxy-mr-15">转移到成员</span>
				<Select v-model="deId" style="width: 240px;" ref="deliver_ref" :clearable="true" >
					<Option v-for="(val,index) in deData" :value="val.userId" :key="index">{{val.nickName}}</Option>
				</Select>
			</div>
			
			
			
			<approve ref="approve_ref_deliver" :name="7"></approve>
			<div slot="footer">
				<Button type="default" @click="deliver_sheet=false">取消</Button>
				<Button type="primary" @click="handleSubmitDeliver">确定</Button>
			</div>
		</Modal>
		
		<!-- 变更时间 -->
		<Modal title="变更时间" v-model="change_sheet" :width="860">
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					受理单ID ：{{tableInfo.billCode || '-'}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20 ">
				<Col span="12" class="isFlexalitem">
					<span style="color: red;">*</span>计划时间 ：
					<DatePicker v-model="sheet_planTime" format="yyyy-MM-dd HH:mm:ss"  @on-change="change_sheet_planTime" type="datetime" :editable="false"  placeholder="请选择" style="flex: 1;"></DatePicker>
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					跟进方式 ：{{tableInfo.followMethodCh || ''}}
				</Col>
			</Row>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					出行方式 ：{{tableInfo.goMethodCh || '-'}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					出行地址 ：{{tableInfo.goAddress || '-'}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					目的地址 ：{{tableInfo.toAddress || '-'}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					联系人 ：{{tableInfo.contactName || '-'}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					跟进事项 ：{{tableInfo.followDesc || '-'}}
				</Col>
			</Row>
			<approve ref="approve_ref_change" :name="7"></approve>
			<div slot="footer">
				<Button type="default" @click="change_sheet=false">取消</Button>
				<Button type="primary" @click="handleSubmitChange">确定</Button>
			</div>
		</Modal>
		
		<!-- 关闭 -->
		<Modal
			title="关闭跟进"
			v-model="close_sheet"
			:width="720"
			:z-index="1000"
			>
			<Form :model="close_model" ref="close_model_ref" :rules="close_model_rule" label-position="left" :label-width="120">
				<Row>
					<Col span="12">
						<FormItem label="拜访开始时间" prop="visitedStartTime">
							<DatePicker v-model="close_model.visitedStartTime"  format="yyyy-MM-dd HH:mm:ss" @on-change="change_close_startTime" type="datetime" :editable="false"  placeholder="请选择" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="拜访结束时间" prop="visitedEndTime">
							<DatePicker v-model="close_model.visitedEndTime"  format="yyyy-MM-dd HH:mm:ss" @on-change="change_close_endTime" type="datetime" :editable="false"  placeholder="请选择" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="是否产生出行费用" prop="isCost" :label-width="150">
							<Switch v-model="close_model.isCost"></Switch>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="情况报告" prop="conditionDesc">
							<Input type="textarea" placeholder="请输入" v-model="close_model.conditionDesc"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="客户意向描述" prop="intentionDescription">
							<Input type="textarea" placeholder="请输入" v-model="close_model.intentionDescription"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="客户交办内容" prop="assignContent">
							<Input type="textarea" placeholder="请输入" v-model="close_model.assignContent"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="计划二次拜访时间" prop="nextTime">
							<DatePicker v-model="close_model.nextTime"  format="yyyy-MM-dd" @on-change="change_close_secondTime" type="date" :editable="false"  placeholder="请选择" style="width: 100%"></DatePicker>
						</FormItem>
					</Col>
					<Col span="12" style="padding-left: 20px;">
						<FormItem label="设置到期提醒" prop="isAlert">
							<Switch v-model="close_model.isAlert"></Switch>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="其他竞品或业务信息描述" prop="contendProductDesc">
							<Input type="textarea" placeholder="请输入" v-model="close_model.contendProductDesc"></Input>
						</FormItem>
					</Col>
				</Row>
				<modalUpLoad ref="close_file_ref" @listenFile="listenFile"></modalUpLoad>
			</Form>
			<div slot="footer">
				<Button type="default" @click="close_sheet=false">取消</Button>
				<Button type="primary" @click="handleSubmitClose">确定</Button>
			</div>
		</Modal>
		
		
	</div>
</template>
<script>
import approve from '_c/approve'
import { queryCurrStaff } from "_s/customer"
import { getCrmTemp } from "_s/approval"
import { getChangePreson,save_follow,list_follow,change_follow_time,change_follow_user,change_follow_abolish,change_follow_close,change_follow_freeze,getInp_biil_id,listContactAndFollow} from '_s/followUp'
import { mapGetters} from 'vuex'
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
			//搜索-翻页参数
			searchForm: {
				billId		  : "",		//受理单ID
				followMethod  : "",		//跟进方式
				nextTime	  : "",		//计划二次拜访时间
				planTime	  : "",		//计划拜访时间
				customerName  : "",		//客户名称
				goMethod	  : "",		//出行方式
				delFlag		  : "",		//跟进单状态
				approveStatus : "",		//审核状态
			},
			pageInfo   : {
				pageLoading   : false,	
				total		  : 0,		//总数
				pageNum 	  : 1, 		// 页数
				pageSize      : 10, 	// 每页显示数量
			},
			
		
			//操作
			actionData : [
				{id:1,name:"关闭"},
				{id:2,name:"转交"},
				{id:3,name:"冻结"},
				{id:4,name:"作废"},
				{id:5,name:"解冻"},
				{id:6,name:"变更时间"}
			],
			
			//公共的下拉选择数据
			folTypeData  	: [],			//跟进方式
			outTypeData	 	: [],			//出行方式
			folOrderData	: [],			//跟进单状态
			approveTypeData : [],			//审批状态
			contactData		: [],			//联系人
			BillIdData		: [],			//受理单关键字搜索数据
			toolData	    : [],			//出行工具
			
			
			//创建跟进表单参数
			add_model_sheet : false,
			add_model : {
				applyBillId : "",			//受理单ID
				contactId   : "",			//联系人ID
				followDesc	: "",			//跟进事项
				followMethod: "",			//跟进方式
				goAddress	: "",			//出发地址
				goMethod	: "",			//出行方式
				planTime	: "",			//计划时间
				toAddress	: "",			//目的地址
				isWayShow   : false,		//如果是面试方式的就是true
			},
			add_model_rule  : {
				applyBillId: [
					{ required: true, message: '请输入受理单ID', trigger: 'change',type:"number" }
				],
				contactId: [
					{ required: true, message: '请选择联系人', trigger: 'change',type:"number" }
				],
				followDesc: [
					{ required: true, message: '请输入跟进事项', trigger: 'blur'}
				],
				followMethod: [
					{ required: true, message: '请选择跟进方式', trigger: 'change' }
				],
				goAddress: [
					{ required: true, message: '请输入出发地址', trigger: 'blur' }
				],
				goMethod: [
					{ required: true, message: '请选择出行方式', trigger: 'change' }
				],
				planTime: [
					{ required: true, message: '请选择计划时间', trigger: 'change'}
				],
				toAddress: [
					{ required: true, message: '请输入目的地址', trigger: 'blur' }
				]
			},
			//变更参数
			change_sheet : false,
			changeInfo   : {},
			sheet_planTime : "",	
			//作废参数
			cause_sheet  : false,
			inpCause	 : "",
			//冻结参数	 
			cold_sheet	 : false,
			inpColdCause : "",
			//转交参数   
			deliver_sheet:false,
			inpDeliverCause : "",
			toLeader : false,
			deId     : "",
			deData	 : [], 
			//关闭参数
			close_sheet : false,
			close_model : {
				assignContent		 : "", //客户交办内容
				conditionDesc		 : "", //情况报告
				contendProductDesc 	 : "", //竞品业务信息描述
				intentionDescription : "", //客户意向描述
				isAlert				 : true, //到期提醒	
				isCost				 : true, //是否产生费用
				nextTime			 : "",	  //计划二次拜访时间
				visitedEndTime	     : "",	  //拜访结束时间
				visitedStartTime	 : "",	  //拜访开始时间
				followFileList		 : []
			},
			close_model_rule: {
				conditionDesc: [
					{ required: true, message: '请输入情况报告', trigger: 'blur'}
				],
				intentionDescription: [
					{ required: true, message: '请输入客户意向描述', trigger: 'blur' }
				],
				nextTime: [
					{ required: true, message: '请选择计划二次拜访时间', trigger: 'change' }
				],
				visitedEndTime: [
					{ required: true, message: '请选择计划拜访结束时间', trigger: 'change'}
				],
				visitedStartTime: [
					{ required: true, message: '请选择计划拜访开始时间', trigger: 'change' }
				]
			},
			//列表数据
			followListData: [],
			followListTitle: [
				{
					title: '序号',
					type : "index",
					resizable: true,
					width: 80,
					align: 'center'
				},
				{
					title: '跟进单编号',
					key: 'followNo',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '创建人',
					key: 'createByName',
					resizable: true,
					width: 200,
					align: 'center'
				},
				{
					title: '受理单编号',
					key: 'billCode',
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
					key: 'followStep',
					resizable: true,
					width: 150,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.followName || "-")
					}
				},
				{
					title: '计划时间',
					key: 'planTime',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '跟进方式',
					key: 'followMethodCh',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '出行方式',
					key: 'intentionProduct',
					resizable: true,
					width: 150,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.goMethodCh || "-")
					}
				},
				{
					title: '出发地址',
					key: 'visitedContent',
					resizable: true,
					width: 150,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.goAddress || "-")
					}
				},
				{
					title: '目的地址',
					key: 'intentionDescription',
					resizable: true,
					width: 150,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.toAddress || "-")
					}
				},
				{
					title: '联系人',
					key: 'contactName',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '跟进事项',
					key: 'followDesc',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '拜访开始时间',
					key: 'visitedStartTime',
					resizable: true,
					width: 250,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.visitedStartTime || "-")
					}
				},
				{
					title: '拜访结束时间',
					key: 'visitedEndTime',
					resizable: true,
					width: 250,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.visitedEndTime || "-")
					}
				},
				{
					title: '是否产生费用',
					key: 'trafficTool',
					resizable: true,
					width: 150,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.isCost?'是':'否')
					}
				},
				{
					title: '情况报告',
					key: 'conditionDesc',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '客户意向描述',
					key: 'intentionDesc',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '客户交办内容',
					key: 'assignContent',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '计划二次拜访时间',
					slot : 'nextTime',
					resizable: true,
					width: 250,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.nextTime || '-')
					}
				},
				{
					title: '到期提醒',
					key: 'isAlert',
					resizable: true,
					width: 150,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.isAlert?'是':'否')
					}
				},
				{
					title: '其他竞品或业务信息描述',
					slot: 'contendProductDesc',
					resizable: true,
					width: 250,
					align: 'center',
					render:(h,params)=>{
						return h('div',{},
						params.row.contendProductDesc || '-')
					}
				},
				{
					title: '附件',
					slot: 'file_tow',
					key : 'followFileList',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '跟进状态',
					key: 'delFlagCh',
					resizable: true,
					width: 150,
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
					width: 280,
					// align: 'center',
					fixed: 'right',
					slot : "action"
				}
			],
			//详情当条数据
			tableInfo : ""
		}
	},
	created() {
		this.folTypeData = this.filterDict(this.config,'visit_way');	//跟进方式
		this.outTypeData = this.filterDict(this.config,'traffic_tool');	//出行方式
		this.folOrderData = this.filterDict(this.config,'follow_bill_status');	//跟进单状态
		this.approveTypeData = this.filterDict(this.config,'crm_approval_status');//审批状态
		this.getChangePresonInit();
	},
	mounted(){
		this.getFollowList();
		
		//审批人数据
		this.initApprove();
	},
	methods: {
	async initApprove(){
			queryCurrStaff().then(res => {
				this.$refs['approve_ref'].setData_mount(res.data);
				this.$refs['approve_ref_change'].setData_mount(res.data);
				this.$refs['approve_ref_deliver'].setData_mount(res.data);
			})
			await getCrmTemp({ formName: 7 }).then(res => {
				if (res.code === 200) {
					this.$refs['approve_ref'].setData_init(res);
					this.$refs['approve_ref_change'].setData_init(res);
					this.$refs['approve_ref_deliver'].setData_init(res);
				}
			})
		},
		//获取转移成员数据
		getChangePresonInit(){
			getChangePreson().then(res=>{
				this.deData = res.data;
			})
		},
		//搜素选择事件
		change_nextTime(e){ //选择二次拜访丝事件
			this.searchForm.nextTime = e;
		},
		change_planTime(e){ //计划时间
			this.searchForm.planTime = e;
		},
		//表单选择事件
		change_form_planTime(e){ //选择计划时间
			this.add_model.planTime = e;
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
			listContactAndFollow(str[0].customerId).then(res=>{
				this.contactData = res.data.listContact;
			})
		},
		onClearBill(){
			this.contactData = [];
			this.$refs['ref_contact'].clearSingleSelect();
		},
		
		//选择变更弹窗里面的时间
		change_sheet_planTime(e){
			this.sheet_planTime = e;
		},
		//列表操作按钮事件
		changeBtn(id,dataID,data){
			this.changeInfo.id = dataID;
			if(id==1){	//关闭
				this.$refs['close_model_ref'].resetFields();
				this.$refs['close_file_ref'].changeData([]);
				this.close_model.followFileList = [];
				this.close_sheet = true;
			}else if(id==2){//转交
				this.$refs.approve_ref_deliver.clearData();
				this.inpDeliverCause = "";
				this.$refs['deliver_ref'].clearSingleSelect();
				this.deliver_sheet = true;
			}else if(id==3){//冻结
				this.inpColdCause = "";
				this.cold_sheet = true; 
			}else if(id==4){//作废
				this.inpCause = "";
				this.cause_sheet = true;
			}else if(id==5){//解冻
				this.unFree()
			}else if(id==6){//打开变更
				this.$refs.approve_ref_change.clearData();
				this.sheet_planTime = "";
				this.tableInfo = data;
				this.change_sheet = true;
				console.log(": " + JSON.stringify(this.tableInfo));
			}
		},
		//选择转交的radio
		changeRadio_de(){
			this.toLeader =!this.toLeader
		},
		//作废确定事件
		handleSubmitCause() {
			if(this.inpCause==''){
				this.$Message.error("请输入作废原因！")
				return
			}
			const param = {
				handleReason : this.inpCause,
				id			 : this.changeInfo.id
			}
			this.$util.checkIsAgain(()=>{
				console.log("param: " + JSON.stringify(param));
				change_follow_abolish(param).then(res=>{
					this.cause_sheet = false;
					this.$Message.success(res.msg)
					this.clearInitData();
				})
			})
		},
		//冻结确定事件 
		handleSubmitCold() {
			if(this.inpColdCause==''){
				this.$Message.error("请输入冻结原因！")
				return
			}
			this.$util.checkIsAgain(()=>{
				const param = {
					handleReason : this.inpCause,
					id			 : this.changeInfo.id
				}
				change_follow_freeze(param).then(res=>{
					this.cold_sheet = false;
					this.$Message.success(res.msg)
					this.clearInitData();
				})
			})
		},
		//解冻确定事件
		unFree(){
			var _this = this;
			this.$Modal.confirm({
				title: "确定解冻当前跟进吗？",
				cancelText : "取消",
				onOk(){
					const param = {
						id	: _this.changeInfo.id
					}
					change_follow_freeze(param).then(res=>{
						_this.$Message.success('解冻成功')
						_this.clearInitData();
					})
				}
			});
		},
		//关闭选择时间
		change_close_startTime(e){
			this.close_model.visitedStartTime = e;
		},
		change_close_endTime(e){
			this.close_model.visitedEndTime = e;
		},
		change_close_secondTime(e){
			this.close_model.nextTime = e;
		},
		//附件
		listenFile(e){
			this.close_model.followFileList = e;
		},
		//转交确定事件
		handleSubmitDeliver() {
			if(this.inpDeliverCause==''){
				this.$Message.error("请输入转交原因！")
				return
			}
			if(this.deId==""){
				this.$Message.error("请选择一位转交成员！")
				return
			}
			//校验审批
			var roveInfo =  this.$refs.approve_ref_deliver.check_role();
			if(roveInfo==-1){
				return
			}
			this.$util.checkIsAgain(()=>{
				const param = {
					handleReason : this.inpDeliverCause,
					id			 : this.changeInfo.id,
					toLeader	 : this.toLeader,
					followId	 : this.deId,
					
					//审批参数
					approvalTempId : roveInfo.approvalTempId,
					approvalUserIds: roveInfo.approvalUserIds,
					examineUserIds : roveInfo.examineUserIds,
					ccUserIds	   : roveInfo.ccUserIds,
					leaveMessage   : roveInfo.leaveMessage
				}
				change_follow_user(param).then(res=>{
					this.deliver_sheet = false;
					this.$Message.success(res.msg)
					this.clearInitData();
				})
			})
		},
		//变更确定事件
		handleSubmitChange(){
			if(this.sheet_planTime==''){
				this.$Message.error("请选择变更时间！")
				return
			}  
			//校验审批
			var roveInfo =  this.$refs.approve_ref_change.check_role();
			if(roveInfo==-1){
				return
			}
			this.$util.checkIsAgain(()=>{
				const param = {
					id             : this.changeInfo.id,		
					planTime	   : this.sheet_planTime,
					//审批参数
					approvalTempId : roveInfo.approvalTempId,
					approvalUserIds: roveInfo.approvalUserIds,
					examineUserIds : roveInfo.examineUserIds,
					ccUserIds	   : roveInfo.ccUserIds,
					leaveMessage   : roveInfo.leaveMessage
				}
				change_follow_time(param).then(res=>{
					this.change_sheet = false;
					this.$Message.success(res.msg)
					this.clearInitData();
				})
			})
		},
		//关闭
		handleSubmitClose(){
			this.$refs['close_model_ref'].validate((valid) => {
				if(valid) {
					if(this.close_model.visitedStartTime>this.close_model.visitedEndTime){
						this.$Message.error('开始时间不能大于结束时间');
						return
					}
					if(this.close_model.nextTime<this.close_model.visitedEndTime){
						this.$Message.error('二次拜访时间不能小于结束时间');
						return
					}
					this.$util.checkIsAgain(()=>{
						const param = {
							id					 : this.changeInfo.id,
							assignContent		 : this.close_model.assignContent, //客户交办内容
							conditionDesc		 : this.close_model.conditionDesc, //情况报告
							contendProductDesc 	 : this.close_model.contendProductDesc, //竞品业务信息描述
							intentionDescription : this.close_model.intentionDescription, //客户意向描述
							isAlert				 : this.close_model.isAlert, //到期提醒	
							isCost				 : this.close_model.isCost, //是否产生费用
							nextTime			 : this.close_model.nextTime,	  		//计划二次拜访时间
							visitedEndTime	     : this.close_model.visitedEndTime,	    //拜访结束时间
							visitedStartTime	 : this.close_model.visitedStartTime,	//拜访开始时间
							followFileList		 : this.close_model.followFileList
						}
						change_follow_close(param).then(res=>{
							this.close_sheet = false;
							this.$Message.success(res.msg)
							this.clearInitData();
						})
					})
				}
			})
		},
		//确定跟进事件
		handleSubmit() {
			this.$refs['add_model_ref'].validate((valid) => {
				if(valid) {
					this.send_add_api();
				}
			})
		},
		//新增跟进
		send_add_api(){
			//校验审批
			var roveInfo =  this.$refs.approve_ref.check_role();
			if(roveInfo==-1){
				return
			}
			this.$util.checkIsAgain(()=>{
				const param = {
					applyBillId : this.add_model.applyBillId,		//受理单ID
					contactId   : this.add_model.contactId,			//联系人ID
					followDesc	: this.add_model.followDesc,		//跟进事项
					followMethod: this.add_model.followMethod,		//跟进方式
					goAddress	: this.add_model.goAddress,			//出发地址
					goMethod	: this.add_model.goMethod,			//出行方式
					planTime	: this.add_model.planTime,			//计划时间
					toAddress	: this.add_model.toAddress,			//目的地址
					
					//审批参数
					approvalTempId : roveInfo.approvalTempId,
					approvalUserIds: roveInfo.approvalUserIds,
					ccUserIds	   : roveInfo.ccUserIds,
					examineUserIds : roveInfo.examineUserIds,
					leaveMessage   : roveInfo.leaveMessage
				}
				console.log("param: " + JSON.stringify(param));
				save_follow(param).then(res=>{
					this.add_model_sheet = false;
					this.$Message.success(res.msg);
					this.clearInitData();
				})
			})
		},
		
		// 获取列表数据
		getFollowList() {
			const param = {
				applyBillCode  : this.searchForm.billId || '',
				approveStatus  : this.searchForm.approveStatus || '',
				customerName   : this.searchForm.customerName  || '',
				delFlag		   : this.searchForm.delFlag || '',
				followMethod   : this.searchForm.followMethod || '',
				goMethod	   : this.searchForm.goMethod,
				masterDeptId   : this.searchForm.startDate,
				nextTime   	   : this.searchForm.nextTime,
				planTime	   : this.searchForm.planTime,
				pageNum	       : this.pageInfo.pageNum,
				pageSize	   : this.pageInfo.pageSize
			}
			list_follow(param).then(res=>{
				if(res.code==200){
					this.followListData = res.rows;
					this.pageInfo.total = res.total;
				}
			})
		},
		//重置数据
		clearInitData(){
			this.pageInfo.pageNum = 1;
			this.pageInfo.pageSize = 10;
			this.getFollowList();
		},
		// 打开新增跟进弹框
		openFollowDialog() {
			this.add_model.isWayShow = false;
			this.add_model_sheet = true;
			this.$refs.approve_ref.clearData();
			this.$refs['add_model_ref'].resetFields();
		},
		// 关闭新增跟进弹框
		handleCancel() {
			this.add_model_sheet = false
		},
		// 搜索
		handleSearch() {
			this.getFollowList();
		},
		// 清空搜索
		handleReset() {
			this.$refs["searchForm_ref"].resetFields();
			this.getFollowList();
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.pageNum = pages
			this.getFollowList()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.getFollowList()
		}
	}
}
</script>
<style lang="scss" scoped></style>