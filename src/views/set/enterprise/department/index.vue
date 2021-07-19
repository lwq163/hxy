<template>
    <div class="department">
		<tab-menu></tab-menu>
		<div class="hxy-mb-30">
			<Button type="primary" ghost class="hxy-mr-10" @click="openAddDept">添加部门</Button>
			<Button class="hxy-mr-10" :disabled="single" @click="openEdit" v-hasPermi="['system:dept:edit']">编辑</Button>
			<Button class="hxy-mr-10" :disabled="multiple" @click="toDelDept" v-hasPermi="['system:dept:remove']">删除</Button>
		</div>
		
		<div class="hxy-mb-25">
			<Table stripe border row-key="deptId" :columns="deptListTitle" :data="deptListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<!-- <div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div> -->
		
		<!-- 添加部门 -->
		<Modal
			:title="title"
			v-model="addDeptDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="addDeptForm" ref="addDeptForm" :rules="rulesAddDept" label-position="left" :label-width="120">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="部门名称" prop="deptName">
							<Input type="text" v-model="addDeptForm.deptName" placeholder="请输入部门名称"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="上级部门" prop="deptId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer" :clearable="true" v-model="addDeptForm.deptId" :options="deptListData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择部门" @input="selectAddDept" />
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="所属区域" prop="areaId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer_area" :clearable="true" v-model="addDeptForm.areaId" :options="areaListData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择区域" @input="selectAddArea" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="addSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
				
		<!-- 编辑部门 -->
		<Modal
			:title="title"
			v-model="editDeptDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="editDeptForm" ref="editDeptForm" :rules="rulesEditDept" label-position="left" :label-width="120">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="部门名称" prop="deptName">
							<Input type="text" v-model="editDeptForm.deptName" placeholder="请输入部门名称"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="上级部门" prop="parentId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer" :clearable="true" v-model="editDeptForm.parentId" :options="deptListData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择部门" @input="selectEditDept" />
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="所属区域" prop="areaId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer_area" :clearable="true" v-model="editDeptForm.areaId" :options="areaListData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择区域" @input="selectAddArea" />
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="设置主管" prop="leaderId">
							<Select v-model="editDeptForm.leaderId" placeholder="请选择成员" clearable filterable @on-change="selectLeader">
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="editSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import {getDeptEmpList,postCreateDept,deleteDept,getDeptDetail,postEditDept,getSelectCurrDeptList,getQueryCurrStaff} from '_s/department'
import {getAreaList} from '_s/area'
export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			deptListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					key: 'deptId',
					tooltip: true,
					resizable: true,
					width: 80
				},
				{
					title: '部门名称',
					key: 'deptName',
					resizable: true,
					tree: true
				},
				{
					title: '部门编号',
					key: 'deptNo',
					resizable: true,
				},
				{
					title: '区域',
					key: 'areaId',
					resizable: true,
					render: (h, params) => {
						let areaId = params.row.areaId
						let areaName = areaId?util.getIdData(this.areaListData,'areaId',areaId):''
						return h('div', areaName?areaName.areaName:'')
					}
				},
				{
					title: '成员数',
					key: 'staffNum',
					resizable: true,
				},
				{
					title: '主管',
					key: 'leader',
					resizable: true,
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
						if(this.validateRole('system:dept:edit')) {
							if(util.getStorage('masterDeptId')!=data.deptId) {
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
												this.openEdit(data)
											}
										}
									}, '编辑')
								)
							}
						}
						if(this.validateRole('system:dept:remove')) {
							if(util.getStorage('masterDeptId')!=data.deptId) {
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
													this.toDelDept(data)
												}
											}
										}, '删除')
									)
								}
							}
						}
						return h('div', btnArr)
					}
				}
			],
			deptListData: [],
			ids: [],
			single: true,
			multiple: true,
			title: '',
			addDeptDialog: false,
			addDeptForm: {
				deptName: '',
				deptId: undefined,
				areaId: undefined
			},
			rulesAddDept: {
				deptName: [{ required: true, type: 'string', message: "请输入部门名称", trigger: "blur" }],
				deptId: [{ required: true, type: 'number', message: '请选择上级部门名称', trigger: 'change' }]
			},
			btnLoading: false,
			editDeptDialog: false,
			editDeptForm: {
				parentId: '',
				deptName: '',
				deptId: undefined,
				leaderId: '',
				leader: '',
				areaId: undefined
			},
			editDeptData: [],
			rulesEditDept: {
				deptName: [{ required: true, type: 'string', message: "请输入部门名称", trigger: "blur" }],
				parentId: [{ required: true, type: 'number', message: '请选择上级部门名称', trigger: 'change' }]
			},
			currStaffList: [],
			areaListData: []
		}
	},
	created() {
		this.getAreaListData()
	},
	mounted() {
		this.getDeptEmpListData()
	},
	methods: {
		// 添加选择指定部门
		selectAddDept(e) {
			this.addDeptForm.deptId = e
			if(this.addDeptForm.deptId != undefined) {
				this.$nextTick(() => {
					this.$refs['addDeptForm'].validateField('deptId')
				})
			}
		},
		// 编辑选择指定部门
		selectEditDept(e) {
			this.editDeptForm.parentId = e
			if(this.editDeptForm.parentId != undefined) {
				this.$nextTick(() => {
					this.$refs['editDeptForm'].validateField('parentId')
				})
			}
		},
		// 选择主管
		selectLeader(e) {
			if(e){
				this.currStaffList.forEach((value,index) => {
					if(e==value.userId) {
						this.editDeptForm.leader = value.userName
						this.editDeptForm.leaderId = value.userId
					}
				})
			}else {
				this.editDeptForm.leader = ''
				this.editDeptForm.leaderId = ''
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
		// 查询当前用户所选择企业下的所有部门
		getSelectCurrDeptListData() {
			getSelectCurrDeptList().then(res => {
				if(res.code===200) {
					this.currDeptList = res.data
				}
			}).catch(err => {})
		},
		// 查询区域列表
		getAreaListData() {
			let params = {
				masterDeptId: parseInt(util.getStorage('masterDeptId'))
			}
			getAreaList(params).then(res => {
				if(res.code===200) {
					this.areaListData = res.data
				}
			}).catch(err => {
			})
		},
		// 打开添加部门对话框
		openAddDept() {
			this.resetForm()
			this.getSelectCurrDeptListData()
			this.title = '添加部门'
			this.addDeptDialog = true
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
		// 自定义区域键值
		normalizer_area(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.areaId,
				label: node.areaName,
				children: node.children,
				isDefaultExpanded: true
			}
		},
		// 添加部门--选择区域获取areaId
		selectAddArea(e) {
			this.addDeptForm.areaId = e
		},
		// 编辑部门--选择区域获取areaId
		selectEditArea(e) {
			this.editDeptForm.areaId = e
		},
		// 提交添加部门
		addSubmit() {
			this.btnLoading = true
			this.$refs['addDeptForm'].validate((valid) => {
				if(valid) {
					let params = {
						parentId: this.addDeptForm.deptId,
  						deptName: this.addDeptForm.deptName,
						areaId: this.addDeptForm.areaId
					}
					console.log(params)
					postCreateDept(params).then(res => {
						if(res.code===200) {
							this.addDeptDialog = false
							this.getDeptEmpListData()
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
		// 获取部门详细信息
		getDeptDetailData(id) {
			getDeptDetail(id).then(res => {
				if(res.code===200) {
					let data = res.data
					this.editDeptData = data
					this.editDeptForm.deptName = data.deptName
					this.editDeptForm.deptId = data.deptId
					this.editDeptForm.parentId = data.parentId
					this.editDeptForm.leaderId = data.leaderId
					this.editDeptForm.leader = data.leader
					this.editDeptForm.areaId = data.areaId
				}
			})
		},
		// 查询当前登录企业下所有人员
		getQueryCurrStaffData() {
			getQueryCurrStaff().then(res => {
				if(res.code===200) {
					this.currStaffList = res.data
				}
			})
		},
		// 打开编辑部门对话框
		openEdit(data) {
			this.resetForm()
			this.title = '编辑部门'
			this.editDeptDialog = true
			let deptId = data.deptId || this.ids
			this.getDeptDetailData(deptId)
			this.getQueryCurrStaffData()
		},
		// 删除部门
		toDelDept(data) {
			let ids = data.deptId || this.ids
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除吗？',
				loading: true,
				onOk: () => {
					deleteDept(ids).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getDeptEmpListData()
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
		// 提交编辑部门
		editSubmit() {
			this.btnLoading = true
			this.$refs['editDeptForm'].validate((valid) => {
				if(valid) {
					let params = {
						parentId: this.editDeptForm.parentId,
						deptId: this.editDeptForm.deptId,
  						deptName: this.editDeptForm.deptName,
						leaderId: this.editDeptForm.leaderId,
						leader: this.editDeptForm.leader,
						areaId: this.editDeptForm.areaId
					}
					console.log(params)
					postEditDept(params).then(res => {
						if(res.code===200) {
							this.editDeptDialog = false
							this.getDeptEmpListData()
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
					this.btnLoading = false
				}
			})
		},
		// 关闭弹窗
		closeDialog() {
			this.addDeptDialog = false
			this.editDeptDialog = false
		},
		// 清空
		resetForm() {
			this.btnLoading = false
			this.$refs['addDeptForm'].resetFields()
			this.$refs['editDeptForm'].resetFields()
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.deptId)
			this.single = selection.length!==1
			this.multiple = !selection.length
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getTaskListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getTaskListData()
		},
	}
}
</script>
<style lang="scss" scoped>
	.department {	
	}
</style>