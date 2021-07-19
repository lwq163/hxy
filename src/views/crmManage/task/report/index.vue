<template>
	<div class="report">
		<tab-menu></tab-menu>
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="开始时间" prop="taskBeginTime">
							<DatePicker 
								type="date"
								:options="searchBeginOption"
								v-model="searchForm.taskBeginTime" 
								placeholder="开始时间" 
								:editable="false" 
								placement="bottom-start" 
								style="width: 100%"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="结束时间" prop="taskEndTime">
							<DatePicker
								type="date"
								:options="searchEndOption"
								v-model="searchForm.taskEndTime"
								placeholder="结束时间"
								:editable="false"
								placement="bottom-start"
								style="width: 100%"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="成员筛选" prop="userId">
							<Select v-model="searchForm.userId" placeholder="请选择成员" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="报备人" prop="createBy">
							<Select v-model="searchForm.createBy" placeholder="请选择报备人" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="报备时间" prop="createTime">
							<DatePicker 
								type="date"
								style="width: 100%"
								v-model="searchForm.createTime" 
								placeholder="报备时间" 
								:editable="false" 
								placement="bottom-start" 
								@on-change="selectCreateTime"
								clearable>
							</DatePicker>
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
			<Button type="primary" ghost class="hxy-mr-10" @click="openTaskDialog">新增报备任务</Button>
			<Button class="hxy-mr-10" @click="openTran">栏目标题</Button>
			<Button class="hxy-mr-10" :disabled="multiple">删除</Button>
			<!-- <Button class="hxy-mr-10" @click="exportFile">导出</Button> -->
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 新增报备任务弹出窗口 -->
		<Modal
			:title="title"
			v-model="taskDialog"
			@on-cancel="taskCancel"
			:width="720"
			:mask-closable="false">
			<Form :model="taskForm" ref="taskForm" :rules="rulesTask" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="12">
						<FormItem label="开始时间" prop="taskBeginTime">
							<DatePicker 
								type="date"
								:options="beginOption"
								v-model="taskForm.taskBeginTime" 
								placeholder="开始时间" 
								:editable="false" 
								placement="bottom-start" 
								@on-change="selectBeginTime"
								style="width: 100%"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem label="结束时间" prop="taskEndTime">
							<DatePicker
								type="date"
								:options="endOption"
								v-model="taskForm.taskEndTime" 
								placeholder="结束时间" 
								:editable="false" 
								placement="bottom-start"
								@on-change="selectEndTime"
								style="width: 100%"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
				</Row>
				<div class="hxy-mb-15" style="width: 90px; font-weight: 700; color: #464C5B">添加任务</div>
				<div>
					<Form :model="addTaskForm" ref="addTaskForm" :rules="rulesAddTask" label-position="left" :label-width="100">
						<Row :gutter="10">
							<Col span="12">
								<FormItem label="成员" prop="userId">
									<Select v-model="addTaskForm.userId" placeholder="请选择成员" clearable filterable @on-change="selectVal">
										<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
									</Select>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem label="任务内容" prop="taskContent">
									<Select v-model="addTaskForm.taskContent" placeholder="请选择任务内容" clearable filterable>
										<Option v-for="(val,index) in taskContent" :value="val.value" :key="index">{{val.label}}</Option>
									</Select>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem label="任务数量" prop="taskNums">
									<Input type="number" v-model="addTaskForm.taskNums" placeholder="请输入任务数量" />
								</FormItem>
							</Col>
							<Col span="12" class="tl">
								<Button type="default" @click="addTask">添加</Button>
							</Col>
						</Row>
					</Form>
				</div>
				<div class="hxy-mb-15">
					<Table stripe border :columns="addTaskTitle" :data="addTaskData"></Table>
				</div>
				<div class="hxy-mb-15" style="width: 90px; color: #9EA7B4">合计：</div>
				<div class="hxy-mb-15" style="width: 60%">
					<Table stripe border :columns="totalTitle" :data="totalData"></Table>
				</div>
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="生成智能绩效" prop="enableStatistics " :label-width="150">
							<Switch v-model="taskForm.enableStatistics " />
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="生成工作助手提醒" prop="enableAssistant" :label-width="150">
							<Switch v-model="taskForm.enableAssistant" />
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="备注" prop="remark">
							<Input type="textarea" v-model="taskForm.remark" :rows="4" placeholder="请输入备注" />
						</FormItem>
					</Col>
					<Col span="24">
						<modalUpLoad upLoadText="上传附件" @listenFile="listenFile"></modalUpLoad>
					</Col>
				</Row>
				<div class="hxy-mt-20 hxy-mb-15" style="color: #9EA7B4">审批流程展示：</div>
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="审批人" prop="approvalUserIds">
							<Select v-model="taskForm.approvalUserIds" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择审批人" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="抄送人" prop="ccUserIds">
							<Select v-model="taskForm.ccUserIds" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择抄送人" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="留言" prop="leaveMessage">
							<Input type="textarea" v-model="taskForm.leaveMessage" :rows="4" placeholder="请输入留言" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="taskCancel">取消</Button>
				<Button type="primary" @click="taskSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList" :TranListNo="TranListNo" @refresh= "refresh" @closeTran="closeTran" v-show="TranFlag"></tranFer>

		<!-- 指派任务详情 -->
		<Modal
			:title="title"
			v-model="detailDialog"
			:mask-closable="false"
			:width="720">
			<Spin size="large" fix v-if="modalLoading"></Spin>
			<div>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						开始时间：{{detailData.taskBeginTime || ''}}
					</Col>
					<Col span="12">
						结束时间：{{detailData.taskEndTime || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						指派人：{{this.user.nickName || ''}}
					</Col>
					<Col span="12">
						指派时间：{{detailData.createTime || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						<strong>任务详情</strong>
					</Col>
					<Col span="24">
						<Table stripe border :columns="taskDetailTitle" :data="taskDetailData"></Table>
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						<strong>任务合计</strong>
					</Col>
					<Col span="24">
						<Table stripe border :columns="taskTotalTitle" :data="taskTotalData"></Table>
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="6" v-if="detailData.enableStatistics ">
						<Button icon="ios-information-circle-outline" style="color: #2d8cf0; background: #f0faff; border-color: #abdcff;">已生成智能绩效</Button>
					</Col>
					<Col span="6" v-if="detailData.enableAssistant">
						<Button icon="ios-information-circle-outline" style="color: #2d8cf0; background: #f0faff; border-color: #abdcff;">已生成工作助手</Button>
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						备注：{{detailData.remark || '无'}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						<strong>附件</strong>
					</Col>
					<Col span="24">
						<div v-for="(item,index) in detailData.fileInfoList" :key="index" style="padding: 5px; display: flex; align-items: center;">
							<Icon :type="item.isImage?'md-image':'ios-paper'" style="margin-right: 5px; font-size: 16px;" />
							<Tooltip placement="top" :content="item.displayName" style="margin-right: 5px;">{{item.displayName}}</Tooltip>
							<Button type="primary" size="small" @click="preview(item)" v-if="item.isImage">预览</Button>
							<Button type="primary" size="small" @click="download(item)" v-else>下载</Button>
						</div>
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
import { getTaskList,postAddTask,deleteTask,getTaskDetail } from '_s/task'
import { getQueryCurrStaff,getSelectCurrDeptList } from '_s/enterprise'
import { mapGetters } from 'vuex'
import { getCrmTemp } from "_s/approval"
export default {
	data(){
		return{
			searchForm: {
				taskBeginTime: '',
				taskEndTime: '',
				deptId: undefined,
				belongName: '',
				createName: '',
				createTime: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			taskListData: [],
			taskListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
				},
				{
					title: '序号',
					key: 'taskOrderId',
					resizable: true,
					width: 80
				},
				{
					title: '任务开始时间',
					key: 'taskBeginTime',
					resizable: true,
					width: 200
				},
				{
					title: '任务结束时间',
					key: 'taskEndTime',
					resizable: true,
					width: 200
				},
				{
					title: '任务成员',
					key: 'name',
					resizable: true,
					width: 150
				},
				{
					title: '新增意向客户',
					key: 'newCustomer',
					resizable: true,
					width: 150
				},
				{
					title: '新增成交客户',
					key: 'newDealCustomer',
					resizable: true,
					width: 150
				},
				{
					title: '签单数量',
					key: 'signNums',
					resizable: true,
					width: 150
				},
				{
					title: '合同总额',
					key: 'contractMoney',
					resizable: true,
					width: 150
				},
				{
					title: '回款总额',
					key: 'incomeTotal',
					resizable: true,
					width: 150
				},
				{
					title: '报备人',
					key: 'createName',
					resizable: true,
					width: 150
				},
				{
					title: '报备时间',
					key: 'createTime',
					resizable: true,
					width: 200
				},
				{
					title: '附件',
					key: 'file',
					resizable: true,
					width: 300,
					render:(h, params) => {
						let fileList = []
						let arr = []
						let data = params.row.fileInfoList
						if(data.length > 0) {
							data.forEach((value,index) => {
								arr = [
									h('Icon', {
										props: {
											type: value.isImage?'md-image':'ios-paper',
										},
										style: {
											marginRight: '5px',
											fontSize: '16px'
										},
										class:'color-primary',
									})
								]
								arr.push(
									h('Tooltip',{
										props: {
											placement: 'top',
											content: value.displayName
										},
										style: {
											marginRight: '5px',
										}
									},value.displayName)
								)
								if(value.isImage) {
									// 预览
									arr.push(
										h('Button', {
											props: {
												type: 'primary',
												size: 'small'
											},
											style: {
												marginRight: '5px',
											},
											on: {
												click: () => {
													this.preview(value)
												}
											}
										}, '预览')
									)
								}else {
									// 下载
									arr.push(
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
													this.download(value)
												}
											}
										}, '下载')
									)
								}
								fileList.push(h('div',{
									style: {
										padding:'5px',
										display: 'flex',
										alignItems: 'center'
									}
								},arr))
							})
							
						}
						return h('div',fileList)
					}
				},
				{
					title:'操作',
					key:'action',
					width: 150,
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
										this.taskDetail(params.row)
									}
								}
							}, '详情'),
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
			taskForm: {
				id: null,
				taskBeginTime: '',
				taskEndTime: '',
				formatBeginTime: '',
				formatEndTime: '',
				enableStatistics : true,
				enableAssistant: true,
				remind: false,
				remark: '',
				approvalUserIds: [],
				ccUserIds: [],
				leaveMessage: ''
			},
			rulesTask: {
				taskBeginTime: [
					{ required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
				],
				taskEndTime: [
					{ required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }
				]
			},
			searchBeginOption: {
				// 开始时间必须小于结束时间
				disabledDate: (date) => {
					if (!this.searchForm.taskEndTime) {
						return date.getTime() < new Date(1970 - 1 - 1).getTime()
					} else {
						return date.getTime() > new Date(this.searchForm.taskEndTime)
					}
				}
			},
			searchEndOption: {
				// 结束时间必须大于开始时间
				disabledDate: (date) => {
					return (
						date.getTime() < new Date(this.searchForm.taskBeginTime) ||
						date.getTime() < new Date(1970 - 1 - 1).getTime()
					)
				}
			},
			beginOption: {
				// 开始时间必须小于结束时间
				disabledDate: (date) => {
					if (!this.taskForm.taskEndTime) {
						return date.getTime() < new Date(1970 - 1 - 1).getTime()
					} else {
						return date.getTime() > new Date(this.taskForm.taskEndTime)
					}
				}
			},
			endOption: {
				// 结束时间必须大于开始时间
				disabledDate: (date) => {
					return (
						date.getTime() < new Date(this.taskForm.taskBeginTime) ||
						date.getTime() < new Date(1970 - 1 - 1).getTime()
					)
				}
			},
			positionList: [],
			taskContent: [],
			addTaskData: [],
			addTaskTitle: [
				{
					title: '序号',
					key: 'id',
					width: 80
				},
				{
					title: '成员',
					key: 'nickName',
					width: 220
				},
				{
					title: '任务内容',
					key: 'taskContent',
					render: (h, params) => {
						let value = params.row.taskContent
						let taskContent = this.taskContent.filter((item) => {
							return item.value == value
						})
						return h('div',taskContent[0].label)
					}
				},
				{
					title: '任务数量',
					key: 'taskNums',
					width: 120
				},
				{
					title: '操作',
					key: 'action',
					width: 80,
					render: (h, params) => {
						return h('div',[
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									ghost: true
								},
								style: {
									color: '#3399FF'
								},
								on: {
									click: () => {
										this.toDel(params.row)
									}
								}
							}, '删除')
						])
					}
				}
			],
			totalData: [],
			totalTitle: [
				{
					title: '序号',
					type: 'index',
					width: 80,
				},
				{
					title: '任务内容',
					key: 'taskContent',
					render: (h, params) => {
						let value = params.row.taskContent
						let taskContent = this.taskContent.filter((item) => {
							return item.value == value
						})
						return h('div',taskContent[0].label)
					}
				},
				{
					title: '任务数量',
					key: 'taskNums'
				},
			],
			index: 0,
			addTaskForm: {
				orderDetailId: null,
				userId: '',
				taskContent: '',
				taskNums: ''
			},
			rulesAddTask: {
				userId: [
					{ required: true, type: 'number', message: "请选择成员", trigger: "blur" }
				],
				taskContent: [
					{ required: true, type: 'string', message: '请选择任务内容', trigger: 'change' }
				],
				taskNums: [
					{ required: true, message: '请输入任务数量', trigger: 'blur' }
				]
			},
			ccList: [
				{
					id: 1,
					name: '小明',
				},
				{
					id: 2,
					name: '小红',
				},
				{
					id: 3,
					name: '小黑',
				},
				{
					id: 4,
					name: '小白',
				},
				{
					id: 5,
					name: '小王',
				},
			],
			TranList: [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag: false,
			btnLoading: false,
			detailDialog: false,
			detailData: {},
			currStaffList: [],
			// 详情表格数据
			taskDetailData: [],
			taskDetailTitle: [
				{
					title: '序号',
					key: 'orderDetailId',
					width: 80
				},
				{
					title: '成员',
					key: 'nickName',
					width: 220
				},
				{
					title: '任务内容',
					key: 'taskContent'
				},
				{
					title: '任务数量',
					key: 'taskNums',
					width: 120
				}
			],
			taskTotalData: [],
			taskTotalTitle: [
				{
					title: '序号',
					type: 'index',
					width: 80,
				},
				{
					title: '任务内容',
					key: 'taskContent'
				},
				{
					title: '任务数量',
					key: 'taskNums'
				},
			],
			previewDialog: false,
			imgUrl: '',
			modalLoading: false,
			tempData: {},
			fileList: []
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
	},
	mounted(){
		this.getDeptData()
		this.getTaskListData()
		this.getQueryCurrStaffData()
		this.getTranList()
		this.getCrmTempData()
		this.taskContent = this.filterDict(this.config,'task_content')
	},
	methods: {
		// 选择创建时间
		selectCreateTime(e) {
			this.searchForm.createTime = e
		},
		// 选择任务开始时间
		selectBeginTime(e) {
			this.taskForm.formatBeginTime = e
		},
		// 选择任务结束时间
		selectEndTime(e) {
			this.taskForm.formatEndTime = e
		},
		// 获取任务列表数据
		getTaskListData() {
			this.pageLoading = true
			let params = {
				taskBeginTime: this.formatDate(this.searchForm.taskBeginTime) || '',
				taskEndTime: this.formatDate(this.searchForm.taskEndTime) || '',
				taskType: '2',
				userId: this.searchForm.userId,
				createBy: this.searchForm.createBy || '',
				createTime: this.searchForm.createTime || '',
				pageNum: this.searchForm.page, 
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
		// 查询当前登录企业下所有人员
		getQueryCurrStaffData() {
			getQueryCurrStaff().then(res => {
				if(res.code===200) {
					this.currStaffList = res.data
				}
			})
		},
		// 获取部门数据
		getDeptData() {
			getSelectCurrDeptList().then(res => {
				if(res.code===200) {
					this.positionList = res.data
				}else {
					this.$Message.error(res.msg)
				}
			})
		},
		// 获取详情
		getTaskDetailData(id) {
			this.modalLoading = true
			getTaskDetail(id).then(res => {
				if(res.code===200) {
					let data = JSON.parse(JSON.stringify(res.data))
					this.detailData = data
					this.taskDetailData = data.taskDetailVoList
					this.taskTotalData = this.sum(this.taskDetailData)
					this.modalLoading = false
				}
			}).catch(err => {
				this.modalLoading = false
			})
		},
		// 详情预览合计
		sum(arr) {
			let obj = {}
			let result = []
			arr.forEach(({taskContentValue, taskNums, taskContent}) => {
				let cur = obj[taskContentValue]
				if (cur) {
					let index = cur.index
					result[index].taskNums += taskNums
				} else {
					let index = result.length
					obj[taskContentValue] = {
						taskContentValue,
						index
					}
					result.push({taskContentValue, taskNums, taskContent})
				}
			})
			console.log(result)
			return result
		},
		// 查看任务详情
		taskDetail(data) {
			this.title = '报备任务详情'
			this.detailDialog = true
			this.getTaskDetailData(data.taskOrderId)
		},
		// 删除列表任务
		taskDel(data) {
			let ids = data.taskOrderId || this.ids
			console.log('ids',ids)
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除吗？',
				loading: true,
				onOk: () => {
					deleteTask(ids).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getTaskListData()
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
		// 获取审批模板
		getCrmTempData() {
			let params = {
				formName: 0
			}
			getCrmTemp(params).then(res => {
				if(res.code===200) {
					this.tempData = res.data
				}
			}).catch(err=>{})
		},
		// 打开新增报备任务弹框
		openTaskDialog() {
			this.title = '新增报备任务'
			this.taskDialog = true
			this.btnLoading = false
			this.resetForm()
			this.taskForm.approvalUserIds = this.tempData.approvalList.map(item=>item.userId)
			this.taskForm.ccUserIds = this.tempData.ccList.map(item=>item.userId)
		},
		// 清空新增报备任务弹框
		resetForm() {
			this.$refs['taskForm'].resetFields()
			this.index = 0
			this.addTaskData = []
			this.$refs['addTaskForm'].resetFields()
			this.totalData = []
			this.addTaskForm.position = ''
		},
		// 获取部门名称和id
		selectVal(e) {
			this.addTaskForm.userId = e
			this.addTaskForm.nickName = this.currStaffList.filter(val => val.userId==e)[0].nickName
		},
		// 添加任务
		addTask() {
			this.$refs['addTaskForm'].validate((valid) => {
				if(valid) {
					this.index++
					this.addTaskData.push(
						{
							id: this.index,
							userId: this.addTaskForm.userId,
							nickName: this.addTaskForm.nickName,
							taskContent: this.addTaskForm.taskContent,
							taskNums: this.addTaskForm.taskNums ? parseInt(this.addTaskForm.taskNums) : 0
						}
					)
					this.createArr()
					console.log('addTaskData',this.addTaskData)
				}
			})
		},
		// 删除添加的任务
		toDel(data) {
			this.addTaskData.forEach((item,index) => {
				if(item.id===data.id) {
					this.addTaskData.splice(index,1)
				}
			})
			this.createArr()
		}, 
		// 重组数组计算合计
		createArr() {
			let obj = {}
			let data = JSON.parse(JSON.stringify(this.addTaskData))
			data.forEach((value,index) => {
				if(obj.hasOwnProperty(value.taskContent)) {
					obj[value.taskContent] += value.taskNums
				}else {
					obj[value.taskContent] = value.taskNums
				}
			})
			let arr = []
			for(let [k , v] of Object.entries(obj)){
				console.log(k,v)
				arr.push({
					taskContent: k,
					taskNums: v
				})
			}
			this.totalData = arr
			console.log(this.totalData)
		},
		maxTag(num) {
			return 'more '+ num;
		},
		taskCancel() {
			this.taskDialog = false
		},
		//获取上传附件的数据
		listenFile(data,unType){
			this.fileList = data
		},
		// 提交任务
		taskSubmit() {
			this.btnLoading = true
			this.$refs['taskForm'].validate((valid) => {
				if(valid) {
					if(this.addTaskData.length == 0) {
						this.$Message.error('请添加任务')
						this.btnLoading = false
						return
					}
					let params = {
						taskType: '2',
						taskBeginTime: this.taskForm.formatBeginTime || this.formatDate(this.taskForm.taskBeginTime),
						taskEndTime: this.taskForm.formatEndTime || this.formatDate(this.taskForm.taskEndTime),
						enableStatistics : this.taskForm.enableStatistics ,
						enableAssistant: this.taskForm.enableAssistant,
						taskDetailDtoList: this.addTaskData,
						remark: this.taskForm.remark,
						approvalUserIds: this.taskForm.approvalUserIds,
						ccUserIds: this.taskForm.ccUserIds,
						leaveMessage: this.taskForm.leaveMessage,
						approvalTempId: this.tempData.id,
						fileList: this.fileList
					}
					postAddTask(params).then(res => {
						console.log(res)
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.getTaskListData()
							this.taskDialog = false
						}
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 附件预览
		preview(data) {
			this.title = '图片预览'
			this.previewDialog = true
			this.imgUrl = data.path
		},
		// 附件预览
		download(data) {
			let openWindow = window.open('about:blank', '_blank')
			openWindow.location = data.path
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
			this.single = selection.length!==1
			this.multiple = !selection.length
			console.log('选中的id',this.ids)
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
			this.searchForm.deptId = undefined
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
				taskBeginTime: this.formatDate(this.searchForm.taskBeginTime) || '',
				taskEndTime: this.formatDate(this.searchForm.taskEndTime) || '',
				taskType: '2',
				userId: this.searchForm.userId,
				createBy: this.searchForm.createBy || '',
				createTime: this.searchForm.createTime || '',
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			let fileName = '报备任务'
			let url = '/crm/task-order/export'
			this.axiosPost(url,params,fileName)
		}
	}
}
</script>
<style lang="scss" scoped>
	.report {
		/deep/.ivu-tooltip {
			height: 27px;
			line-height: 27px;
			.ivu-tooltip-rel {
				width: 150px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.task-part {
		padding: 15px; 
		border: 1px solid #e8eaec; 
		border-radius: 5px;
		.task-title {
			font-weight: 700; 
			color: #464C5B; 
			border-bottom: 1px solid #e8eaec;
		}
	}
</style>