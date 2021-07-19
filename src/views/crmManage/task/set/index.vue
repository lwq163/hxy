<template>
    <div class="signature">
		<tab-menu></tab-menu>
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="时间" prop="date">
                            <DatePicker type="daterange" format="yyyy/MM/dd" :editable="false" v-model="searchForm.date" @on-change="selectDate" placeholder="开始时间 ～ 结束时间" style="width: 100%"></DatePicker>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="部门筛选" prop="belongId">
							<tree-select v-model="searchForm.belongId" :options="positionList" :show-count="true" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择部门" />
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="指派人" prop="createName">
                            <Input type="text" v-model="searchForm.createName" placeholder="请输入指派"></Input>
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
			<Button type="primary" ghost class="hxy-mr-10" @click="openTaskDialog">新增任务内容</Button>
			<Button class="hxy-mr-10" @click="openTran">栏目标题</Button>
			<Button class="hxy-mr-10" :disabled="multiple" @click="taskDel">删除</Button>
			<!-- <Button class="hxy-mr-10" @click="exportFile">导出</Button> -->
		</div>
		<div class="hxy-mb-25">
            <Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
        </div>
        <div class="pos-r tr">
            <Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>

		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList" :TranListNo="TranListNo" @refresh= "refresh" @closeTran="closeTran" v-show="TranFlag"></tranFer>
		<Modal
            title="新增任务内容"
            v-model="taskDialog"
            @on-cancel="taskCancel"
            :width="650"
			:mask-closable="false">
			<Form :model="taskForm" ref="taskForm" :rules="rulesTask" label-position="left" :label-width="100">
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="8">
						创建人：123
					</Col>
					<Col span="8">
						创建时间：123
					</Col>
				</Row>
				<Row :gutter="10">
					<Col span="18">
						<FormItem label="任务内容" prop="taskContent">
							<Input type="text" v-model="taskForm.taskContent" placeholder="请输入任务内容"></Input>
						</FormItem>
					</Col>
					<Col span="18">
						<FormItem label="任务单位" prop="unit">
							<Input type="text" v-model="taskForm.unit" placeholder="请输入任务单位"></Input>
						</FormItem>
					</Col>
					<Col span="18">
						<FormItem label="备注" prop="remark">
							<Input type="textarea" v-model="taskForm.remark" :rows="4" placeholder="请输入备注"></Input>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
                <Button type="default" @click="taskCancel">取消</Button>
                <Button type="primary" @click="taskSubmit" :loading="btnLoading">确定</Button>
            </div>
		</Modal>
    </div>
</template>

<script>
import { getDept} from '_s/task'
export default {
	data() {
		return {
			searchForm: {
				date: [],
				belongId: undefined,
				createName: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
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
					key: 'id',
					resizable: true,
					width: 80
				},
				{
					title: '创建时间',
					key: 'createTime',
					resizable: true,
					width: 150
				},
				{
					title: '创建人',
					key: 'createName',
					resizable: true,
					width: 150
				},
				{
					title: '任务内容',
					key: 'taskContent',
					resizable: true,

				},
				{
					title: '任务单位',
					key: 'unit',
					resizable: true,
				},
				{
					title: '备注',
					key: 'remark',
					resizable: true,
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.taskDetail(params.row)
									}
								}
							}, '详情'),
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
										this.taskEdit(params.row)
									}
								}
							}, '编辑'),
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
										this.taskDel(params.row)
									}
								}
							}, '删除')
						])
					}
				}
			],
			total: 0,
			pageLoading: false,//页面loading动画
			ids: [],
			single: true,
			multiple: true,
			title: '',
			taskDialog: false,
			positionList: [],
			taskForm: {
				taskContent: '',
				unit: '',
				remark: '',
			},
			rulesTask: {
				taskContent: [
					{ required: true, message: '请输入任务内容', trigger: 'blur' }
				],
				unit: [
					{ required: true, message: '请输入任务单位', trigger: 'blur' }
				]
			},
			btnLoading: false,
			TranList: [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag: false
		}
	},
	mounted() {
		this.getDeptData()
		this.getTranList()
	},
	methods: {
		// 选择开始结束时间
		selectDate(e) {
			this.searchForm.date = e
		},
		// 获取任务列表数据
		getTaskListData() {
			this.pageLoading = true
			let params = {
				taskBegintime: this.searchForm.date[0] || '',
				taskEndtime: this.searchForm.date[1] || '',
				belongId: this.searchForm.belongId || '',
				createName: this.searchForm.createName || '',
				page: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			getTaskList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.taskListData = res.rows
					this.total = res.total
				}else {
					this.pageLoading = false
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 获取部门数据
		getDeptData() {
			getDept().then(res => {
				if(res.code===200) {
					this.positionList = res.data
				}else {
					this.$Message.error(res.msg)
				}
			})
		},
		// 获取详情
		getTaskDetailData(id) {
			getTaskDetail(id).then(res => {
				if(res.code===200) {
					let data = res.data
					console.log('data',data)
					this.detailData = data
					this.taskForm = {
						id: data.id || null,
						taskBegintime: data.taskBegintime,
						taskEndtime: data.taskEndtime,
						generateStatistics: data.generateStatistics == '1' ? true : false,
						enable: data.enable == '1' ? true : false
					}
				}
			})
		},
		// 查看任务详情
		taskDetail(data) {
			this.title = '任务内容详情'
			this.detailDialog = true
			this.getTaskDetailData(data.id)
		},
		// 编辑任务
		taskEdit(data) {
			let id = data.id || this.ids
			this.title = '编辑任务内容'
			this.taskDialog = true
			this.btnLoading = false
			this.resetForm()
			this.getTaskDetailData(id)
		},
		// 删除列表任务
		taskDel(data) {
			let ids = data.id || this.ids
			console.log('ids',ids)
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除吗？',
				loading: true,
				onOk: () => {
					// deleteTask(ids).then(res => {
					// 	if(res.code===200) {
					// 		this.$Modal.remove()
					// 		this.getTaskListData()
					// 		this.$Message.success(res.msg)
					// 	}
					// })
				}
			})
		},
		// 打开任务弹框
		openTaskDialog() {
			this.title = '新增任务内容'
			this.taskDialog = true
			this.btnLoading = false
			this.resetForm()
		},
		// 清空新增指派任务弹框
		resetForm() {
			this.taskForm.id = null
			this.$refs['taskForm'].resetFields()
		},
		taskCancel() {
			this.taskDialog = false
		},
		taskSubmit() {
			this.$refs['taskForm'].validate((valid) => {
				if(valid) {
					console.log('ps')
				}
			})
		},
		// 获取部门名称和id
		selectVal(val) {
			this.addTaskForm.belongName = val.label
			this.addTaskForm.belongId = val.id
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
			this.single = selection.length!==1
			this.multiple = !selection.length
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
		},
		// 搜索
		handleSearch() {
			this.getTaskListData()
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.searchForm.belongId = undefined
			this.getTaskListData()
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.page = pages
			this.getTaskListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.getTaskListData()
		},
		// 导出
		exportFile() {
			let params = {
				taskBegintime: this.searchForm.date[0] || '',
				taskEndtime: this.searchForm.date[1] || '',
				taskType: '1',
				belongId: this.searchForm.belongId || '',
				createName: this.searchForm.createName || '',
				page: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			let fileName = this.$route.path.split('/').slice(-1)

			let url = '/crm/task/export'
			this.axiosPost(url,params,fileName[0])
		}
	}
}
</script>
<style lang="scss" scoped>
	.signature {	
	}
</style>