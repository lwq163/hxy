<template>
	<div class="organization">
		<tab-menu></tab-menu>
		<div class="part-content hxy-font-size-14">
			<div class="left-box fl">
				<Tabs type="card" @on-click="selectTab">
					<TabPane label="组织架构">
						<div style="min-height: 500px;" v-if="orgList.length>0">
							<tree-select ref="org" value-consists-of="ALL" :normalizer="normalizer1" :clearable="true" v-model="deptId" :options="orgList"  :show-count="true" :always-open="true" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择组织架构" @select="selectOrg" />
						</div>
					</TabPane>
					<TabPane label="职能" v-if="false">
						<div style="min-height: 500px;">
							<div style="min-height: 500px;" v-if="postList.length>0">
								<tree-select value-consists-of="ALL" :normalizer="normalizer2" :clearable="true" v-model="postId" :options="postList"  :show-count="true" :always-open="true" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择职能" @select="selectPost" />
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
			<div class="right-box">
				<div v-if="tabIdx==0">
					<div class="hxy-font-size-16 hxy-mb-10">
						<strong>当前所在架构位置</strong>
					</div>
					<div class="hxy-font-size-14 hxy-mb-20">
						{{breadList.length==0?orgList[0].name:breadList}}
					</div>
					<div class="hxy-mb-30">
						<Button type="primary" ghost class="hxy-mr-10" @click="openUserDept" v-hasPermi="['system:userDept:add']">添加成员</Button>
						<Button type="default" :disabled="multiple" class="hxy-mr-10" @click="openChangeDept" v-hasPermi="['system:userDept:change']">调整部门</Button>
					</div>
					<div class="hxy-mb-25">
						<Table stripe border :columns="epmTitleData" :data="epmListData" :loading="pageLoading" @on-selection-change="selectChangeDeptUser"></Table>
					</div>
					<div class="pos-r tr">
						<Page :total="orgData.total" :page-size="orgData.pageSize" :current="orgData.page" placement="top" show-total show-sizer show-elevator @on-change="changeOrgPage" @on-page-size-change="changeOrgPageSize"></Page>
					</div>
				</div>
				<div v-if="tabIdx==1">
					<div class="hxy-font-size-16 hxy-mb-30">
						<strong>当前职能名称：{{postName}}</strong>
					</div>
					<div class="hxy-mb-30">
						<Button type="primary" ghost class="hxy-mr-10" @click="openAddPostUser" v-hasPermi="['system:post:staffAdd']">添加成员</Button>
					</div>
					<div class="hxy-mb-25">
						<Table stripe border :columns="postStaffTitleData" :data="postStaffListData" :loading="pageLoading" @on-selection-change="selectChangePostUser"></Table>
					</div>
					<div class="pos-r tr">
						<Page :total="postData.total" :page-size="postData.pageSize" :current="postData.page" placement="top" show-total show-sizer show-elevator @on-change="changePostPage" @on-page-size-change="changePostPageSize"></Page>
					</div>
				</div>
			</div>
		</div>

		<!-- 组织架构新增/编辑员工 -->
		<Modal
			:title="title"
			v-model="addUserDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="addUserForm" ref="addUserForm" :rules="rulesAddUser" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="姓名" prop="staffName">
							<Input type="text" v-model="addUserForm.staffName" placeholder="请输入姓名"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="手机" prop="phone">
							<Input type="text" v-model="addUserForm.phone" placeholder="请输入手机"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="邮箱" prop="email">
							<AutoComplete v-model="addUserForm.email" placeholder="请输入邮箱" @on-search="selectEmail">
								<Option v-for="item in emailArr" :value="item" :key="item">{{ item }}</Option>
							</AutoComplete>
						</FormItem>
					</Col>
					<!-- <Col span="24">
						<FormItem label="直属部门" prop="directDeptId">
							<Select v-model="addUserForm.directDeptId" placeholder="请选择直属部门" clearable filterable>
								<Option v-for="(val,index) in deptList" :value="val.deptId" :key="index">{{val.deptName}}</Option>
							</Select>
						</FormItem>
					</Col> -->
					<Col span="24">
						<FormItem label="直属部门" prop="deptId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer" :clearable="true" v-model="addUserForm.deptId" :options="deptListData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择部门" @input="selectAddDept" />
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="直属主管" prop="directEmployeeId">
							<Select v-model="addUserForm.directEmployeeId" placeholder="请选择直属主管" clearable filterable>
								<Option v-for="(val,index) in employeeList" :value="val.id" :key="index">{{val.staffName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="职能" prop="postId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer2" :clearable="true" v-model="addUserForm.postId" :options="postList"  :show-count="true" :disable-branch-nodes="true" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择职能"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="对外职位" prop="outPostType">
							<RadioGroup v-model="addUserForm.outPostType" style="display:flex;">
								<Radio label='1'>与内部职位同步</Radio>
								<Radio label='2'>设置专属对外职位</Radio>
								<Input v-show="addUserForm.outPostType=='2'" type="text" v-model="addUserForm.outPostName" placeholder="请输入对外职位名称"/>
							</RadioGroup>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="工号" prop="jobNumber">
							<Input type="text" v-model="addUserForm.jobNumber" placeholder="请输入工号"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="分机号" prop="telephone">
							<Input type="text" v-model="addUserForm.telephone" placeholder="请输入分机号"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="办公地点" prop="workPlace">
							<Input type="text" v-model="addUserForm.workPlace" placeholder="请输入办公地点"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="员工类型" prop="type">
							<Select v-model="addUserForm.type" placeholder="请选择员工类型" clearable filterable>
								<Option v-for="(val,index) in employeeTypeList" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="员工状态" prop="status">
							<Select v-model="addUserForm.status" placeholder="请选择员工状态" clearable filterable>
								<Option v-for="(val,index) in employeeStatusList" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="备注" prop="remark">
							<Input type="text" v-model="addUserForm.remark" placeholder="请输入备注"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="高管模式" prop="topModel">
							<RadioGroup v-model="addUserForm.topModel">
								<Radio label='1'>开</Radio>
								<Radio label='0'>关</Radio>
							</RadioGroup>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="handleSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 组织架构调整部门 -->
		<Modal
			:title="title"
			v-model="changeDeptDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="changeDeptForm" ref="changeDeptForm" :rules="rulesChangeDept" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="部门名称" prop="deptIds">
							<tree-select value-consists-of="BRANCH_PRIORITY" :normalizer="normalizer" :clearable="true" v-model="changeDeptForm.deptIds" :options="deptListData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择部门" @input="selectDept" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="changeDeptSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 职能添加成员 -->
		<Modal
			:title="title"
			v-model="addPostUserDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="addPostUserForm" ref="addPostUserForm" :rules="rulesAddPostUser" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="成员" prop="userIds">
							<Select v-model="addPostUserForm.userIds" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择成员" clearable filterable>
								<Option v-for="(val,index) in employeeList" :value="val.id" :key="index">{{val.staffName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="addPostUserSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 员工详情 -->
		<Modal
			:title="title"
			v-model="detailDialog"
			:mask-closable="false"
			:width="580">
			<Spin size="large" fix v-if="modalLoading"></Spin>
			<div>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						姓名：{{employeeDataDetail.staffName || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						手机：{{employeeDataDetail.phone || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						邮箱：{{employeeDataDetail.email || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						部门：{{employeeDataDetail.deptName||''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						直属主管：{{employeeDataDetail.directEmployeeName || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						职能：{{employeeDataDetail.postName}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						对外职位：{{employeeDataDetail.outPostType=='1'?'与内部职位同步':'设置专属对外职位'}}
						<span class="hxy-pl-20" v-if="employeeDataDetail.outPostType=='2'">{{employeeDataDetail.outPostName}}</span>
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						工号：{{employeeDataDetail.jobNumber || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						分机号：{{employeeDataDetail.telephone || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						办公地点：{{employeeDataDetail.workPlace || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						员工类型：{{ employeeDataDetail.type?employeeTypeList.filter(item=>item.value==employeeDataDetail.type)[0].label : ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						员工状态：{{ employeeDataDetail.status?employeeStatusList.filter(item=>item.value==employeeDataDetail.status)[0].label : ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col>
						备注：{{employeeDataDetail.remark || ''}}
					</Col>
				</Row>
			</div>
			<div slot="footer">
				<Button type="default" @click="detailDialog = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
import util from '_m/util'
import { mapGetters } from 'vuex'
import {getOrgList,getEmployeeList,getQueryDeptList,getEmpList, postAddEmployee,postEditEmployee,getQueryEmployee,postChangeDept,getPostList,getPostStaffList,postStaffAdd} from '_s/organization'
import {getDeptEmpList} from '_s/department'
export default {
	data() {
		return {
			allList: [],
			orgData: {
				page: 1,
				pageSize: 10,
				total: 0,
			},
			pageLoading: false,//页面loading动画
			btnLoading: false,
			tabIdx: 0,
			curTabIdx: 0,
			level: '1',
			deptId: undefined,
			deptName: '',
			orgList: [],
			deptList: [],
			changeDeptList: [],
			epmTitleData: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					key: 'id',
					tooltip: true,
					resizable: true,
					width: 80
				},
				{
					title: '姓名',
					key: 'staffName',
					resizable: true,
					width: 200
				},
				{
					title: '职能',
					key: 'postName',
					resizable: true,
					width: 200
				},
				{
					title: '工号',
					key: 'jobNumber',
					resizable: true,
					width: 150
				},
				{
					title: '手机',
					key: 'phone',
					resizable: true,
					width: 200
				},
				{
					title: '邮箱',
					key: 'email',
					resizable: true,
				},
				{
					title:'操作',
					key:'action',
					width: 150,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.toEdit(params.row)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.toDetail(params.row)
									}
								}
							}, '详情')
						])
					}
				}
			],
			epmListData: [],
			employeeTypeList: [],
			employeeStatusList: [],
			employeeDataDetail: {},
			detailDialog: false,
			modalLoading: false,
			ids: [],
			single: true,
			multiple: true,
			title: '',
			addUserDialog: false,
			addUserForm: {
				id: null,
				staffName: '',
				phone: '',
				email: '',
				deptId: undefined,
				deptName: '',
				directEmployeeId: '',
				postId: undefined,
				outPostType: '',
				outPostName: '',
				jobNumber: '',
				telephone: '',
				workPlace: '',
				type: '',
				status: '',
				remark: '',
				topModel: ''
			},
			rulesAddUser: {
				staffName: [
					{ required: true, message: '请输入姓名', trigger: 'blur'}
				],
				phone: [
					{ required: true, message: '请输入手机号码', trigger: 'blur'},
					{ type: 'string',pattern: /^[1][3-9][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ type: 'string', pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '请输入正确的邮箱', trigger: 'blur'}
				],
				deptId: [
					{ required: true, type: 'number', message: '请选择部门', trigger: 'change'}
				],
				// directEmployeeId: [
				// 	{ required: true, type: 'number', message: '请选择直属主管', trigger: 'change'}
				// ],
				telephone: [
					{ type: 'string', pattern: /^([0-9]{3,4})?[0-9]{7,8}$/, message: '请输入正确的电话号码(区号+电话号码,例:0571********)', trigger: 'blur'}
				]
			},
			employeeList: [],
			postList: [],
			postData: {
				page: 1,
				pageSize: 10,
				total: 0,
			},
			postId: undefined,
			postName: '',
			postStaffTitleData: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					key: 'userId',
					tooltip: true,
					resizable: true,
					width: 80
				},
				{
					title: '姓名',
					key: 'nickName',
					resizable: true,
					width: 200
				},
				{
					title: '部门',
					key: 'deptName',
					resizable: true,
				},
				{
					title: '工号',
					key: 'jobNum',
					resizable: true,
					width: 200
				}
			],
			postStaffListData: [],
			userIds: [],
			changeDeptDialog: false,
			changeDeptForm: {
				deptIds: undefined,
			},
			rulesChangeDept: {
				deptIds: [
					{ required: true, type: 'number', message: '请选择调整的部门', trigger: 'change' }
				]
			},
			addPostUserDialog: false,
			addPostUserForm: {
				userIds: []
			},
			rulesAddPostUser: {
				userIds: [{ required: true, type: 'array', message: '请选择成员', trigger: 'change' }]
			},
			deptListData: [],
			emailArr: [],
			breadList:[],     //面包屑数组
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
		})
	},
	created() {},
	mounted() {
		this.getOrgListData()
		// this.getQueryDeptListData()
		this.getDeptEmpListData()
		this.getPostListData()
		this.employeeTypeList = this.filterDict(this.config,'employee_type')
		this.employeeStatusList = this.filterDict(this.config,'employee_status')
	},
	methods: {
		// 查询当前企业部门成员
		getEmpListData(id,level) {
			this.pageLoading = true
			let params = {
				queryId: id,
				type: level,
				pageNum: this.orgData.page,
				pageSize: this.orgData.pageSize
			}
			getEmpList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.epmListData = res.rows
					this.epmListData.forEach((value,index) => {
						this.epmListData[index].postName = value.postId?util.getIdData(this.postList,'postId',value.postId).postName:''
					})
					this.orgData.total =  res.total
					this.getEmployeeListData()
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 自定义部门键值
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.deptId,
				label: node.deptName,
				children: node.children,
				isDefaultExpanded: true
			}
		},
		// 查询当前企业部门
		getDeptEmpListData() {
			this.pageLoading = true
			let masterDeptId = parseInt(util.getStorage('masterDeptId'))
			getDeptEmpList(masterDeptId).then(res => {
				if(res.code===200) {
					this.deptListData = []
					this.pageLoading = false
					this.deptListData.push(res.data)
					util.setArr(this.deptListData)
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 添加员工---选择指定部门
		selectAddDept(e) {
			this.addUserForm.deptId = e
			if(this.addUserForm.deptId != undefined) {
				this.$nextTick(() => {
					this.$refs['addUserForm'].validateField('deptId')
				})
			}
		},
		// 根据企业id查询企业下的部门列表
		getQueryDeptListData() {
			let masterDeptId = util.getStorage('masterDeptId')
			getQueryDeptList(masterDeptId).then(res => {
				if(res.code===200) {
					this.deptList = res.data
				}
			}).catch(err => {})
		},
		// 查询企业下的员工列表
		getEmployeeListData() {
			let masterDeptId = util.getStorage('masterDeptId')
			getEmployeeList(masterDeptId).then(res => {
				if(res.code===200) {
					this.employeeList = res.data
				}
			}).catch(err => {})
		},
		// 查询组织架构列表
		getOrgListData() {
			let masterDeptId = parseInt(util.getStorage('masterDeptId'))
			getOrgList(masterDeptId).then(res => {
				if(res.code===200) {
					let val = JSON.parse(JSON.stringify(res.data))
					this.orgList = util.arrayTreeSetLevel(val)
					this.deptId = val[0].id
					this.level = val[0].level
					this.deptName = util.getIdData(this.orgList,'id',this.deptId).name
					setTimeout(() => {
						this.getEmpListData(this.deptId,this.level)
					},300)
				}
			})
		},
		// 切换tab
		selectTab(e) {
			this.tabIdx = e
			if(this.tabIdx!=this.curTabIdx) {
				this.resetData()
				this.curTabIdx = e
			}
			console.log('切换',this.ids,this.userIds,this.multiple)
		},
		// 选择组织架构
		selectOrg(e) {
			this.resetData()
			this.deptId = e.id
			this.level = e.level
			this.deptName = e.name
			this.orgData.page = 1
			this.getEmpListData(this.deptId,this.level)
			
			// 面包屑
			let tree = this.$refs['org']
			let breadLabel = tree.getNode(e.id).nestedSearchLabel.split(/[ ]+/)
			this.breadList = breadLabel.join(' > ')
		},
		// 选择职能
		selectPost(e) {
			this.resetData()
			if(!e.first) {
				this.postId = e.postId
				this.postName = e.postName
				this.getPostStaffListData(this.postId)
			}
		},
		// 解决切换组织或tab清空的数据
		resetData() {
			this.ids = []
			this.userIds = []
			this.multiple = true
			this.single = true
		},
		// 查询职能列表
		getPostListData() {
			let params = {
				masterDeptId: util.getStorage('masterDeptId')
			}
			getPostList(params).then(res => {
				if(res.code===200) {
					let data = res.data
					this.postList = data
					this.postList.forEach((value,index) => {
						this.postList[index].first = true
					})
					this.postId = this.postList[0].children[0].postId
					this.postName = this.postList[0].children[0].postName
					this.getPostStaffListData(this.postId)
				}
			})
		},
		// 组织架构自定义键值
		normalizer1(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.id,
				label: node.name,
				children: node.children,
				isDefaultExpanded: true
			}
		},
		// 职能自定义键值
		normalizer2(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.postId,
				label: node.postName,
				children: node.children,
				isDefaultExpanded: true
			}
		},
		// 打开组织架构新增员工对话框
		openUserDept() {
			this.resetForm()
			this.title = '新增员工'
			this.addUserDialog = true
		},
		// 邮箱提醒
		selectEmail(value) {
			this.emailArr = util.emailArr(value)
			if(value != undefined) {
				this.$nextTick(() => {
					this.$refs['addUserForm'].validateField('email')
				})
			}
		},
		// 根据id查询员工详情
		getQueryEmployeeData(id) {
			getQueryEmployee(id).then(res => {
				if(res.code===200) {
					let val = JSON.parse(JSON.stringify(res.data))
					this.addUserForm = val
					this.employeeDataDetail = val
					this.employeeDataDetail.postName = val.postId?util.getIdData(this.postList,'postId',val.postId).postName:''
					let employeeArr = this.employeeList.filter(item=>item.id==val.directEmployeeId)
					this.employeeDataDetail.directEmployeeName = employeeArr.length>0?employeeArr[0].staffName:''
				}
			})
		},
		// 打开组织架构编辑员工对话框
		toEdit(data) {
			this.resetForm()
			this.title = '编辑员工'
			this.addUserDialog = true
			this.addUserForm.id = data.id
			this.getQueryEmployeeData(this.addUserForm.id)
		},
		// 详情
		toDetail(data) {
			this.title = '员工详情'
			this.detailDialog = true
			this.getQueryEmployeeData(data.id)
		},
		// 组织架构提交新增/编辑员工
		handleSubmit() {
			this.btnLoading = true
			this.$refs['addUserForm'].validate((valid) => {
				if(valid) {
					let params = {
						id: this.addUserForm.id,
						masterDeptId: util.getStorage('masterDeptId'),
						staffName: this.addUserForm.staffName,
						phone: this.addUserForm.phone,
						email: this.addUserForm.email,
						deptId: this.addUserForm.deptId,
						directEmployeeId: this.addUserForm.directEmployeeId,
						postId: this.addUserForm.postId,
						outPostType: this.addUserForm.outPostType,
						outPostName: this.addUserForm.outPostName,
						jobNumber: this.addUserForm.jobNumber,
						telephone: this.addUserForm.telephone,
						workPlace: this.addUserForm.workPlace,
						type: this.addUserForm.type,
						status: this.addUserForm.status,
						remark: this.addUserForm.remark,
						topModel: this.addUserForm.topModel,
					}
					if(this.addUserForm.id) {
						console.log('更新',params)
						postEditEmployee(params).then(res => {
							if(res.code===200) {
								this.addUserDialog = false
								this.getEmpListData(this.deptId,this.level)
								this.multiple = true
								this.single = true
								this.$Message.success(res.msg)
							}else{
								this.$Message.error(res.msg)
							}
						}).catch(err => {
							this.btnLoading = false
						})
					}else {
						console.log('新增',params)
						postAddEmployee(params).then(res => {
							if(res.code===200) {
								this.addUserDialog = false
								this.getEmpListData(this.deptId,this.level)
								this.multiple = true
								this.single = true
								this.$Message.success(res.msg)
							}else{
								this.$Message.error(res.msg)
							}
						}).catch(err => {
							this.btnLoading = false
						})
					}					
				}else {
					this.btnLoading = false
				}
			})
		},
		// 打开调整部门对话框
		openChangeDept() {
			this.resetForm()
			this.title = '调整部门'
			this.changeDeptDialog = true
		},
		// 选择调整部门
		selectDept(e) {
			this.changeDeptForm.deptIds = e
			if(this.changeDeptForm.deptIds != undefined) {
				this.$nextTick(() => {
					this.$refs['changeDeptForm'].validateField('deptIds')
				})
			}
		},
		// 提交调整部门
		changeDeptSubmit() {
			this.btnLoading = true
			this.$refs['changeDeptForm'].validate((valid) => {
				if(valid) {
					let params = {
						ids: this.ids,
						deptList: this.changeDeptForm.deptIds,
					}
					console.log('params',params)
					postChangeDept(params).then(res => {
						this.changeDeptDialog = false
						this.multiple = true
						this.single = true
						this.getEmpListData(this.deptId,this.level)
						this.$Message.success(res.msg)
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 根据岗位查询人员列表
		getPostStaffListData(id) {
			this.pageLoading = true
			let params = {
				postId: id,
				pageNum: this.postData.page,
				pageSize: this.postData.pageSize
			}
			getPostStaffList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.postStaffListData = res.rows
					this.postData.total =  res.total
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 多选框选中数据(组织架构)
		selectChangeDeptUser(selection) {
			this.ids = selection.map(item => item.id)
			this.single = selection.length!==1
			this.multiple = !selection.length
			console.log('组织架构',this.ids,this.userIds,this.multiple)
		},
		// 多选框选中数据(职能)
		selectChangePostUser(selection) {
			this.userIds = selection.map(item => item.userId)
			this.single = selection.length!==1
			this.multiple = !selection.length
			console.log('职能',this.ids,this.userIds,this.multiple)
		},
		// 打开职能添加成员弹出窗口
		openAddPostUser() {
			this.resetForm()
			this.title = '添加成员'
			this.addPostUserDialog = true
		},
		// 职能提交添加成员
		addPostUserSubmit() {
			this.btnLoading = true
			this.$refs['addPostUserForm'].validate((valid) => {
				if(valid) {
					let params = {
						postId: this.postId,
						userIds: this.addPostUserForm.userIds
					}
					postStaffAdd(params).then(res => {
						this.addPostUserDialog = false
						this.getPostStaffListData(this.postId)
						this.$Message.success(res.msg)
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 关闭弹窗
		closeDialog() {
			this.addUserDialog = false
			this.changeDeptDialog = false
			this.detailDialog = false
			this.addPostUserDialog = false
		},
		// 清空
		resetForm() {
			this.addUserForm.id = null
			this.addUserForm.outPostName = ''
			this.btnLoading = false
			this.$refs['addUserForm'].resetFields()
			this.$refs['changeDeptForm'].resetFields()
			this.$refs['addPostUserForm'].resetFields()
		},
		maxTag(num) {
			return 'more '+ num;
		},
		// 当前页面(组织架构)
		changeOrgPage(pages) {
			this.orgData.page = pages
			this.getEmpListData(this.deptId,this.level)
		},
		// 每页显示条数(组织架构)
		changeOrgPageSize(size) {
			this.orgData.pageSize = size
			this.getEmpListData(this.deptId,this.level)
		},
		// 当前页面(组织架构)
		changePostPage(pages) {
			this.postData.page = pages
			this.getPostStaffListData(this.postId)
		},
		// 每页显示条数(组织架构)
		changePostPageSize(size) {
			this.postData.pageSize = size
			this.getPostStaffListData(this.postId)
		}
	}
}
</script>
<style lang="scss" scoped>
	.organization {
		.part-content {
			width: 100%;
			zoom: 1;
			overflow: hidden;
			.left-box {
				width: 300px;
				margin-right: 50px;
				.btn-list {
					display: flex;
					justify-content: space-between;
				}
			}
			.right-box {
				zoom: 1;
				overflow: hidden;
			}
		}
	}
</style>
