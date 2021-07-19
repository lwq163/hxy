<template>
	<div class="admin">
		<tab-menu></tab-menu>
		<div class="hxy-mb-25" style="display: flex; height: 32px; align-items:flex-end;">
			<Button type="primary" ghost @click="openAdminDialog">添加主管理员</Button>
			<div class="hxy-pl-15" style="color: #999;">主管理员可以设置子管理员并维护管理组，支持对主管理员进行敏感权限隔离</div>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="adminTitle" :data="adminData" :loading="pageLoading"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 选择成员 -->
		<Modal
			:title="title"
			v-model="adminDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<div class="hxy-mb-10">选择：</div>
			<div class="box-bg hxy-mb-20">
				<Tree :data="treeData" show-checkbox multiple select-node check-directly @on-check-change="checkChange"></Tree>
			</div>
			<div class="hxy-mb-10">已选：</div>
			<div class="box-bg">

			</div>
			<div slot="footer">
				<Button type="default" @click="closeDialog">关闭</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			adminDialog:false,
			title: '',
			adminTitle: [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					width: 80
				},
				{
					title: '姓名',
					key: 'name',
					resizable: true,
				},
				{
					title: '部门',
					key: 'department',
					resizable: true,
				},
				{
					title: '工号',
					key: 'number',
					resizable: true,
				},
				{
					title: '创建人',
					key: 'create',
					resizable: true,
				},
				{
					title: '敏感权限隔离（智能人事权限）',
					key: 'power',
					resizable: true,
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
									type: 'error',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.toDel(params.row)
									}
								}
							}, '删除'),
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
										this.toTransfer(params.row)
									}
								}
							}, '转让')
						])
					}
				}
			],
			adminData: [
				{
					id: 1,
					name: '小王',
					department: '研发部门',
					number: '001',
					create: '小王',
					power: '已隔离'
				},
				{
					id: 2,
					name: '小王',
					department: '研发部门',
					number: '001',
					create: '小王',
					power: '已隔离'
				},
				{
					id: 3,
					name: '小王',
					department: '研发部门',
					number: '001',
					create: '小王',
					power: '已隔离'
				},
				{
					id: 4,
					name: '小王',
					department: '研发部门',
					number: '001',
					create: '小王',
					power: '已隔离'
				},
				{
					id: 5,
					name: '小王',
					department: '研发部门',
					number: '001',
					create: '小王',
					power: '已隔离'
				}
			],
			treeData:  [
				{
					title: '江苏弘扬',
					id: 1,
					expand: true,
					children: [
						{
							title: '研发中心',
							id: 2,
							expand: true,
							children: [
								{
									id: 4,
									title: '小王',
								},
								{
									id: 5,
									title: '小红'
								}
							]
						},
						{
							title: '营销中心',
							id: 3,
							expand: false,
							children: [
								{
									id: 6,
									title: '小白',
								},
								{
									id: 7,
									title: '小黑'
								}
							]
						}
					]
				}
			],
			btnLoading: false
		}
	},
	mounted() {},
	methods: {
		checkChange(e) {
			console.log(e)
		},
		// 获取列表数据
		getAdminData() {
			
		},
		// 转让
		toTransfer(data) {
			this.$Modal.confirm({
				title: '转让',
				content: '确定转让吗？',
				loading: true,
				onOk: () => {
					this.$Modal.remove()
					this.$Message.success('操作成功')
				}
			})
		},
		// 删除
		toDel(data) {
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除吗？',
				loading: true,
				onOk: () => {
					this.$Modal.remove()
					this.$Message.success('删除成功')
				}
			})
		},
		// 打开选择成员对话框
		openAdminDialog() {
			this.title = '选择成员'
			this.adminDialog = true
		},
		// 关闭选择成员对话框
		closeDialog() {
			this.adminDialog = false
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getAdminData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getAdminData()
		}
	}
}
</script>
<style lang="scss" scoped>
	.admin {	
	}
	.box-bg {
		background: #F8F8F9;
		padding: 10px;
	}
</style>