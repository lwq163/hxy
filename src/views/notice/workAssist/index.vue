<template>
	<div class="workAssist">
		工作助手
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
			btnLoading: false
		}
	},
	mounted() {},
	methods: {
		
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
</style>