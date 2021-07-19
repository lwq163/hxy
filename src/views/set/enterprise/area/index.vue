<template>
	<div class="area">
		<tab-menu></tab-menu>
		<div class="hxy-mb-30">
			<Button type="primary" ghost class="hxy-mr-10" @click="openAddArea">添加区域</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border row-key="areaId" :columns="areaListTitle" :data="areaListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>

		<!-- 添加/编辑部门 -->
		<Modal
			:title="title"
			v-model="addAreaDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="addAreaForm" ref="addAreaForm" :rules="rulesAddArea" label-position="left" :label-width="120">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="区域名称" prop="areaName">
							<Input type="text" v-model="addAreaForm.areaName" placeholder="请输入区域名称"/>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="上级区域" prop="parentId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer" :clearable="true" v-model="addAreaForm.parentId" :options="areaListData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择上级区域" @input="selectArea" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="addSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import {getAreaList,postAddArea,postEditArea,deleteArea,getAreaByIdList} from '_s/area'
export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			areaListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '区域名称',
					key: 'areaName',
					resizable: true,
					tree: true
				},
				{
					title: '区域编号',
					key: 'areaCode',
					resizable: true,
				},
				{
					title: '部门数',
					key: 'deptNum',
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
						return h('div', btnArr)
					}
				}
			],
			areaListData: [],
			ids: [],
			single: true,
			multiple: true,
			title: '',
			btnLoading: false,
			addAreaDialog: false,
			addAreaForm: {
				areaId: null,
				areaName: '',
				parentId: undefined,
			},
			rulesAddArea: {
				areaName: [{ required: true, type: 'string', message: "请输入区域名称", trigger: "blur" }],
			},
			areaDetail: {}
		}
	},
	mounted() {
		this.getAreaListData()
	},
	methods: {
		// 查询区域列表
		getAreaListData() {
			this.pageLoading = true
			let params = {
				masterDeptId: parseInt(util.getStorage('masterDeptId'))
			}
			getAreaList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.areaListData = res.data
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 根据id查询区域列表
		getAreaByIdListData(id) {
			getAreaByIdList(id).then(res => {
				if(res.code===200) {
					let data = res.data
					this.areaDetail = data
					this.addAreaForm.areaId = data.areaId
					this.addAreaForm.areaName = data.areaName
					this.addAreaForm.parentId = data.parentId?data.parentId:undefined
				}
			})
		},
		// 选择区域获取parentId
		selectArea(e) {
			this.addAreaForm.parentId = e
		},
		// 自定义键值
		normalizer(node) {
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
		// 打开添加区域对话框
		openAddArea() {
			this.resetForm()
			this.title = '添加区域'
			this.addAreaDialog = true
		},
		// 打开编辑区域对话框
		toEdit(data) {
			this.resetForm()
			this.title = '编辑区域'
			this.addAreaDialog = true
			this.getAreaByIdListData(data.areaId)
		},
		// 提交添加区域
		addSubmit() {
			this.btnLoading = true
			this.$refs['addAreaForm'].validate((valid) => {
				if(valid) {
					let params = {
						areaId: this.addAreaForm.areaId,
						areaName: this.addAreaForm.areaName,
						parentId: this.addAreaForm.parentId?this.addAreaForm.parentId:0
					}
					if(this.addAreaForm.areaId) {
						console.log('更新',params)
						postEditArea(params).then(res => {
							if(res.code===200) {
								this.addAreaDialog = false
								this.getAreaListData()
								this.$Message.success(res.msg)
							}else{
								this.$Message.error(res.msg)
							}
						}).catch(err => {
							this.btnLoading = false
						})
					}else {
						console.log('新增',params)
						postAddArea(params).then(res => {
							if(res.code===200) {
								this.addAreaDialog = false
								this.getAreaListData()
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
		// 删除区域
		toDel(data) {
			let areaId = data.areaId
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除吗？',
				loading: true,
				onOk: () => {
					deleteArea(areaId).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getAreaListData()
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
		// 关闭选择成员对话框
		closeDialog() {
			this.addAreaDialog = false
		},
		// 清空
		resetForm() {
			this.addAreaForm.areaId = null
			this.btnLoading = false
			this.$refs['addAreaForm'].resetFields()
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.areaId)
			this.single = selection.length!==1
			this.multiple = !selection.length
		}
	}
}
</script>
<style lang="scss" scoped>
</style>