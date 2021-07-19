<template>
    <div class="role">
		<tab-menu></tab-menu>
		<div class="hxy-mb-30">
			<Button type="primary" ghost class="hxy-mr-10" @click="openAddPostGroup" v-hasPermi="['system:post:add']">新增职能组</Button>
			<Button class="hxy-mr-10" @click="openAddPost" v-hasPermi="['system:post:addPost']">新增职能</Button>
			<Button class="hxy-mr-10" :disabled="single" @click="editChecked" v-hasPermi="['system:post:edit']">编辑</Button>
			<Button class="hxy-mr-10" :disabled="multiple" @click="toDel" v-hasPermi="['system:post:remove']">删除</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border row-key="postId" :columns="roleListTitle" :data="roleListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<!-- <div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div> -->

		<!-- 添加职能组 -->
		<Modal
			:title="title"
			v-model="addPostGroupDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="addPostGroupForm" ref="addPostGroupForm" :rules="rulesAddPostGroup" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="职能组名称" prop="postName">
							<Input type="text" v-model="addPostGroupForm.postName" placeholder="请输入职能组名称"/>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="addPostGroupSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 添加职能 -->
		<Modal
			:title="title"
			v-model="addPostDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="addPostForm" ref="addPostForm" :rules="rulesAddPost" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="职能名称" prop="postName">
							<Input type="text" v-model="addPostForm.postName" placeholder="请输入职能名称"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="分组" prop="postId">
							<Select v-model="addPostForm.postId" placeholder="请选择分组" clearable filterable>
								<Option :value="item.postId" v-for="(item,index) in roleListData" :key="index">{{item.postName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="addPostSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>
<script>
import { addRoluTeam,getGroupTree,addRoluSon,editRolu,delRoluSon } from '_s/role'
import util from '_m/util'
export default{
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			roleListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '名称',
					key  : 'postName',
					tree : true
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let data = params.row
						if (data.children && !data.children.length) {
							delete data.children
						}
						
						let btnArr = []
						if(this.validateRole('system:post:edit')) {
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
											this.toEdit(data)
										}
									}
								}, '编辑'),
							)
						}
						if(this.validateRole('system:post:remove')) {
							if(!data.hasOwnProperty('children')) {
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
												this.toDel(data)
											}
										}
									}, '删除')
								)
							}
						}
						return h('div', btnArr)
					}
				}
			],
			roleListData: [],
			ids: [],
			single: true,
			multiple: true,
			title: '',
			btnLoading: false,
			addPostGroupDialog: false,
			addPostGroupForm: {
				postName: ''
			},
			rulesAddPostGroup: {
				postName: [
					{ required: true, type: 'string', message: '请输入职能组', trigger: 'blur' }
				]
			},
			addPostDialog: false,
			addPostForm: {
				postName: '',
				postId: ''
			},
			rulesAddPost: {
				postName: [
					{ required: true, type: 'string', message: '请输入职能', trigger: 'blur' }
				],
				// postId: [
				// 	{ required: true, type: 'number', message: '请选择分组', trigger: 'change' }
				// ]
			},
			isEdit: false,
			parentIds: []
		}
	},
	created() {},
	mounted() {
		this.getGroupTreeData()
	},
	methods: {
		// 查询当前企业部门
		getGroupTreeData() {
			this.pageLoading = true
			getGroupTree().then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.roleListData = res.data
					this.roleListData.forEach((value,index) => {
						this.roleListData[index].level = 1
						this.roleListData[index]._showChildren = true
						if(value.children.length>0) {
							this.roleListData[index]._disabled = true
							value.children.forEach((v,i) => {
								value.children[i].level = 2
							})
						}
					})
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 打开新增职能组弹出窗口
		openAddPostGroup() {
			this.resetForm()
			this.title = '新增职能组'
			this.addPostGroupDialog = true
		},
		// 提交新增职能组
		addPostGroupSubmit() {
			this.btnLoading = true
			this.$refs['addPostGroupForm'].validate((valid) => {
				if(valid) {
					if(this.isEdit) {
						let params = {
							postName: this.addPostGroupForm.postName,
							postId: this.addPostGroupForm.postId
						}
						console.log('edit',params)
						editRolu(params).then(res => {
							this.addPostGroupDialog = false
							this.getGroupTreeData()
							this.$Message.success(res.msg)
						}).catch(err => {
							this.btnLoading = false
						})
					}else {
						let params = {
							postName : this.addPostGroupForm.postName,
							postType : 2,
							parentId : 0,
							postSort : 0
						}
						console.log('add',params)
						addRoluTeam(params).then(res => {
							this.addPostGroupDialog = false
							this.getGroupTreeData()
							this.$Message.success(res.msg)
						}).catch(err => {
							this.btnLoading = false
						})
					}
					return
					
				}else {
					this.btnLoading = false
				}
			})
		},
		// 打开新增职能弹出窗口
		openAddPost() {
			this.resetForm()
			this.title = '新增职能'
			this.addPostDialog = true
			this.addPostForm.postId = 0
		},
		// 提交新增职能
		addPostSubmit() {
			this.btnLoading = true
			this.$refs['addPostForm'].validate((valid) => {
				if(valid) {
					if(this.isEdit) {
						let params = {
							postName: this.addPostForm.postName,
							postId: this.addPostForm.curPostId,
							parentId: this.addPostForm.postId
						}
						console.log('edit',params)
						editRolu(params).then(res => {
							this.addPostDialog = false
							this.multiple = true
							this.single = true
							this.getGroupTreeData()
							this.$Message.success(res.msg)
						}).catch(err => {
							this.btnLoading = false
						})
					}else {
						let params = {
							postName : this.addPostForm.postName,
							postType : 1,
							parentId : this.addPostForm.postId,
							postSort : 0
						}
						console.log('add',params)
						addRoluSon(params).then(res => {
							this.addPostDialog = false
							this.multiple = true
							this.single = true
							this.getGroupTreeData()
							this.$Message.success(res.msg)
						}).catch(err => {
							this.btnLoading = false
						})
					}
				}else {
					this.btnLoading = false
				}
			})
		},
		// 选择checkbox编辑
		editChecked() {
			this.resetForm()
			this.isEdit = true
			let parentId = this.parentIds[0]
			let postId = this.ids[0]
			let val = util.getIdData(this.roleListData,'postId',postId)
			if(parentId==0) {
				this.title = '编辑职能组'
				this.addPostGroupDialog = true
				this.addPostGroupForm.postName = val.postName
				this.addPostGroupForm.postId = val.postId
			}else {
				this.title = '编辑职能'
				this.addPostDialog = true
				this.addPostForm.postName = val.postName
				this.addPostForm.postId = val.parentId
				this.addPostForm.curPostId = val.postId
			}
		},
		// 编辑 
		toEdit(data) {
			this.resetForm()
			this.isEdit = true
			if(data.level == 1) {
				this.title = '编辑职能组'
				this.addPostGroupDialog = true
				this.addPostGroupForm.postName = data.postName
				this.addPostGroupForm.postId = data.postId
			}else {
				this.title = '编辑职能'
				this.addPostDialog = true
				this.addPostForm.postName = data.postName
				this.addPostForm.postId = data.parentId
				this.addPostForm.curPostId = data.postId
			}
		},
		// 删除部门
		toDel(data) {
			let ids = data.postId || this.ids
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除吗？',
				loading: true,
				onOk: () => {
					delRoluSon(ids).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getGroupTreeData()
							this.multiple = true
							this.single = true
							this.$Message.success(res.msg)
						}
					}).catch(err => {
						this.$Modal.remove()
						this.multiple = true
						this.single = true
					})
				}
			})
		},
		// 关闭弹窗
		closeDialog() {
			this.addPostGroupDialog = false
			this.addPostDialog = false
		},
		// 清空
		resetForm() {
			this.btnLoading = false
			this.isEdit = false
			this.$refs['addPostGroupForm'].resetFields()
			this.$refs['addPostForm'].resetFields()
			this.addPostForm.curPostId = ''
			this.addPostGroupForm.postId = ''
		},
		// 多选框选中数据
		selectChange(selection) {
			this.parentIds = selection.map(item => item.parentId)
			this.ids = selection.map(item => item.postId)
			this.single = selection.length!==1
			this.multiple = !selection.length
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getGroupTreeData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getGroupTreeData()
		},
	}
}
</script>
<style lang="scss" scoped>
	.role {	
	}
</style>