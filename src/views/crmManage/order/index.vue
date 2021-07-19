<template>
	<div class="order">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="工单编号" prop="workOrderNo">
							<Input type="text" v-model="searchForm.workOrderNo" placeholder="请输入工单编号" />
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="合同编号" prop="contractNo">
							<Input type="text" v-model="searchForm.contractNo" placeholder="请输入合同编号" />
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="派工状态" prop="dispatchStatus">
							<Select v-model="searchForm.dispatchStatus" placeholder="请选择派工状态" clearable filterable>
								<Option v-for="(val,index) in dispatchStatusData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="技术联系人" prop="technicalContact">
							<Input type="text" v-model="searchForm.technicalContact" placeholder="请输入技术联系人" />
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="优先级" prop="priority">
							<Select v-model="searchForm.priority" placeholder="请选择优先级" clearable filterable>
								<Option v-for="(val,index) in priorityTypeData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col>
						<Button type="primary" @click="handleSearch('searchForm')" icon="ios-search" class="hxy-ml-30 hxy-mr-10">搜索</Button>
						<Button type="default" @click="handleReset('searchForm')" icon="ios-refresh">清空</Button>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="hxy-mb-25">
			<Button type="primary" :disabled="multiple" ghost class="hxy-mr-10" @click="openOrderDialog">批量派单</Button>
			<Button class="hxy-mr-10" @click="openFileListDialog">管理文件清单</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="orderListTitle" :data="orderListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 派单 -->
		<Modal
			:title="title"
			v-model="orderDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="720">
			<Form :model="orderForm" ref="orderForm" :rules="rulesOrder" label-position="left" :label-width="110">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="制作文件清单" prop="fileIds">
							<Select v-model="orderForm.fileIds" multiple :max-tag-count="5" :max-tag-placeholder="maxTag" placeholder="请选择制作文件清单" clearable filterable @on-change="selectFiles">
								<Option v-for="(val,index) in files" :value="val.id" :key="index">{{val.fileName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-25">
					<Table stripe border :columns="fileListTitle" :data="fileListData"></Table>
				</Row>
				<Row :gutter="10">
					<Col span="12">
						<FormItem label="内部审查时间" prop="qcTime">
							<DatePicker 
								type="date"
								v-model="orderForm.qcTime" 
								placeholder="内部审查时间" 
								:editable="false" 
								placement="bottom-start" 
								style="width: 100%"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem label="二次审查时间" prop="nextQcTime">
							<DatePicker
								type="date"
								v-model="orderForm.nextQcTime"
								placeholder="二次审查时间"
								:editable="false"
								placement="bottom-start"
								style="width: 100%"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="派单到当前企业成员" prop="belongUserId" :label-width="150">
							<Select v-model="orderForm.belongUserId" placeholder="请选择成员" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.userName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="handleSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 管理文件清单 -->
		<Modal
			:title="title"
			v-model="fileManageDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="720">
			<div class="hxy-mb-25">
				<Button type="primary" ghost @click="openAddFileDialog">添加文件</Button>
			</div>
			<div>
				<Table stripe border :columns="fileManageTitle" :data="fileManageData" :loading="openPageLoading"></Table>
			</div>
			<div slot="footer">
				<Button type="default" @click="closeDialog">关闭</Button>
			</div>
		</Modal>

		<!-- 添加文件 -->
		<Modal
			:title="secondTitle"
			v-model="addFileDialog"
			@on-cancel="addFileDialog=false"
			:mask-closable="false"
			:width="580">
			<Form :model="addFileForm" ref="addFileForm" :rules="rulesAddFile" label-position="left" :label-width="110">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="选择产品" prop="seriesRelId">
							<Cascader :data="productList" v-model="addFileForm.seriesRelId" placeholder="请选择选择产品"></Cascader>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="文件名称" prop="fileNames">
							<Input type="text" v-model="addFileForm.fileNames" placeholder="请输入文件名称,以分号“；”分隔" />
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="addFileDialog=false">取消</Button>
				<Button type="primary" @click="addSubmit">确定</Button>
			</div>
		</Modal>

		<!-- 编辑文件 -->
		<Modal
			:title="secondTitle"
			v-model="editFileDialog"
			@on-cancel="editFileDialog=false"
			:mask-closable="false"
			:width="580">
			<Form :model="editFileForm" ref="editFileForm" :rules="rulesEditFile" label-position="left" :label-width="110">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="产品名称" prop="seriesRelId">
							{{editFileForm.seriesName}}
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="文件名称" class="ivu-form-item-required">
							<Form ref="editForm" :model="editForm" label-position="left" :label-width="110">
								<FormItem
								v-for="(item, index) in editForm.files"
								:key="index"
								:prop="'files.' + index + '.fileName'"
								:rules="[{required: true, message: '请填写文件名称', trigger: 'blur'}]">
									<Col span="24" class="hxy-mb-15">
										<Input type="text" v-model="item.fileName" placeholder="请填写文件名称" style="width: 100%"/>
									</Col>
								</FormItem>
							</Form>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="editFileDialog=false">取消</Button>
				<Button type="primary" @click="editSubmit">确定</Button>
			</div>
		</Modal>

		<!-- 附件图片预览 -->
		<Modal 
			:title="title" 
			v-model="previewDialog">
			<img :src="imgUrl" style="width: 100%">
			<div slot="footer">
				<Button type="default" @click="previewDialog = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import util from '_m/util'
import { mapGetters } from 'vuex'
import {getWorkOrderList,getProductByProduct,getProductBySeries,postOrderDispatch,productSeriesFileList,getProductSeries,postSaveProductFile,putUpdateProductFile,deleteProduct,postSignedSeal,postSubmit} from '_s/order'
import {getQueryCurrStaff} from '_s/companyBase'
export default {
	data() {
		return {
			searchForm: {
				workOrderNo: '',
				contractNo: '',
				dispatchStatus: '',
				technicalContact: '',
				priority: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			dispatchStatusData: [],
			priorityTypeData: [],
			total: 0,
			pageLoading: false,//页面loading动画
			openPageLoading: false,
			btnLoading: false,
			ids: [],
			productIds: [],
			single: true,
			multiple: true,
			title: '',
			orderListTitle: [
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
					title: '工单编号',
					key: 'workOrderNo',
					resizable: true,
					width: 200
				},
				{
					title: '合同编号',
					key: 'contractNo',
					resizable: true,
					width: 200
				},
				{
					title: '合同摘要',
					key: 'contractAbstract',
					resizable: true,
					width: 200
				},
				{
					title: '产品名称',
					key: 'productName',
					resizable: true,
					width: 200
				},
				{
					title: '数量',
					key: 'number',
					resizable: true,
					width: 80
				},
				{
					title: '技术联系人',
					key: 'technicalContact',
					resizable: true,
					width: 150
				},
				{
					title: '联系方式',
					key: 'technicalContactTelPhone',
					resizable: true,
					width: 200
				},
				{
					title: '指定代理人',
					key: 'appointedAgent',
					resizable: true,
					width: 150
				},
				{
					title: '优先级',
					key: 'priorityDesc',
					resizable: true,
					width: 100
				},
				{
					title: '要求交付时间',
					key: 'planFinishDate',
					resizable: true,
					width: 200
				},
				{
					title: '制作要求',
					key: 'manufactureRequirements',
					resizable: true,
					width: 200
				},
				{
					title: '附件',
					key: 'files',
					resizable: true,
					width: 300,
					render:(h, params) => {
						let fileList = []
						let arr = []
						let data = params.row.files
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
					title: '派工状态',
					key: 'dispatchStatusDesc',
					resizable: true,
					width: 100
				},
				{
					title: '文件清单',
					key: 'workFile',
					resizable: true,
					width: 100
				},
				{
					title: '完工时间',
					key: 'finishDate',
					resizable: true,
					width: 200
				},
				{
					title: '内部质检时间',
					key: 'qcTime',
					resizable: true,
					width: 200
				},
				{
					title: '质检意见',
					key: 'qcSuggestion',
					resizable: true,
					width: 200
				},
				{
					title: '二次质检时间',
					key: 'nextQcTime',
					resizable: true,
					width: 200
				},
				{
					title: '二次质检意见',
					key: 'nextQcSuggestion',
					resizable: true,
					width: 200
				},
				{
					title: '盖章时间',
					key: 'sealTime',
					resizable: true,
					width: 200
				},
				{
					title: '递交时间',
					key: 'submitTime',
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
						let status = params.row.dispatchStatus
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
							}, '详情')
						)
						if(status===0) {
							btnArr.unshift(
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
											this.openOrderDialog(params.row)
										}
									}
								}, '派单')
							)
						}
						if(status===3) {
							btnArr.unshift(
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
											this.signedSeal(params.row)
										}
									}
								}, '盖章')
							)
						}
						if(status===4) {
							btnArr.unshift(
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
											this.orderSubmit(params.row)
										}
									}
								}, '递交')
							)
						}
						if(status===5) {
							btnArr = []
						}
						return h('div', btnArr)
					}
				}
			],
			orderListData: [],
			orderDialog: false,
			orderForm: {
				fileIds: [],
				qcTime: '',
				nextQcTime: '',
				belongUserId: ''
			},
			rulesOrder: {
				fileIds: [
					{ required: true, type: 'array', message: "请选择制作文件清单", trigger: "blur" },
				]
			},
			files: [],
			fileListTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					width: 80
				},
				{
					title: '文件名称',
					key: 'fileName',
					resizable: true,
				},
				{
					title:'操作',
					key:'action',
					width: 100,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
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
			fileListData: [],
			currStaffList: [],
			previewDialog: false,
			imgUrl: '',
			fileManageDialog: false,
			fileManageTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					width: 80
				},
				{
					title: '产品名称',
					key: 'seriesName',
					resizable: true,
					width: 150
				},
				{
					title: '文件清单',
					key: 'fileName',
					resizable: true,
				},
				{
					title:'操作',
					key:'action',
					width: 150,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
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
										this.delProduct(params.row)
									}
								}
							}, '清空'),
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
										this.editProduct(params.row)
									}
								}
							}, '编辑')
						])
					}
				}
			],
			fileManageData: [],
			secondTitle: '',
			addFileDialog: false,
			addFileForm: {
				seriesRelId: [],
				fileNames: ''
			},
			rulesAddFile: {
				seriesRelId: [
					{ required: true, type: 'array', message: "请选择选择产品", trigger: "change" },
				],
				fileNames: [{ required: true, message: "请输入文件名称,以分号“；”分隔", trigger: "blur" },]
			},
			productList: [],
			editFileDialog: false,
			editFileForm: {
				seriesName: ''
			},
			rulesEditFile: {},
			productName: '',
			editForm: {
				files:[
					{
						id: '',
                		fileName: ''
					}
				]
			}
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config'
		})
	},
	created() {},
	mounted() {
		this.getWorkOrderListData()
		this.getQueryCurrStaffData()
		this.getProductSeriesData()
		this.dispatchStatusData = this.filterDict(this.config,'dispatch_status')
		this.priorityTypeData = this.filterDict(this.config,'priority_type')
	},
	methods: {
		// 获取派单列表数据
		getWorkOrderListData() {
			this.pageLoading = true
			let params = {
				workOrderNo: this.searchForm.workOrderNo || '',
				contractNo: this.searchForm.contractNo || '',
				dispatchStatus: this.searchForm.dispatchStatus || '',
				technicalContact: this.searchForm.technicalContact || '',
				priority: this.searchForm.priority || '',
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			getWorkOrderList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.orderListData = res.rows
					this.total = res.total
					this.multiple = true
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
		// 查询产品系列
		getProductSeriesData() {
			getProductSeries().then(res => {
				if(res.code===200) {
					this.productList = JSON.parse(JSON.stringify(res.rows).replace(/"id"/g,"\"value\"").replace(/"series"/g,"\"label\""))
					this.productList.forEach(value => {
						if (value.children && !value.children.length) {
							delete value.children;
						}
					})
				}
			})
		},
		// 附件预览
		preview(data) {
			this.title = '图片预览'
			this.previewDialog = true
			this.imgUrl = data.url
		},
		// 附件下载
		download(data) {
			let openWindow = window.open('about:blank', '_blank')
			openWindow.location = data.url
		},
		// 根据产品ID获取产品文件清单列表(派单)
		getProductSeriesFileData(id) {
			getProductByProduct(id).then(res => {
				if(res.code===200) {
					this.files = res.data
				}
			}).catch(err=>{})
		},
		// 打开派单对话框
		openOrderDialog(data) {
			this.resetForm()
			this.orderForm.ids = data.id?[data.id]:this.ids
			if(data.productId) {
				this.title = '派单'
				this.orderDialog = true
				this.getProductSeriesFileData(data.productId)
			}else {
				if(util.isAllEqual(this.productIds)) {
					this.title = '派单'
					this.orderDialog = true
					this.getProductSeriesFileData(this.productIds[0])
				}else {
					this.orderDialog = false
					this.$Message.error('请选择同一产品批量派单')
				}
			}
		},
		maxTag(num) {
			return 'more '+ num;
		},
		// 选择文件清单
		selectFiles(e) {
			let arr = []
			this.files.forEach((value,index) => {
				e.forEach(item => {
					if(value.id == item) {
						arr.push({
							id: value.id,
							fileName: value.fileName
						})
					}
				})
			})
			this.fileListData = arr
		},
		// 删除文件
		toDel(data) {
			this.fileListData.forEach((value,index) => {
				if(value.id===data.id) {
					this.fileListData.splice(index,1)
				}
			})
			this.orderForm.fileIds = this.fileListData.map(item => item.id)
		},
		// 提交派单
		handleSubmit() {
			this.btnLoading = true
			this.$refs['orderForm'].validate(valid => {
				if(valid) {
					let params = {
						ids: this.orderForm.ids,
						qcTime: this.formatDate(this.orderForm.qcTime) || '',
						nextQcTime: this.formatDate(this.orderForm.nextQcTime) || '',
						belongUserId: this.orderForm.belongUserId,
						workOrderFiles: this.fileListData
					}
					console.log(params)
					postOrderDispatch(params).then(res => {
						if(res.code===200) {
							this.orderDialog = false
							this.getWorkOrderListData()
							this.multiple = true
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
		// 盖章
		signedSeal(data) {
			let id = data.id
			this.$Modal.confirm({
				title: '确认盖章',
				content: '请确认文件已全部盖章',
				loading: true,
				onOk: () => {
					postSignedSeal(id).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getWorkOrderListData()
							this.$Message.success(res.msg)
						}
					}).catch(err => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 递交
		orderSubmit(data) {
			let id = data.id
			this.$Modal.confirm({
				title: '确认递交',
				content: '请确认文件已全部递交',
				loading: true,
				onOk: () => {
					postSubmit(id).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getWorkOrderListData()
							this.$Message.success(res.msg)
						}
					}).catch(err => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 打开管理文件清单对话框
		openFileListDialog() {
			this.title = '管理文件清单'
			this.fileManageDialog = true
			this.getProductListData()
		},
		// 获取企业产品文件清单列表
		getProductListData() {
			this.openPageLoading = true
			productSeriesFileList().then(res => {
				if(res.code===200) {
					this.openPageLoading = false
					this.fileManageData = res.data
				}else {
					this.openPageLoading = false
				}
			}).catch(err => {
				this.openPageLoading = false
			})
		},
		// 添加文件对话框
		openAddFileDialog() {
			this.resetForm()
			this.secondTitle = '添加文件'
			this.addFileDialog = true
		},
		// 提交添加文件
		addSubmit() {
			this.btnLoading = true
			this.$refs['addFileForm'].validate(valid => {
				if(valid) {
					let params = {
						seriesRelId: this.addFileForm.seriesRelId[this.addFileForm.seriesRelId.length-1],
						fileNames: this.addFileForm.fileNames.split(/[\n\s+,，；;]/g)
					}
					postSaveProductFile(params).then(res => {
						if(res.code===200) {
							this.getProductListData()
							this.$Message.success(res.msg)
							this.addFileDialog = false
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
		// 清空文件清单
		delProduct(data) {
			let seriesRelId = data.seriesRelId
			this.$Modal.confirm({
				title: '清空文件',
				content: '确定清空文件清单吗？',
				loading: true,
				onOk: () => {
					deleteProduct(seriesRelId).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.getProductListData()
							this.$Message.success(res.msg)
						}
					}).catch(err => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 根据产品ID获取产品文件清单列表(管理文件)
		getProductBySeriesData(id) {
			getProductBySeries(id).then(res => {
				if(res.code===200) {
					let arr = []
					let val = JSON.parse(JSON.stringify(res.data))
					val.forEach((value,index) => {
						arr.push({
							id: value.id,
							fileName: value.fileName
						})
					})
					this.editForm.files = arr
				}
			}).catch(err=>{})
		},
		// 编辑文件对话框
		editProduct(data) {
			console.log(data)
			this.resetForm()
			this.secondTitle = '编辑文件'
			this.editFileDialog = true
			this.editFileForm.seriesName = data.seriesName
			this.getProductBySeriesData(data.seriesRelId)
		},
		// 提交编辑文件
		editSubmit() {
			this.btnLoading = true
			this.$refs['editForm'].validate(valid => {
				if(valid) {
					let params = {
						updates: this.editForm.files
					}
					putUpdateProductFile(params).then(res => {
						if(res.code===200) {
							this.getProductListData()
							this.$Message.success(res.msg)
							this.editFileDialog = false
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
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
			this.productIds = selection.map(item => item.productId)
			this.multiple = !selection.length
		},
		// 关闭
		closeDialog() {
			this.orderDialog = false
			this.fileManageDialog = false
		},
		// 清空
		resetForm() {
			this.btnLoading = false
			this.$refs['orderForm'].resetFields()
			this.$refs['addFileForm'].resetFields()
		},
		// 搜索
		handleSearch() {
			this.searchForm.page = 1
			this.getWorkOrderListData()
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.searchForm.page = 1
			this.getWorkOrderListData()
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.page = pages
			this.getWorkOrderListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.getWorkOrderListData()
		}
	}
}
</script>
<style lang="scss" scoped>
	.order {	
	}
</style>