<template>
	<div class="allNotice">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="时间" prop="createTime">
							<DatePicker 
								type="date"
								style="width: 100%"
								v-model="searchForm.createTime" 
								placeholder="创建时间" 
								:editable="false" 
								placement="bottom-start" 
								@on-change="selectCreateTime"
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="发送人" prop="sendUserId">
							<Select v-model="searchForm.sendUserId" placeholder="请选择发送人" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.nickName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="状态" prop="isRead">
							<Select v-model="searchForm.isRead" placeholder="请选择状态" clearable filterable>
								<Option v-for="(val,index) in statusList" :value="val.value" :key="index">{{val.label}}</Option>
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
			<!-- <Button type="primary" ghost class="hxy-mr-10" @click="exportFile">导出</Button> -->
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="noticeListTitle" :data="noticeListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 消息详情 -->
		<Modal
			:title="title"
			v-model="detailDialog"
			:mask-closable="false"
			:width="720">
			<div>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						时间：{{detailData.createTime || ''}}
					</Col>
					<Col span="12">
						发送人：{{detailData.nickName || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						内容：{{detailData.content || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						状态：{{statusTxt}}
					</Col>
					<Col span="12">
						消息类别：{{typeTxt}}
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
import { mapGetters } from 'vuex'
import { getQueryCurrStaff } from '_s/enterprise'
import { getNoticeList } from '_s/notice'
export default {
	data() {
		return {
			searchForm: {
				isRead: '',
				createTime: '',
				sendUserId: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},			
			total: 0,
			pageLoading: false,//页面loading动画
			ids: [],
			single: true,
			multiple: true,
			title: '',
			noticeListTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					width: 80
				},
				{
					title: '消息内容',
					key: 'content',
					resizable: true,
				},
				{
					title: '发送人',
					key: 'nickName',
					resizable: true,
					width: 200,
				},
				{
					title: '时间',
					key: 'createTime',
					resizable: true,
					width: 200
				},
				{
					title: '状态',
					key: 'isRead',
					resizable: true,
					width: 200,
					render:(h, params) => {
						let isRead = params.row.isRead
						let status = this.statusList.filter(item => {
							return item.value == isRead
						})
						return h('div',status[0].label)
					}
				},
				{
					title: '消息类别',
					key: 'type',
					resizable: true,
					width: 200,
					render:(h, params) => {
						let type = params.row.type
						let typeLabel = this.noticeType.filter(item => {
							return item.value == type
						})
						return h('div',typeLabel[0].label)
					}
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
						])
					}
				}
			],
			noticeListData: [],
			btnLoading: false,
			currStaffList: [],
			statusList: [],
			noticeType: [],
			detailDialog: false,
			detailData: {},
			statusTxt: '',
			typeTxt: ''
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
			isRead: 'get_isRead'
		})
	},
	watch:{
		'isRead': {
			handler(val,oldVal){
				if(val) {
					this.getNoticeListData()
				}
            },
            immediate: true
		}
	},
	created() {
		this.getQueryCurrStaffData()
		this.statusList = this.filterDict(this.config,'sys_notice_message_status')
		this.noticeType = this.filterDict(this.config,'sys_notice_message_type')
	},
	mounted() {
		this.getNoticeListData()
	},
	methods: {
		// 选择创建时间
		selectCreateTime(e) {
			this.searchForm.createTime = e
		},
		// 获取消息列表数据
		getNoticeListData() {
			this.pageLoading = true
			let params = {
				createTime: this.searchForm.createTime || '',
				sendUserId: this.searchForm.sendUserId,
				isRead: this.searchForm.isRead,
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			getNoticeList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.noticeListData = res.rows
					this.noticeListData.forEach((value,index) => {
						this.currStaffList.forEach((v,i) => {
							if(value.sendUserId==v.userId) {
								this.noticeListData[index].nickName = v.nickName
							}
						})
					})
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
		// 打开查看详情弹窗
		toDetail(data) {
			this.title = '消息详情'
			this.detailDialog = true
			this.detailData = data
			this.statusTxt = this.statusList.filter(item => item.value==data.isRead)[0].label
			this.typeTxt = this.noticeType.filter(item => item.value==data.type)[0].label
		},
		// 关闭选择成员对话框
		closeDialog() {
			this.detailDialog = false
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
			this.single = selection.length!==1
			this.multiple = !selection.length
		},
		// 搜索
		handleSearch() {
			this.getNoticeListData()
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.searchForm.deptId = undefined
			this.getNoticeListData()
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getNoticeListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getNoticeListData()
		},
		// 导出
		exportFile() {
			let params = {
				createTime: this.searchForm.createTime || '',
				sendUserId: this.searchForm.userId,
				isRead: this.searchForm.isRead,
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			let fileName = '消息'
			let url = '/system/sysNoticeMessage/export'
			this.axiosPost(url,params,fileName)
		}
	}
}
</script>
<style lang="scss" scoped>
</style>