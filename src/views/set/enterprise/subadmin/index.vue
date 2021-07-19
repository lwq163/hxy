<template>
    <div class="subadmin">
		<tab-menu></tab-menu>
		<div class="hxy-mb-25">
			<Button type="primary" ghost @click="openadminDialog" v-hasPermi="['system:role:addChildAdmin']">添加管理组</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="childAdminTitle" :data="childAdminData" :loading="pageLoading"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 添加管理组 -->
		<Modal
			:title="title"
			v-model="adminDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="childAdminForm" ref="childAdminForm" :rules="rulesAdmin" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="管理组名称" prop="roleName">
							<Input type="text" v-model="childAdminForm.roleName" placeholder="请输入管理组名称"/>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="成员" prop="userIds">
							<Select v-model="childAdminForm.userIds" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择成员" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="管理范围" prop="dataScope">
							<RadioGroup v-model="childAdminForm.dataScope" @on-change="selectDataScope">
								<Col>
									<Radio label='1'>全公司</Radio>
								</Col>
								<Col>
									<Radio label='2'>所在部门及下级部门</Radio>
								</Col>
								<Col>
									<Row>
										<Col span="5">
											<Radio label='3'>特定部门</Radio>
										</Col>
										<Col span="18" v-if="childAdminForm.dataScope==3">
											<FormItem prop="deptIds">
												<tree-select :multiple="true" :limit="4" value-consists-of="ALL_WITH_INDETERMINATE" :clearable="true" v-model="childAdminForm.deptIds" :options="currDeptList" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择部门" @input="selectDept" />
											</FormItem>
										</Col>
									</Row>
								</Col>
							</RadioGroup>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="分配权限" prop="menuIds">
							<tree-select :limit="4" :multiple="true" value-consists-of="ALL_WITH_INDETERMINATE" :normalizer="normalizer" :clearable="true" v-model="childAdminForm.menuIds" :options="currMenuList" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择分配权限" @input="selectMenu" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="handleSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import { getQueryChildAdmin,getCurrStaff,getSelectCurrDeptList,getRoleMenuList,postAddChildAdmin,getRoleDetail,postEditChildAdmin,deleteRole } from '_s/enterprise'
export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			adminDialog: false,
			title: '',
			childAdminTitle: [
				{
					title: '序号',
					key: 'roleId',
					resizable: true,
					width: 80
				},
				{
					title: '管理员名称',
					key: 'roleName',
					resizable: true,
					width: 250
				},
				{
					title: '成员',
					resizable: true,
					width: 250,
					render: (h, params) => {
						let userList = []
						let data = params.row.sysUserList
						if(data && data.length > 0) {
							data.forEach((value,index) => {
								userList.push(
									h('div',{
										style: {
											padding: '2px'
										}
									},value.nickName)
								)
							})
						}
						return h('div',userList)
					}
				},
				{
					title: '管理范围',
					key: 'dataScopeName',
					resizable: true,
					width: 250
				},
				{
					title: '权限',
					resizable: true,
					render: (h, params) => {
						let menuList = []
						let data = params.row.sysMenuList
						if(data && data.length > 0) {
							data.forEach(function (value,key) {
								menuList.push(
									h('Tag', {
										props: {
											type: 'border',
										},
										style: {
											marginRight: '5px',
											marginBottom: '5px',
										}
									}, value.menuName)
								)
							})
						}
						return h('div',{style: {padding:'10px 0'}},menuList)
					}
				},
				{
					title:'操作',
					key:'action',
					width: 250,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let btnArr = []
						if(this.validateRole('system:role:editChildAdmin')) {
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
											this.toEdit(params.row)
										}
									}
								}, '编辑')
							)
						}
						if(this.validateRole('system:role:removeChildAdmin')) {
							btnArr.push(
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
											this.toDel(params.row)
										}
									}
								}, '删除')
							)
						}
						return h('div', btnArr)
					}
				}
			],
			childAdminData: [],
			childAdminForm: {
				roleId: null,
				roleName: '',
				userIds: [],
				dataScope: '',
				deptIds: [],
				menuIds: []
			},
			rulesAdmin: {
				roleName: [{ required: true, type: 'string', message: '请输入管理组名称', trigger: 'blur' }],
				// userIds: [{ required: true, type: 'array', message: '请选择成员', trigger: 'change' }],
				dataScope: [{ required: true, type: 'string', message: '请选择管理范围', trigger: 'change' }],
				menuIds: [{ required: true, type: 'array', message: '请选择分配权限', trigger: 'change' }]
			},
			btnLoading: false,
			dataScopeNameList: ['所有数据权限(全公司)', '所在部门及以下', '特定部门（自定义）'],
			currDeptList: [],
			currStaffList: [],
			currMenuList: [],
			btnLoading: false,
			roleDetail: [],
			isAdd: true
		}
	},
	created() {
	},
	mounted() {
		this.getQueryChildAdminData()
		this.getSelectCurrDeptListData()
		this.getCurrStaffData()
		this.getRoleMenuListData()
	},
	methods: {
		// 选择指定部门
		selectDept(e) {
			this.childAdminForm.deptIds = e
		},
		// 选择分配权限
		selectMenu(e) {
			console.log(1,e)
			this.childAdminForm.menuIds = e
		},
		// 选择范围
		selectDataScope(e) {
			this.childAdminForm.deptIds = []
		},
		// 查询管理组列表
		getQueryChildAdminData() {
			this.pageLoading = true
			let params = {
				pageNum: this.page,
				pageSize: this.pageSize
			}
			getQueryChildAdmin(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.childAdminData = res.rows
					if(this.childAdminData && this.childAdminData.length > 0) {
						this.childAdminData.forEach((value,index) => {
							switch (value.dataScope) {
								case '1':
									this.childAdminData[index].dataScopeName = this.dataScopeNameList[0]
									break;
								case '2':
									this.childAdminData[index].dataScopeName = this.dataScopeNameList[1]
									break;
								case '3':
									this.childAdminData[index].dataScopeName = this.dataScopeNameList[2]
									break;
							}
						})
					}
					this.total = res.total
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 查询当前登录企业下所有人员
		getCurrStaffData() {
			getCurrStaff().then(res => {
				if(res.code===200) {
					this.currStaffList = res.data
				}
			}).catch(err => {})
		},
		// 查询当前用户所选择企业下的所有部门
		getSelectCurrDeptListData() {
			getSelectCurrDeptList().then(res => {
				if(res.code===200) {
					this.currDeptList = res.data
				}
			}).catch(err => {})
		},
		// 自定义键值
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.menuId,
				label: node.menuName,
				children: node.children,
				isDefaultExpanded: true
			}
		},
		// 查询当前登录用户可以查看哪些菜单
		getRoleMenuListData() {
			getRoleMenuList().then(res => {
				if(res.code===200) {
					this.currMenuList = res.data
					// 更改键值方法
					// this.currMenuList = JSON.parse(JSON.stringify(res.data).replace(/"menuId"/g,"\"id\"").replace(/"menuName"/g,"\"label\""))
					// this.currMenuList.forEach(value => {
					// 	if (value.children && !value.children.length) {
					// 		delete value.children;
					// 	}
					// })
					// console.log(this.currMenuList)
				}
			}).catch(err => {})
		},
		// 查询子管理员详情
		getRoleDetailData(id) {
			getRoleDetail(id).then(res => {
				if(res.code===200) {
					let val = res.data
					this.childAdminForm = {
						roleId: val.roleId || null,
						roleName: val.roleName,
						dataScope: val.dataScope,
						menuIds: []
					}
					let sysUserList = val.sysUserList?val.sysUserList:[]
					let sysDeptList = val.sysDeptList?val.sysDeptList:[]
					let sysMenuList = JSON.parse(JSON.stringify(val.sysMenuList).replace(/"menuId"/g,"\"id\"").replace(/"menuName"/g,"\"label\""))
					this.childAdminForm.userIds = sysUserList.map(item => item.userId)
					if(val.dataScope == '3') {
						this.childAdminForm.deptIds = sysDeptList ? sysDeptList.map(item => item.deptId) : []
					}else {
						this.childAdminForm.deptIds = []
					}
					this.childAdminForm.menuIds = sysMenuList.map(item => item.id)
				}
			}).catch(err => {})
		},
		resetForm() {
			this.childAdminForm.roleId = null
			this.$refs['childAdminForm'].resetFields()
			this.adminDialog = true
			this.btnLoading = false
			this.childAdminForm.deptIds = []
			this.childAdminForm.menuIds = []
		},
		// 打开编辑对话框
		toEdit(data) {
			this.resetForm()
			this.title = '编辑管理组'
			let roleId = data.roleId
			this.getRoleDetailData(roleId)
		},
		// 打开添加管理组对话框
		openadminDialog() {
			this.resetForm()
			this.title = '添加管理组'
		},
		// 提交选择权限
		handleSubmit() {
			this.btnLoading = true
			this.$refs['childAdminForm'].validate((valid) => {
				if(valid) {
					if(this.childAdminForm.dataScope=='3') {
						if(this.childAdminForm.deptIds.length==0) {
							this.$Message.error('请选择特定部门')
							this.btnLoading = false
							return
						}
					}
					let params = {
						roleId: this.childAdminForm.roleId,
						roleName: this.childAdminForm.roleName,
						userIds: this.childAdminForm.userIds,
						dataScope: this.childAdminForm.dataScope,
						deptIds: this.childAdminForm.deptIds,
						menuIds: this.childAdminForm.menuIds,
						roleSort: this.total + 1
					}
					if(this.childAdminForm.roleId) {
						console.log('更新',params)
						postEditChildAdmin(params).then(res => {
							if(res.code===200) {
								this.$Message.success(res.msg)
								this.getQueryChildAdminData()
								this.adminDialog = false
							}
						}).catch(err => {
							this.adminDialog = false
						})
					}else {
						console.log('新增',params)
						postAddChildAdmin(params).then(res => {
							if(res.code===200) {
								this.$Message.success(res.msg)
								this.getQueryChildAdminData()
								this.adminDialog = false
							}
						}).catch(err => {
							this.adminDialog = false
						})
					}					
				}else {
					this.btnLoading = false
				}
			})
		},
		// 删除子管理员
		toDel(data) {
			let ids = data.roleId
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除吗？',
				loading: true,
				onOk: () => {
					deleteRole(ids).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getQueryChildAdminData()
							this.$Message.success(res.msg)
						}
					}).catch(err=>{
						this.$Modal.remove()
					})
				}
			})
		},
		// 关闭选择成员对话框
		closeDialog() {
			this.adminDialog = false
		},
		maxTag(num) {
			return 'more '+ num;
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getQueryChildAdminData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getQueryChildAdminData()
		}
	}
}
</script>
<style lang="scss" scoped>
	.subadmin {	
	}
	.tree-border {
		border: 1px solid #e5e6e7;
		border-radius:4px;
	}
</style>