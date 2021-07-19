<template>
    <div class="approval">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="提交时间" prop="createTime">
							<DatePicker 
								type="date"
								v-model="searchForm.createTime" 
								placeholder="提交时间" 
								:editable="false" 
								placement="bottom-start" 
								style="width: 100%"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="提交人" prop="createBy">
							<Select v-model="searchForm.createBy" placeholder="请选择提交人" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="审批人" prop="approvalUserId">
							<Select v-model="searchForm.approvalUserId" placeholder="请选择审批人" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
                    <Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="抄送人" prop="ccUserId">
							<Select v-model="searchForm.ccUserId" placeholder="请选择抄送人" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
                    <Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="表单名称" prop="formName">
                            <Select v-model="searchForm.formName" placeholder="请选择表单名称" clearable filterable>
                                <Option v-for="(item, index) in approvalFormList" :key="index" :value="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="审批状态" prop="status">
                            <Select v-model="searchForm.status" placeholder="请选择审批状态" clearable filterable>
                                <Option v-for="(val,index) in approveStatus" :value="val.value" :key="index">{{val.label}}</Option>
                            </Select>
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
			<Table stripe border :columns="approvalListTitle" :data="approvalListData" :loading="pageLoading"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 通过/驳回 -->
		<Modal
			:title="title"
			v-model="approvalDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="approvalForm" ref="approvalForm" :rules="rulesApproval" label-position="left" :label-width="80">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="原因" prop="approvalResult">
							<Input type="text" v-model="approvalForm.approvalResult" placeholder="请输入原因"/>
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
import { approvalDocumentList, approvalDocumentById, approvalDocumentApproval } from '_s/approval'
import { getQueryCurrStaff } from '_s/enterprise'
import { mapGetters} from 'vuex'
export default {
    data() {
        return {
            searchForm: {
				createTime: '',
				createBy: '',
				approvalUserId: '',
				ccUserId: '',
				formName: '',
				status: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			approvalListData: [],
			approvalListTitle: [
				{
					title: '序号',
					type: 'index',
					resizable: true,
					width: 80
				},
				{
					title: '提交时间',
					key: 'createTime',
					resizable: true,
					width: 200
				},
				{
					title: '发起人',
					key: 'createByName',
					resizable: true,
					width: 200
				},
				{
					title: '表单名称',
					key: 'formNameStr',
					resizable: true,
					width: 200
				},
				{
					title: '留言',
					key: 'leaveMessage',
					resizable: true,
					width: 200
				},
				{
					title: '审核人',
					resizable: true,
					width: 200,
					render: (h, params) => {
						let nameArr = []
						let data = params.row.examineList
						if(data && data.length > 0) {
							data.forEach((value,index) => {
								nameArr.push(
									h('div',value.userName)
								)
							})
						}
						return h('div',{style: {padding:'10px 0'}},nameArr)
					}
				},
				{
					title: '审批人',
					resizable: true,
					width: 200,
					render: (h, params) => {
						let nameArr = []
						let data = params.row.approvalDocumentPersonnelDtos
						if(data && data.length > 0) {
							data.forEach((value,index) => {
								nameArr.push(
									h('div',value.userName)
								)
							})
						}
						return h('div',{style: {padding:'10px 0'}},nameArr)
					}
				},
				{
					title: '抄送人',
					resizable: true,
					width: 200,
					render: (h, params) => {
						let nameArr = []
						let data = params.row.ccList
						if(data && data.length > 0) {
							data.forEach((value,index) => {
								nameArr.push(
									h('div',value.userName)
								)
							})
						}
						return h('div',{style: {padding:'10px 0'}},nameArr)
					}
				},
				{
					title: '审批状态',
					key: 'statusName',
					resizable: true,
					width: 200
				},
				{
					title:'操作',
					key:'action',
					width: 200,
                    align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let btnArr = []
						let status = params.row.status 
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
										this.toDetail(params.row)
									}
								}
							}, '查看')
						)
						if(status==0) {
							btnArr.unshift(
								h('Button', {
									props: {
										type: 'success',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.openApprovalDialog(params.row,2)
										}
									}
								}, '通过'),
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
											this.openApprovalDialog(params.row,3)
										}
									}
								}, '驳回'),
							)
						}
						return h('div', btnArr)
					}
				}
			],
			total: 0,
			pageLoading: false,//页面loading动画
            currStaffList: [],
            btnLoading: false,
			title: '',
            approveStatus: [],
            approvalFormList: [],
			approvalDialog: false,
			approvalForm: {
				approvalResult: ''
			},
			rulesApproval: {
				approvalResult: [{ required: true, type: 'string', message: "请输入原因", trigger: "blur" }],
			},
			curStatus: '',
			curId: '',
			approvalDetail: {}
        }
    },
    computed: {
		...mapGetters({
			config: 'get_config'
		})
	},
    mounted() {
        this.getQueryCurrStaffData()
        this.approvalDocumentListData()
        this.approveStatus = this.filterDict(this.config,'crm_approval_status')
        this.approvalFormList = this.filterDict(this.config, 'crm_form_name')
    },
    methods: {
        // 查询审批列表
        approvalDocumentListData() {
            this.pageLoading = true
			let params = {
				createTime: this.searchForm.createTime || '',
				createBy: this.searchForm.createBy || '',
				approvalUserId: this.searchForm.approvalUserId || '',
				ccUserId: this.searchForm.ccUserId || '',
				formName: this.searchForm.formName || '',
				status: this.searchForm.status || '',
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			approvalDocumentList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
                    this.approvalListData = res.rows
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
		// 根据id查询审批件详情
		approvalDocumentByIdData(id) {
			let params = {
				id: id
			}
			approvalDocumentById(params).then(res=> {
				if(res.code===200) {
					this.approvalDetail = res.data
				}
			})
		},
		// 打开通过/驳回对话框
		openApprovalDialog(data,status) {
			this.resetForm()
			this.approvalDialog = true
			this.curStatus = status
			this.curId = data.id
			if(this.curStatus==2) {
				this.title = '通过'
			}else{
				this.title = '驳回'
			}
		},
		// 详情对话框
		toDetail(data) {
			this.approvalDocumentByIdData(data.id)
			this.$router.push({name:'report',query: {id:1}})
		},
		// 提交通过/驳回
		handleSubmit() {
			this.btnLoading = true
			this.$refs['approvalForm'].validate((valid) => {
				if(valid) {
					let params = {
						id: this.curId,
						status: this.curStatus,
						approvalResult: this.approvalForm.approvalResult
					}
					console.log('params',params)
					approvalDocumentApproval(params).then(res => {
						if(res.code===200) {
							this.approvalDialog = false
							this.approvalDocumentListData()
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
		// 关闭对话框
		closeDialog() {
			this.approvalDialog = false
		},
		// 清空
		resetForm() {
			this.btnLoading = false
			this.$refs['approvalForm'].resetFields()
		},
        // 搜索
		handleSearch() {
			this.approvalDocumentListData()
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.approvalDocumentListData()
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.page = pages
			this.approvalDocumentListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.approvalDocumentListData()
		},
    }
}
</script>
<style lang="scss" scoped>
	.approval {	
	}
</style>