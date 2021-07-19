<template>
    <div class="password">
		<tab-menu></tab-menu>
		<div>
			<Form :model="pswForm" ref="pswForm" :rules="rulesPsw" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="6">
						<FormItem label="原密码" prop="curPsw">
							<Input type="password" v-model="pswForm.curPsw" placeholder="请输入原密码" />
						</FormItem>
						<FormItem label="新密码" prop="newPsw">
							<Input type="password" v-model="pswForm.newPsw" placeholder="请输入新密码" />
						</FormItem>
						<FormItem label="确认密码" prop="verifyPsw">
							<Input type="password" v-model="pswForm.verifyPsw" placeholder="请输入确认密码" />
						</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div><Button type="primary" @click="pswSubmit" :loading="btnLoading">确定</Button></div>
    </div>
</template>

<script>
export default {
	data() {
		return {
			pswForm: {
				curPsw: '',
				newPsw: '',
				verifyPsw: ''
			},
			rulesPsw: {
				curPsw: [
					{ required: true, message: '请输入原密码', trigger: 'blur'}
				],
				newPsw: [
					{ required: true, message: '请输入新密码', trigger: 'blur'}
				],
				verifyPsw: [
					{ required: true, message: '请输入确认密码', trigger: 'blur'}
				],
			},
			btnLoading: false
		}
	},
	mounted() {},
	methods: {
		// 修改密码提交
		pswSubmit() {
			this.btnLoading = true
			this.$refs['pswForm'].validate((valid) => {
				if(valid) {
					if(this.pswForm.curPsw === this.pswForm.newPsw) {
						this.$Message.error('原密码不能和新密码相同，请重新输入')
						this.btnLoading = false
						return
					}
					if(this.pswForm.verifyPsw !== this.pswForm.newPsw) {
						this.$Message.error('新密码和确认密码不一致，请重新输入')
						this.btnLoading = false
						return
					}
					console.log('通过')
				}else {
					this.btnLoading = false
				}
			})
		},
	}
}
</script>
<style lang="scss" scoped>
	.password {	
	}
</style>