<template>
    <div class="approval">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="表单分类" prop="formTypeName">
							<Select v-model="searchForm.formTypeName" placeholder="请选择表单分类" clearable filterable>
								<Option v-for="(val,index) in formTypeList" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="表单名称" prop="formName">
							<Select v-model="searchForm.formName" placeholder="请选择表单名称" clearable filterable>
								<Option v-for="(val,index) in formNameList" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="更新时间" prop="updateTime">
							<DatePicker 
								type="date"
								style="width: 100%"
								v-model="searchForm.updateTime" 
								placeholder="更新时间" 
								:editable="false" 
								placement="bottom-start" 
								@on-change="selectUpdateTime"
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
		<!-- <div class="hxy-mb-25">
			<Button type="primary" ghost @click="exportFile">导出</Button>
		</div> -->
		<div class="hxy-mb-25">
			<Table stripe border :columns="approvalTitle" :data="approvalData" :loading="pageLoading"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 审批单设置弹出窗口 -->
		<Modal
			:title="title"
			v-model="approvalDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="720">
			<Form :model="approvalForm" ref="approvalForm" :rules="rulesApproval" label-position="left" :label-width="110">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="设置发起人" prop="isLaunchAll" class="redDot">
							<RadioGroup v-model="approvalForm.isLaunchAll">
								<Col span="24">
									<FormItem>
										<Radio :label=1 :disabled="isDisabled">全企业</Radio>
									</FormItem>
								</Col>
								<Col span="24">
									<Row>
										<Col span="7">
											<FormItem>
												<Radio :label=0 :disabled="isDisabled">特定成员/区域/部门</Radio>
											</FormItem>
										</Col>
										<Col span="17" v-if="approvalForm.isLaunchAll===0">
											<FormItem>
												<tree-select :multiple="true" :limit="4" value-consists-of="ALL" :clearable="true" :normalizer="normalizer" v-model="approvalForm.deptIds" :options="orgList" :show-count="true" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择特定成员/区域/部门" @input="selectOrg" :disabled="isDisabled" />
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
						<FormItem label="设置审核人" class="redDot">
							<Col span="24">
								<FormItem prop="examineIsAddImmediateSuperior">
									<Checkbox v-model="approvalForm.examineIsAddImmediateSuperior" :disabled="isDisabled">直属上级</Checkbox>
								</FormItem>
							</Col>
							<Col span="24">
								<Row class="hxy-mb-20">
									<Col span="7">
										<FormItem prop="isExamine">
											<Checkbox v-model="approvalForm.isExamine" :disabled="isDisabled">审核成员</Checkbox>
										</FormItem>
									</Col>
									<Col span="17" v-if="approvalForm.isExamine">
										<FormItem prop="examineIds">
											<Select v-model="approvalForm.examineIds" :disabled="isDisabled" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择审批成员,可多选" clearable filterable>
												<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
											</Select>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="7">
										<FormItem>
											审核意见填写提示
										</FormItem>
									</Col>
									<Col span="17">
										<FormItem class="notRedDot" prop="examineAlertMessage">
											<Input v-model="approvalForm.examineAlertMessage" :disabled="isDisabled" type="textarea" :rows="4" placeholder="请输入审核意见填写提示" class="fl" />
										</FormItem>
									</Col>
								</Row>
							</Col>
						</FormItem>
					</Col>
				</Row>

				<Row :gutter="10">
					<Col span="24">
						<FormItem label="设置审批人" class="redDot">
							<Col span="24">
								<FormItem prop="approvalIsAddImmediateSuperior">
									<Checkbox v-model="approvalForm.approvalIsAddImmediateSuperior" :disabled="isDisabled">直属上级</Checkbox>
								</FormItem>
							</Col>
							<Col span="24">
								<Row class="hxy-mb-20">
									<Col span="7">
										<FormItem prop="isApproval">
											<Checkbox v-model="approvalForm.isApproval" :disabled="isDisabled">审批成员</Checkbox>
										</FormItem>
									</Col>
									<Col span="17" v-if="approvalForm.isApproval">
										<FormItem prop="approvalUserIds">
											<Select v-model="approvalForm.approvalUserIds" :disabled="isDisabled" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择审批成员,可多选" clearable filterable>
												<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
											</Select>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="7">
										<FormItem>
											审批意见填写提示
										</FormItem>
									</Col>
									<Col span="17">
										<FormItem class="notRedDot" prop="alertMessage">
											<Input v-model="approvalForm.alertMessage" :disabled="isDisabled" type="textarea" :rows="4" placeholder="请输入审批意见填写提示" class="fl" />
										</FormItem>
									</Col>
								</Row>
							</Col>
						</FormItem>
					</Col>
				</Row>

				<Row :gutter="10">
					<Col span="24">
						<FormItem label="设置抄送人" class="redDot">
							<Col span="24">
								<FormItem prop="carbonCopyIsAddImmediateSuperior">
									<Checkbox v-model="approvalForm.carbonCopyIsAddImmediateSuperior" :disabled="isDisabled">直属上级</Checkbox>
								</FormItem>
							</Col>
							<Col span="24">
								<Row>
									<Col span="7">
										<FormItem prop="isCc">
											<Checkbox v-model="approvalForm.isCc" :disabled="isDisabled">抄送成员</Checkbox>
										</FormItem>
									</Col>
									<Col span="17" v-if="approvalForm.isCc">
										<FormItem prop="ccUserIds">
											<Select v-model="approvalForm.ccUserIds" :disabled="isDisabled" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择抄送成员,可多选" clearable filterable>
												<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
											</Select>
										</FormItem>
									</Col>
								</Row>
							</Col>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="setSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import {getApprovalTempList,getQueryCurrStaff,getAllOrgStructure,getApprovalTempDetail,postApprovalTempEdit} from '_s/approvalProcess'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			searchForm: {
				formTypeName: '',
				formName: '',
				updateTime: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			total: 0,
			pageLoading: false,//页面loading动画
			title: '',
			btnLoading: false,
			approvalTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					width: 80
				},
				{
					title: '表单分类',
					key: 'formTypeName',
					resizable: true,
					render: (h, params) => { 
						let id = params.row.formTypeName
						let type = this.formTypeList.filter(item => item.value == id) 
						return h('div', type.length>0?type[0].label:'') 
					}
				},
				{
					title: '表单名称',
					key: 'formName',
					resizable: true,
					render: (h, params) => { 
						let id = params.row.formName
						let name = this.formNameList.filter(item => item.value == id)
						return h('div', name.length>0?name[0].label:'') 
					}
				},
				{
					title: '最后更新',
					key: 'updateTime',
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
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.toSet(params.row)
									}
								}
							}, '设置'),
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
										this.toView(params.row)
									}
								}
							}, '详情')
						])
					}
				}
			],
			approvalData: [],
			formTypeList: [],
			formNameList: [],
			approvalForm: {
				id: null,
				isLaunchAll: '',
				// 审核参数
				examineIsAddImmediateSuperior: false,
				isExamine: false,
				examineIds: [],
				examineAlertMessage: '',
				// 审批参数
				approvalIsAddImmediateSuperior: false,
				isApproval: false,
				approvalUserIds: [],
				alertMessage: '',
				// 抄送参数
				carbonCopyIsAddImmediateSuperior: false,
				isCc: false,
				ccUserIds: [],
				deptIds: [],
				launchDeptScope: [],
				launchCreateByScope: []
			},
			rulesApproval: {},
			approvalDialog: false,
			approvalUserList: [],
			ccUserList: [],
			currStaffList: [],
			orgList: [],
			isDisabled: false
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
		})
	},
	created() {},
	mounted() {
		this.getApprovalTempData()
		this.getQueryCurrStaffData()
		this.getAllOrgStructureData()
		this.formTypeList = this.filterDict(this.config,'crm_form_type')
		this.formNameList = this.filterDict(this.config,'crm_form_name')
	},
	methods: {
		// 选择更新时间
		selectUpdateTime(e) {
			this.searchForm.updateTime = e
		},
		// 查询crm审批模板配置
		getApprovalTempData() {
			this.pageLoading = true
			let params = {
				formTypeName: this.searchForm.formTypeName,
				formName: this.searchForm.formName,
				updateTime: this.searchForm.updateTime,
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			getApprovalTempList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.approvalData = res.rows
					this.total = res.total
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 查询当前登录企业下所有用户
		getQueryCurrStaffData() {
			getQueryCurrStaff().then(res => {
				if(res.code===200) {
					this.currStaffList = res.data
				}
			})
		},
		// 查询组织架构列表
		getAllOrgStructureData() {
			let masterDeptId = parseInt(util.getStorage('masterDeptId'))
			getAllOrgStructure(masterDeptId).then(res => {
				if(res.code===200) {
					let val = res.data
					this.orgList = val
				}
			})
		},
		// 组织架构自定义键值
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.id,
				label: node.name,
				isDefaultExpanded: true
			}
		},
		// 选择组织架构
		selectOrg(e) {
			let deptIds = []
			let createIds = []
			e.forEach((value,index) => {
				let obj = util.getIdData(this.orgList,'id',value)
				if(obj.type===1) {
					deptIds.push(obj.id)
				}else if(obj.type===2) {
					createIds.push(obj.id)
				}
			})
			this.approvalForm.launchDeptScope = deptIds
			this.approvalForm.launchCreateByScope = createIds
		},
		// 查看审批模板配置详情
		getApprovalTempDetailData(id) {
			let params = {
				id: id
			}
			getApprovalTempDetail(params).then(res => {
				if(res.code===200) {
					let val = res.data
					this.approvalForm.isLaunchAll = val.isLaunchAll
					this.approvalForm.deptIds = eval(val.launchDeptScope).concat(eval(val.launchCreateByScope))
					// 审核
					this.approvalForm.examineIsAddImmediateSuperior = val.examineIsAddImmediateSuperior==1?true:false
					this.approvalForm.isExamine = val.examineList.length>0?true:false
					if(val.examineList.length>0) {
						this.approvalForm.examineIds = val.examineList.map(item => item.userId)
					}
					this.approvalForm.examineAlertMessage = val.examineAlertMessage
					// 审批
					this.approvalForm.approvalIsAddImmediateSuperior = val.approvalIsAddImmediateSuperior==1?true:false
					this.approvalForm.isApproval = val.approvalList.length>0?true:false
					if(val.approvalList.length>0) {
						this.approvalForm.approvalUserIds = val.approvalList.map(item => item.userId)
					}
					this.approvalForm.alertMessage = val.alertMessage
					// 抄送
					this.approvalForm.carbonCopyIsAddImmediateSuperior = val.carbonCopyIsAddImmediateSuperior==1?true:false
					this.approvalForm.isCc = val.ccList.length>0?true:false
					if(val.ccList.length>0) {
						this.approvalForm.ccUserIds = val.ccList.map(item => item.userId)
					}
				}
			}).catch(err => {})
		},
		// 打开设置弹窗
		toSet(data) {
			this.resetForm()
			this.isDisabled = false
			this.approvalDialog = true
			this.title = '审批单设置'
			this.approvalForm.id = data.id
			this.getApprovalTempDetailData(data.id)
		},
		maxTag(num) {
			return 'more '+ num;
		},
		// 提交设置
		setSubmit() {
			// 设置发起人
			if(this.approvalForm.isLaunchAll==='') {
				this.$Message.error('请选择设置发起人')
				return
			}
			// 设置审核人
			let a = this.approvalForm.examineIsAddImmediateSuperior
			let b = this.approvalForm.isExamine
			let examineArr = [a,b]
			let c = examineArr.some(item => item==true)
			if(!c) {
				this.$Message.error('请选择设置审核人')
				this.btnLoading = false
				return
			}
			if(b) {
				if(this.approvalForm.examineIds.length==0) {
					this.$Message.error('请选择审核成员')
					this.btnLoading = false
					return
				}
			}
			// 设置审批人
			let d = this.approvalForm.approvalIsAddImmediateSuperior
			let e = this.approvalForm.isApproval
			let approvalArr = [d,e]
			let f = approvalArr.some(item => item==true)
			if(!f) {
				this.$Message.error('请选择设置审批人')
				this.btnLoading = false
				return
			}
			if(e) {
				if(this.approvalForm.approvalUserIds.length==0) {
					this.$Message.error('请选择审批成员')
					this.btnLoading = false
					return
				}
			}
			// 设置抄送人
			let g = this.approvalForm.carbonCopyIsAddImmediateSuperior
			let h = this.approvalForm.isCc
			let ccArr = [g,h]
			let i = ccArr.some(item => item==true)
			if(!i) {
				this.$Message.error('请选择设置抄送人')
				this.btnLoading = false
				return
			}
			if(h) {
				if(this.approvalForm.ccUserIds.length==0) {
					this.$Message.error('请选择抄送成员')
					this.btnLoading = false
					return
				}
			}
			let params = {
				id: this.approvalForm.id,
				isLaunchAll: this.approvalForm.isLaunchAll,
				examineIsAddImmediateSuperior: this.approvalForm.examineIsAddImmediateSuperior?1:0,
				examineIds: this.approvalForm.isExamine?this.approvalForm.examineIds:[],
				examineAlertMessage: this.approvalForm.examineAlertMessage,
				approvalIsAddImmediateSuperior: this.approvalForm.approvalIsAddImmediateSuperior?1:0,
				approvalUserIds: this.approvalForm.isApproval?this.approvalForm.approvalUserIds:[],
				alertMessage: this.approvalForm.alertMessage,
				carbonCopyIsAddImmediateSuperior: this.approvalForm.carbonCopyIsAddImmediateSuperior?1:0,
				ccUserIds: this.approvalForm.isCc?this.approvalForm.ccUserIds:[],
				launchDeptScopeList: this.approvalForm.launchDeptScope,
				launchCreateByScopeList: this.approvalForm.launchCreateByScope,
			}
			console.log('params',params)
			postApprovalTempEdit(params).then(res => {
				if(res.code===200) {
					this.approvalDialog = false
					this.getApprovalTempData()
					this.$Message.success(res.msg)
				}
			})
		},
		// 打开查看详情弹框
		toView(data) {
			this.resetForm()
			this.isDisabled = true
			this.approvalDialog = true
			this.title = '查看审批单详情'
			this.approvalForm.id = data.id
			this.getApprovalTempDetailData(data.id)
		},
		// 关闭弹窗
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
			this.getApprovalTempData()
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.getApprovalTempData()
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.page = pages
			this.getApprovalTempData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.getApprovalTempData()
		},
		// 导出
		exportFile() {
			let params = {
				formTypeName: this.searchForm.formTypeName,
				formName: this.searchForm.formName,
				updateTime: this.searchForm.updateTime,
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			let fileName = '审批模板'
			let url = '/system/approvalTemp/export'
			this.axiosPost(url,params,fileName)
		}
	}
}
</script>
<style>
	
</style>
<style lang="scss" scoped>
	/deep/.redDot .ivu-form-item-label:before {
		content: '*';
		display: inline-block;
		margin-right: 4px;
		line-height: 1;
		font-family: SimSun;
		font-size: 14px;
		color: #ed4014;
	}
	/deep/.notRedDot .ivu-form-item-label:before {
		display: none;
	}
</style>