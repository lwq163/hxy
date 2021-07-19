<template>
    <div class="extentPower">
		<div class="hxy-mb-25">
			<Button type="primary" ghost class="hxy-mr-10" @click="openAddRoleDialog">添加角色</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="rolesListTitle" :data="rolesListData" :loading="pageLoading"></Table>
		</div>

        <!-- 添加角色 -->
		<Modal
			:title="title"
			v-model="rolesDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="rolesForm" ref="rolesForm" :rules="rulesRoles" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="角色名称" prop="roleName">
							<Input type="text" v-model="rolesForm.roleName" placeholder="请输入角色名称"/>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="权限维护" prop="menuIds">
							<tree-select :limit="4" :multiple="true" value-consists-of="ALL_WITH_INDETERMINATE" :normalizer="normalizer" :clearable="true" v-model="rolesForm.menuIds" :options="currMenuList" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择分配权限" @input="selectMenu" />
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
import util from '_m/util'
import {getRolesList,postAddRoles,postEditRoles,getRoleSingleInfo,deleteRole} from '_s/enterpriseAdmin'
import {getRoleMenuList} from '_s/enterprise'

export default {
	data() {
		return {
			pageLoading: false,//页面loading动画
			title: '',
            rolesListTitle: [
                {
					title: '序号',
					key: 'roleId',
					resizable: true,
					width: 80
				},
				{
					title: '角色',
					key: 'roleName',
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
            rolesListData: [],
			rolesList: [],
            rolesDialog: false,
            rolesForm: {
                roleId: null,
				roleName: '',
				menuIds: []
            },
            rulesRoles: {
                roleName: [{ required: true, type: 'string', message: '请输入角色名称', trigger: 'blur' }],
				menuIds: [{ required: true, type: 'array', message: '请选择权限维护', trigger: 'blur' }]
            },
            currMenuList: [],
            btnLoading: false
		}
	},
	mounted() {
        this.getRolesListData()
        this.getRoleMenuListData()
	},
	methods: {
        // 获取单独角色列表
        getRolesListData() {
            this.pageLoading = true
            getRolesList().then(res => {
                if(res.code===200) {
                    this.pageLoading = false
					this.rolesListData = res.rows
                }
            }).catch(err => {
				this.pageLoading = false
			})
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
		getRoleSingleInfoData(id) {
			getRoleSingleInfo(id).then(res => {
				if(res.code===200) {
					let val = res.data
					this.rolesForm = {
						roleId: val.roleId || null,
						roleName: val.roleName,
                        menuIds: []
					}
                    this.rolesForm.menuIds = util.collectId(val.sysMenuList)
				}
			}).catch(err => {})
		},
        // 选择分配权限
		selectMenu(e) {
            this.rolesForm.menuIds = e
			if(this.rolesForm.menuIds.length!=0) {
				this.$nextTick(() => {
					this.$refs['rolesForm'].validateField('menuIds')
				})
			}
		},
        // 打开添加角色对话框
        openAddRoleDialog() {
            this.resetForm()
            this.rolesDialog = true
            this.title = '添加角色'
        },
        // 打开编辑对话框
		toEdit(data) {
			this.resetForm()
            this.rolesDialog = true
			this.title = '编辑角色'
			let roleId = data.roleId
			this.getRoleSingleInfoData(roleId)
		},
        // 提交新增/编辑角色
        handleSubmit() {
			this.btnLoading = true
			this.$refs['rolesForm'].validate((valid) => {
				if(valid) {
					let params = {
						roleId: this.rolesForm.roleId,
						roleName: this.rolesForm.roleName,
						menuIds: this.rolesForm.menuIds
					}
					if(this.rolesForm.roleId) {
						console.log('更新',params)
						postEditRoles(params).then(res => {
							if(res.code===200) {
								this.$Message.success(res.msg)
								this.getRolesListData()
								this.rolesDialog = false
							}
						}).catch(err => {
							this.btnLoading = false
						})
					}else {
						console.log('新增',params)
						postAddRoles(params).then(res => {
							if(res.code===200) {
								this.$Message.success(res.msg)
								this.getRolesListData()
								this.rolesDialog = false
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
        // 删除角色
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
							this.getRolesListData()
							this.$Message.success(res.msg)
						}
					}).catch(err=>{
						this.$Modal.remove()
					})
				}
			})
		},
        // 关闭
        closeDialog() {
            this.rolesDialog = false
        },
        // 清空
		resetForm() {
            this.rolesForm.roleId = null
			this.$refs['rolesForm'].resetFields()
            this.rolesForm.menuIds = []
			this.btnLoading = false
        }
	}
}
</script>
<style lang="scss" scoped>
	.extentPower {	
	}
</style>