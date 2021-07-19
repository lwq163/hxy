<template>
	<div class="production">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="合同编号" prop="contractNo">
							<Input type="text" v-model="searchForm.contractNo" placeholder="请输入合同编号" />
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="制作状态" prop="productionStatus">
							<Select v-model="searchForm.productionStatus" placeholder="请选择制作状态" clearable filterable>
								<Option v-for="(val,index) in productionStatusData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="技术联系人" prop="technicalContact">
							<Input type="text" v-model="searchForm.technicalContact" placeholder="请输入技术联系人" />
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
			<Table stripe border :columns="orderListTitle" :data="orderListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

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
import { mapGetters } from 'vuex'
import {getWorkOrderFilePage} from '_s/order'
export default {
	data() {
		return {
			searchForm: {
				contractNo: '',
				productionStatus: '',
				technicalContact: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			productionStatusData: [],
			total: 0,
			pageLoading: false,//页面loading动画
			ids: [],
			single: true,
			multiple: true,
			title: '',
			orderListTitle: [
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
					title: '制作状态',
					key: 'productionStatusDesc',
					resizable: true,
					width: 100
				},
				{
					title: '审批状态',
					key: 'qualityApproveStatusDesc',
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
					title:'操作',
					key:'action',
					width: 250,
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
										this.taskDetail(params.row)
									}
								}
							}, '上传'),
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
							}, '提交'),
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
							}, '转单'),
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
						])
					}
				}
			],
			orderListData: [],
			previewDialog: false,
			imgUrl: ''
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
		this.productionStatusData = this.filterDict(this.config,'production_status')
	},
	methods: {
		// 获取工单制作列表列表数据
		getWorkOrderListData() {
			this.pageLoading = true
			let params = {
				contractNo: this.searchForm.contractNo || '',
				productionStatus: this.searchForm.productionStatus || '',
				technicalContact: this.searchForm.technicalContact || '',
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			getWorkOrderFilePage(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.orderListData = res.rows
					this.total = res.total
				}else {
					this.pageLoading = false
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 附件预览
		preview(data) {
			this.title = '图片预览'
			this.previewDialog = true
			this.imgUrl = data.path
		},
		// 附件下载
		download(data) {
			let openWindow = window.open('about:blank', '_blank')
			openWindow.location = data.path
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
			this.single = selection.length!==1
			this.multiple = !selection.length
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
	.production {	
	}
</style>