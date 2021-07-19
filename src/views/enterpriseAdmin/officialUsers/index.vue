<template>
    <div class="officiaUsers">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="用户名称" prop="userName">
                            <Input type="text" v-model="searchForm.userName" placeholder="请输入用户名称"></Input>
                        </FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="手机" prop="phone">
                            <Input type="text" v-model="searchForm.phone" placeholder="请输入手机"></Input>
                        </FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<Button type="primary" @click="handleSearch('searchForm')" icon="ios-search" class="hxy-ml-30 hxy-mr-10">搜索</Button>
						<Button type="default" @click="handleReset('searchForm')" icon="ios-refresh">清空</Button>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="userListTitle" :data="userListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 编辑用户弹出窗口 -->
		<Modal
			:title="title"
			v-model="userDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Spin size="large" fix v-if="modalLoading"></Spin>
			<Form :model="editUserForm" ref="editUserForm" :rules="rulesEditUser" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="用户名称">
							{{userDetail.userName||''}}
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="用户昵称">
							{{userDetail.nickName||''}}
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="职位">
							{{userDetail.position||''}}
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="邮箱">
							{{userDetail.email||''}}
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="手机">
							{{userDetail.phone||''}}
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="角色" prop="roleIds">
							<Select v-model="editUserForm.roleIds" placeholder="请选择角色" clearable filterable>
								<Option v-for="(val,index) in rolesList" :value="val.roleId" :key="index">{{val.roleName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="绑定成员" prop="employeeId">
							<Select v-model="editUserForm.employeeId" placeholder="请选择绑定成员" clearable filterable>
								<Option v-for="(val,index) in employeeList" :value="val.id" :key="index">{{val.staffName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="是否限制登录" prop="isLimitLogin">
                            <Switch v-model="editUserForm.isLimitLogin" />
                        </FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="save" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import {getUserList,postFormalDisable,postFormalLimit,getDeleteUser,getUserDetail,postSaveUser,getRoleList,getQueryEmployeeList} from '_s/enterpriseAdmin'

export default {
	data() {
		return {
			searchForm: {
				userName: '',
				phone: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			total: 0,
			pageLoading: false,//页面loading动画
			ids: [],
			single: true,
			multiple: true,
			title: '',
			userListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '用户ID',
					key: 'userId',
					resizable: true,
					width: 80
				},
				{
					title: '用户名称',
					key: 'userName',
					resizable: true,
					width: 200
				},
				{
					title: '用户昵称',
					key: 'nickName',
					resizable: true,
					width: 200
				},
				{
					title: '职位',
					key: 'position',
					resizable: true,
					width: 200
				},
				{
					title: '邮箱',
					key: 'email',
					resizable: true,
					width: 220,
				},
				{
					title: '手机',
					key: 'phone',
					resizable: true,
					width: 200
				},
				{
					title: '统一社会信用代码',
					key: 'creditCode',
					resizable: true,
					width: 250,
				},
				{
					title: '限制登录',
					key: 'isLimitLogin',
					resizable: true,
					width: 150,
					render: (h, params) => {
						let isLimitLogin = params.row.isLimitLogin=='1'?'是':'否'
						return h('div', isLimitLogin)
					}
				},
				{
					title: 'MAC',
					key: 'mac',
					resizable: true,
					width: 200,
				},
				{
					title: 'IP',
					key: 'ip',
					resizable: true,
					width: 200,
				},
				{
					title: '角色',
					resizable: true,
					width: 200,
					render: (h, params) => {
						let roleName = params.row.roles&&params.row.roles.length>0 ? params.row.roles[0].roleName : ''
						return h('div', roleName)
					}
				},
				{
					title: '用户状态',
					key: 'statusText',
					resizable: true,
					width: 150
				},
				{
					title:'操作',
					key:'action',
					width: 300,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let btnArr = []
						let isLimitLogin = params.row.isLimitLogin
						let status = params.row.status
						btnArr.push(
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
										this.toEdit(params.row)
									}
								}
							}, '编辑'),
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
										this.toDel(params.row)
									}
								}
							}, '删除')
						)
						if(status=='1') {
							btnArr.splice(
								1,0,
								h('Button', {
									props: {
										type: 'warning',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.toDisable(params.row,'2')
										}
									}
								}, '冻结')
							)
						}else {
							btnArr.splice(
								1,0,
								h('Button', {
									props: {
										type: 'success',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.toDisable(params.row,'1')
										}
									}
								}, '解冻')
							)
						}
						if(isLimitLogin=='0') {
							btnArr.splice(
								2,0,
								h('Button', {
									props: {
										type: 'warning',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.toLimit(params.row,'1')
										}
									}
								}, '设置限制登录')
							)
						}else{
							btnArr.splice(
								2,0,
								h('Button', {
									props: {
										type: 'success',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.toLimit(params.row,'0')
										}
									}
								}, '解除限制登录')
							)
						}
						return h('div', btnArr)
					}
				}
			],
			userListData: [],
			btnLoading: false,
			userDialog: false,
			userDetail: {},
			editUserForm: {
				roleIds: [],
				isLimitLogin: true
			},
			rulesEditUser: {
				roleIds: [
					{ required: true, type: 'number', message: '请选择角色', trigger: 'change' }
				]
			},
			modalLoading: false,
			rolesList: [],
			employeeList: []
		}
	},
	mounted() {
		this.getUserListData()
		this.getRoleListData()
		this.getQueryEmployeeListData()
	},
	methods: {
		// 获取正式用户
		getUserListData() {
			this.pageLoading = true
			let params = {
				userName: this.searchForm.userName || '',
				phone: this.searchForm.phone || '',
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			getUserList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.userListData = res.rows
					this.total = res.total
				}else {
					this.pageLoading = false
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 获取企业角色列表
		getRoleListData() {
			let params = {
				masterDeptId: parseInt(util.getStorage('masterDeptId'))
			}
			getRoleList(params).then(res => {
				if(res.code===200) {
					this.rolesList = res.data
				}
			})
		},
		// 查询企业下的员工列表
		getQueryEmployeeListData(id) {
			let params = {
				masterDeptId: parseInt(util.getStorage('masterDeptId')),
				userId: id
			}
			getQueryEmployeeList(params).then(res => {
				if(res.code===200) {
					this.employeeList = res.data
				}
			})
		},
		// 冻结/解冻操作
		toDisable(data,status) {
			let params = {
				userId: data.userId,
				status: status
			}
			this.$Modal.confirm({
				title: status=='2'?'冻结':'解冻',
				content: status=='2'?'确定冻结该用户吗？':'确定解冻该用户吗？',
				loading: true,
				onOk: () => {
					postFormalDisable(params).then(res => {
						if (res.code == 200) {
							this.$Message.success(res.msg)
							this.$Modal.remove()
							this.getUserListData()
						}
					}).catch(res => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 设置限制登录/解除限制登录
		toLimit(data,isLimitLogin) {
			let params = {
				userId: data.userId,
				isLimitLogin: isLimitLogin
			}
			this.$Modal.confirm({
				title: isLimitLogin=='1'?'设置限制登录':'解除限制登录',
				content: isLimitLogin=='1'?'确定设置限制该用户登录？':'确定解除限制该用户登录？',
				loading: true,
				onOk: () => {
					postFormalLimit(params).then(res => {
						if (res.code == 200) {
							this.$Message.success(res.msg)
							this.$Modal.remove()
							this.getUserListData()
						}
					}).catch(res => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 删除
		toDel(data) {
			let userId = data.userId
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除该用户吗？',
				loading: true,
				onOk: () => {
					getDeleteUser(userId).then(res => {
						if (res.code == 200) {
							this.$Message.success(res.msg)
							this.$Modal.remove()
							this.getUserListData()
						}
					}).catch(res => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 正式用户-编辑查询
		getUserDetailData(id) {
			this.modalLoading = true
			getUserDetail(id).then(res=> {
				if(res.code===200) {
					this.modalLoading = false
					let val = res.data
					this.userDetail = val
					this.editUserForm.roleIds = val.roles.length>0?val.roles[0].roleId : ''
					this.editUserForm.isLimitLogin = val.isLimitLogin=='1'?true:false
					this.editUserForm.employeeId = val.employeeId
				}
			}).catch(err=>{
				this.modalLoading = false
			})
		},
		// 编辑
		toEdit(data) {
			let userId = data.userId
			this.resetForm()
			this.title = '编辑用户'
			this.userDialog = true
			this.getUserDetailData(userId)
			this.getQueryEmployeeListData(userId)
		},
		// 提交创建用户
		save() {
			this.btnLoading = true
			this.$refs['editUserForm'].validate((valid) => {
				if(valid) {
					let params = {
						userId: this.userDetail.userId,
						roleIds: [this.editUserForm.roleIds],
						isLimitLogin: this.editUserForm.isLimitLogin?'1':'0',
						employeeId: this.editUserForm.employeeId
					}
					postSaveUser(params).then(res => {
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.getUserListData()
							this.userDialog = false
							this.btnLoading = false
						}
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 关闭对话框
		closeDialog() {
			this.userDialog = false
		},
		// 清空
		resetForm() {
			this.$refs['editUserForm'].resetFields()
			this.modalLoading = false
			this.btnLoading = false
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.userId)
			this.single = selection.length!==1
			this.multiple = !selection.length
		},
		// 搜索
		handleSearch() {
			this.getUserListData()
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.getUserListData()
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.page = pages
			this.getUserListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.getUserListData()
		},
	}
}
</script>
<style lang="scss" scoped>
	.officiaUsers {	
	}
</style>