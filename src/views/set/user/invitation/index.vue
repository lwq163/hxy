<template>
	<div class="invitation">
		<tab-menu></tab-menu>
		<div class="hxy-mb-25">
			<Table stripe border :columns="invitationTitle" :data="invitationData" :loading="pageLoading"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>
    </div>
</template>

<script>
import util from '_m/util'
import { mapGetters } from 'vuex'
import { getInvitationList,getConfirmInvitation,getDeclineInvitation } from '_s/invitation'
export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			invitationTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					width: 80
				},
				{
					title: '邀请时间',
					key: 'createTime',
					resizable: true,
				},
				{
					title: '企业名称',
					key: 'masterDeptName',
					resizable: true,
				},
				{
					title: '加入部门',
					key: 'deptName',
					resizable: true,
				},
				{
					title: '邀请人',
					resizable: true,
					key: 'inviter'
				},
				{
					title:'操作',
					key:'action',
					width: 250,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let status = params.row.status
						let statusName = this.deptApplyStatusList.filter(item => item.value == status)
						let btnArr = []
						if(status=='0') {
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
											this.refuse(params.row)
										}
									}
								}, '拒绝邀请'),
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
											this.join(params.row)
										}
									}
								}, '加入企业')
							)
						}else {
							btnArr.push(
								h('span',statusName[0].label)
							)
						}
						return h('div', btnArr)
					}
				}
			],
			invitationData: [],
			deptApplyStatusList: []
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
		})
	},
	mounted() {
		this.getInvitationData()
		this.deptApplyStatusList = this.filterDict(this.config,'sys_user_dept_apply_status')
	},
	methods: {
		// 获取列表数据
		getInvitationData() {
			this.pageLoading = true
			let params = {
				pageNum  : this.page,
				pageSize : this.pageSize
			}
			getInvitationList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.invitationData = res.rows
					this.total = res.total
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 拒绝
		refuse(data) {
			let params = {
				id: data.id
			}
			this.$Modal.confirm({
				title: '拒绝邀请',
				content: '确定拒绝邀请吗？',
				loading: true,
				onOk: () => {
					getDeclineInvitation(params).then(res => {
						if (res.code == 200) {
							this.$Message.success(res.msg)
							this.$Modal.remove()
							this.getInvitationData()
						}
					}).catch(res => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 加入
		join(data) {
			let params = {
				id: data.id
			}
			this.$Modal.confirm({
				title: '加入企业',
				content: '确定加入该企业吗？',
				loading: true,
				onOk: () => {
					getConfirmInvitation(params).then(res => {
						if (res.code == 200) {
							this.$Message.success(res.msg)
							this.$Modal.remove()
							this.getInvitationData()
						}
					}).catch(res => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getInvitationData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getInvitationData()
		}
	}
}
</script>
<style lang="scss" scoped>
	.invitation {	
	}
</style>