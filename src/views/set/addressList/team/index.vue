<template>
	<div class="team">
		<tab-menu></tab-menu>
		<div class="hxy-mb-25">
			<Button class="hxy-mr-10" type="primary" ghost @click="createTeam">创建企业</Button>
			<Button class="hxy-mr-10" type="default" @click="openAddTeam">加入企业</Button>
			<Button type="default" @click="openApplyDialog">申请人列表</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="teamTitle" :data="teamData" :loading="pageLoading"></Table>
		</div>
		<!-- <div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div> -->

		<!-- 创建企业 -->
		<Modal
			:title="title"
			v-model="teamDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="teamForm" ref="teamForm" :rules="rulesTeam" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="企业名称" prop="deptName">
							<Input type="text" v-model="teamForm.deptName" placeholder="请输入企业名称" />
						</FormItem>
						<FormItem label="所在行业" prop="industry">
							<Select v-model="teamForm.industry" placeholder="请选择所在行业" clearable filterable>
								<Option v-for="(val,index) in industryList" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
						<FormItem label="人员规模" prop="staffSize">
							<Input type="text" v-model="teamForm.staffSize" placeholder="请输入人员规模" />
						</FormItem>
						<FormItem label="所在地区" prop="regions">
							<Cascader :data="regionData" v-model="teamForm.regions" placeholder="请输入所在地区" change-on-select></Cascader>
						</FormItem>
						<FormItem label="职务" prop="createRemark">
							<Input type="text" v-model="teamForm.createRemark" placeholder="请输入职务" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="teamSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 加入企业 -->
		<Modal
			:title="title"
			v-model="addDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="addForm" ref="addForm" :rules="rulesAdd" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="企业号" prop="deptNo">
							<Input type="number" v-model="addForm.deptNo" placeholder="请输入6位企业号" @input="changeDeptNo"/>
						</FormItem>
						<FormItem label="企业名称" prop="deptName">
							<Input type="text" v-model="addForm.deptName" readonly disabled/>
						</FormItem>
						<FormItem label="申请理由" prop="reason">
							<Input type="textarea" v-model="addForm.reason" :rows="4" placeholder="请输入申请理由" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="addSubmit" :loading="btnLoading">申请加入</Button>
			</div>
		</Modal>

		<!-- 申请人列表 -->
		<Modal
			:title="title"
			v-model="applyDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="1000">
			<div class="hxy-mt-10 hxy-mb-10">
				<Table stripe border :columns="applyTitle" :data="applyData" :loading="pageLoading"></Table>
				<div class="hxy-pt-20 tc" style="color: #999">
					点击【申请设置】，弹窗设置该成员：直属部门、职位、角色、权限，并确认通过申请
				</div>
			</div>
			<div slot="footer">
				<Button type="default" @click="closeDialog">关闭</Button>
			</div>
		</Modal>

		<!-- 申请设置 -->
		<Modal
			:title="title"
			v-model="passDialog"
			@on-cancel="passDialog = false"
			:mask-closable="false"
			:width="720">
			<Form :model="passForm" ref="passForm" :rules="rulesPass" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="直属部门" prop="deptId">
							<tree-select v-model="passForm.deptId" value-consists-of="ALL" :clearable="true" :options="deptList" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择直属部门" @input="selectDept" />
						</FormItem>
						<FormItem label="职位" prop="position">
							<Input type="text" v-model="passForm.position" placeholder="请输入职位" />
						</FormItem>
						<FormItem label="职能" prop="postIds">
							<tree-select :limit="4" :multiple="true" v-model="passForm.postIds" :normalizer="normalizer1" value-consists-of="ALL" :clearable="true" :options="postList" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择职能" @input="selectPost" />
						</FormItem>
						<FormItem label="管理权限" prop="roleIds">
							<tree-select :limit="4" :multiple="true" v-model="passForm.roleIds" :normalizer="normalizer2" value-consists-of="ALL" :clearable="true" :options="roleList" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择管理权限" @input="selectRole" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="passDialog = false">取消</Button>
				<Button type="primary" @click="passSubmit" :loading="btnLoading">通过</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import { mapGetters } from 'vuex'
import { getRegionList } from '_s'
import { getMasterDeptList,postCreateDept,getDeptInfo,postAddDept,getQuitDept,getApplyAllList,getRefuseUserDeptApply,getDeptListNew,getPostList,getRoleList,postPassUserDeptApply } from '_s/addressList'

export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			teamTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					tooltip: true,
					width: 80
				},
				{
					title: '企业名称',
					key: 'masterDeptName',
					resizable: true,
				},
				{
					title: '所在行业',
					key: 'industry',
					resizable: true,
				},
				{
					title: '人员规模',
					key: 'staffSize',
					resizable: true,
				},
				{
					title: '所在地区',
					key: 'regions',
					resizable: true,
				},
				{
					title: '职务',
					key: 'createRemark',
					resizable: true,
				},
				{
					title:'操作',
					key:'action',
					width: 250,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						var btnArr = [
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.quiteTeam(params.row)
									}
								}
							}, '退出团队')
						]
						if(params.row.operationMasterDept) {
							btnArr.push(
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
											this.setTeam(params.row)
										}
									}
								}, '管理团队')
							)
						}
						return h('div', btnArr)
					}
				}
			],
			teamData: [],
			title: '',
			teamDialog: false,
			teamForm: {
				deptName: '',
				industry: '',
				staffSize: '',
				regions: [],
				createRemark: ''
			},
			rulesTeam: {
				deptName: [{ required: true, type: 'string', message: "请输入企业名称", trigger: "blur" }],
				industry: [{ required: true, type: 'string', message: "请输入所在行业", trigger: "blur" }],
				staffSize: [{ required: true, type: 'string', message: "请输入人员规模", trigger: "blur" }],
				createRemark: [{ required: true, type: 'string', message: "请输入职务", trigger: "blur" }]
			},
			btnLoading: false,
			regionData: [],
			addDialog: false,
			addForm: {
				deptNo: '',
				deptName: '',
				reason: ''
			},
			rulesAdd: {
				deptNo: [
					{ required: true, type: 'string', message: "请输入企业号", trigger: "blur" },
					{ pattern:/^\d{6}$/, message:'请输入6位企业号', trigger:'blur'}
				]
			},
			applyDialog: false,
			applyTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					tooltip: true,
					width: 80
				},
				{
					title: '申请企业名称',
					key: 'masterDeptName',
					resizable: true,
					width: 250
				},
				{
					title: '申请时间',
					key: 'createTime',
					resizable: true,
					width: 220
				},
				{
					title: '审核人',
					key: 'updateBy',
					resizable: true,
					width: 220
				},
				{
					title: '手机',
					key: 'applyUserPhone',
					resizable: true,
					width: 150
				},
				{
					title: '邮箱',
					key: 'applyUserEmail',
					resizable: true,
					width: 220
				},
				{
					title: '自定义问题',
					key: 'reason',
					resizable: true,
					width: 150
				},
				{
					title: '申请部门',
					key: 'deptName',
					resizable: true,
					width: 150
				},
				{
					title: '邀请人',
					key: 'inviter',
					resizable: true,
					width: 150
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let status = params.row.status
						let statusName = this.deptApplyStatusList.filter(item => item.value == status)
						let btnArr = []
						if(status == '1') {
							btnArr.push(
								h('Button', {
									props: {
										type: 'error',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.toRefuse(params.row)
										}
									}
								}, '拒绝申请'),
								h('Button', {
									props: {
										type: 'primary',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.toApply(params.row)
										}
									}
								}, '申请设置')
							)
						}else {
							btnArr.push(
								h('span',statusName[0].label)
							)
						}
						return h('div', btnArr)
					}
				}
			],
			applyData: [],
			deptInfo: {},
			deptId: '',
			passDialog: false,
			passForm: {
				id: null,
				deptId: undefined,
				postIds: [],
				roleIds: [],
				position: ''
			},
			deptList: [],
			postList: [],
			roleList: [],
			rulesPass: {
				deptId: [
					{ required: true, type: 'number', message: '请选择直属部门', trigger: 'blur' }
				],
				position: [
					{ required: true, type: 'string', message: '请填写职位', trigger: 'blur' }
				],
				postIds: [
					{ required: true, type: 'array', message: '请选择职能', trigger: 'blur' }
				],
				roleIds: [
					{ required: true, type: 'array', message: '请选择管理权限', trigger: 'blur' }
				]
			},
			deptApplyStatusList: [],
			industryList: []
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
		})
	},
	created() {
		this.getRegionData()
	},
	mounted() {
		this.getTeamData()
		this.deptApplyStatusList = this.filterDict(this.config,'sys_user_dept_apply_status')
		this.industryList = this.filterDict(this.config,'industry')
		console.log(1,this.industryList)
	},
	methods: {
		// 获取省市区数据
		getRegionData() {
			getRegionList().then(res=>{
				if(res.code===200) {
					let val = JSON.parse(JSON.stringify(res.data))
					this.regionData = util.regions(val)
				}
			}).catch(err => {
				this.$Message.error(err)
			})
		},
		// 获取列表数据
		getTeamData() {
			this.pageLoading = true
			let params = {
				isLogin: false
			}
			getMasterDeptList(params).then(res => {
				if(res.code===200) {
					if(res.data) {
						this.teamData = res.data
					}else {
						this.teamData = []
					}
					this.pageLoading = false
					this.$store.dispatch('GetDeptList')
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 根据企业号获取企业信息
		getDeptInfoData(deptNo) {
			getDeptInfo(deptNo).then(res => {
				if(res.code===200) {
					this.addForm.deptName = res.data.deptName
					this.deptInfo = res.data
					this.deptId = this.deptInfo.deptId
				}
			}).catch(err => {
				this.deptId = ''
				this.addForm.deptName = '该企业不存在'
			})
		},
		// 查询申请人列表
		getApplyListData() {
			this.pageLoading = true
			getApplyAllList().then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.applyData = res.rows
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 监听输入input值
		changeDeptNo(e) {
			if(e.length==6) {
				this.getDeptInfoData(e)
			}
		},
		// 退出团队
		quiteTeam(data) {
			let params = {
				masterDeptId: data.masterDeptId
			}
			if(data.masterDeptId==parseInt(util.getStorage('masterDeptId'))){
				this.$Modal.confirm({
					title: '退出',
					content: `当前登录的为“${data.masterDeptName}”团队，退出该团队后需重新登录!`,
					loading: true,
					onOk: () => {
						getQuitDept(params).then(res => {
							if(res.code===200) {
								this.$Message.success('操作成功')
								this.$Modal.remove()
								util.delCookie('Admin-Token')
								localStorage.clear()
								setTimeout(() => {
									window.location.href = '/login'
								},500)
							}
						}).catch(err =>{
							this.$Modal.remove()
						})
					}
				})
			}else {
				this.$Modal.confirm({
					title: '退出',
					content: `确定退出 “${data.masterDeptName}” 团队吗？`,
					loading: true,
					onOk: () => {
						getQuitDept(params).then(res => {
							if(res.code===200) {
								this.$Modal.remove()
								this.getTeamData()
								this.$Message.success('操作成功')
							}
						}).catch(err =>{
							this.$Modal.remove()
						})
					}
				})
			}
		},
		// 打开创建企业对话框
		createTeam() {
			this.resetForm()
			this.title = '创建企业'
			this.teamDialog = true
		},
		// 提交创建企业
		teamSubmit() {
			this.btnLoading = true
			this.$refs['teamForm'].validate(valid => {
				if(valid) {
					let params = {
						deptName: this.teamForm.deptName,
						industry: this.teamForm.industry,
						staffSize: this.teamForm.staffSize,
						regions: JSON.stringify(this.teamForm.regions),
						createRemark: this.teamForm.createRemark
					}
					postCreateDept(params).then(res => {
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.getTeamData()
							this.teamDialog = false
						}else {
							this.btnLoading = false
							this.$Message.error(res.msg)
						}
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 打开加入企业对话框
		openAddTeam() {
			this.resetForm()
			this.title = '加入企业'
			this.addDialog = true
			this.deptId = ''
		},
		// 提交加入企业
		addSubmit() {
			let userId = parseInt(util.getStorage('userId'))
			this.btnLoading = true
			this.$refs['addForm'].validate(valid => {
				if(valid) {
					let params = {
						applyUserId: userId,
						deptId: this.deptId,
						reason: this.addForm.reason,
						type: 1
					}
					postAddDept(params).then(res => {
						if(res.code===200) {
							this.addDialog = false
							this.getTeamData()
							this.$Message.success(res.msg)
						}else{
							this.$Message.error(res.msg)
						}
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 获取部门列表
		getDeptListData(id) {
			let params = {
				masterDeptId: id
			}
			getDeptListNew(params).then(res => {
				if(res.code===200) {
					this.deptList = res.data
				}
			})
		},
		// 查询职能树
		getPostListData(id) {
			let params = {
				masterDeptId: id
			}
			getPostList(params).then(res => {
				if(res.code===200) {
					this.postList = res.data
				}
			})
		},
		// 获取企业角色列表
		getRoleListData(id) {
			let params = {
				masterDeptId: id
			}
			getRoleList(params).then(res => {
				if(res.code===200) {
					this.roleList = res.data
				}
			})
		},
		// 自定义键值职能树
		normalizer1(node) {
			console.log(1,node)
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.postId,
				label: node.postName,
				isDefaultExpanded: true
			}
		},
		// // 自定义键值角色列表
		normalizer2(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.roleId,
				label: node.roleName,
				isDefaultExpanded: true
			}
		},
		// 打开申请人列表对话框
		openApplyDialog() {
			this.title = '申请人列表'
			this.applyDialog = true
			this.getApplyListData()
		},
		// 打开申请设置对话框
		toApply(data) {
			this.resetForm()
			this.passForm.id = data.id
			let masterDeptId = data.masterDeptId
			this.title = '申请设置'
			this.passDialog = true
			this.getDeptListData(masterDeptId)
			this.getPostListData(masterDeptId)
			this.getRoleListData(masterDeptId)
		},
		// 选择直属部门
		selectDept(e) {
			this.passForm.deptId = e
		},
		// 选择职能
		selectPost(e) {
			this.passForm.postIds = e
		},
		// 选择管理权限
		selectRole(e) {
			this.passForm.roleIds = e
		},
		// 提交通过申请
		passSubmit() {
			this.btnLoading = true
			this.$refs['passForm'].validate((valid) => {
				if(valid) {
					let params = {
						id: this.passForm.id,
						deptId: this.passForm.deptId,
						postIds: this.passForm.postIds,
						roleIds: this.passForm.roleIds,
						position: this.passForm.position
					}
					postPassUserDeptApply(params).then(res => {
						if(res.code===200) {
							this.passDialog = false
							this.getApplyListData()
							this.$Message.success(res.msg)
						}
					}).catch(err => {
						this.passDialog = false
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 拒绝申请
		toRefuse(data) {
			let params = {
				id: data.id
			}
			this.$Modal.confirm({
				title: '拒绝申请',
				content: `确定拒绝申请吗？`,
				loading: true,
				onOk: () => {
					getRefuseUserDeptApply(params).then(res => {
						if(res.code===200) {
							this.$Message.success('操作成功')
							this.$Modal.remove()
							this.getApplyListData()
						}
					}).catch(err =>{
						this.$Modal.remove()
					})
				}
			})
		},
		// 关闭对话框
		closeDialog() {
			this.teamDialog = false
			this.addDialog = false
			this.applyDialog = false
		},
		resetForm() {
			this.btnLoading = false
			this.$refs['teamForm'].resetFields()
			this.$refs['addForm'].resetFields()
			this.$refs['passForm'].resetFields()
		},
		// 管理团队
		setTeam(data) {
			util.setStorage('masterDeptId',data.masterDeptId)
			this.$router.push({name:'companyBasic'})
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
		}
	}
}
</script>
<style lang="scss" scoped>
	.team {
	}
	/deep/ .ivu-input[disabled] {
				color:#888 !important;
			}
</style>