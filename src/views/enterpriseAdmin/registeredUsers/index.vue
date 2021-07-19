<template>
    <div class="registeredUsers">
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="用户名称" prop="userName">
                            <Input type="text" v-model="searchForm.userName" placeholder="请输入用户名称"></Input>
                        </FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="手机" prop="phone">
                            <Input type="text" v-model="searchForm.phone" placeholder="请输入手机"></Input>
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
			<Button type="primary" ghost class="hxy-mr-10" @click="openUserDiolog">创建用户</Button>
			<Button class="hxy-mr-10" :disabled="multiple" @click="toPass">批量通过</Button>
			<Button class="hxy-mr-10" :disabled="multiple" @click="openRefuseDialog">批量拒绝</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="userListTitle" :data="userListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 创建用户弹出窗口 -->
		<Modal
			:title="title"
			v-model="userDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="userForm" ref="userForm" :rules="rulesUser" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="用户名称" prop="userName">
                            <Input type="text" v-model="userForm.userName" placeholder="请输入用户名称"></Input>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="用户昵称" prop="nickName">
                            <Input type="text" v-model="userForm.nickName" placeholder="请输入用户昵称"></Input>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="职位" prop="position">
                            <Input type="text" v-model="userForm.position" placeholder="请输入职位"></Input>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="邮箱" prop="email">
							<AutoComplete v-model="userForm.email" placeholder="请输入邮箱" @on-search="selectEmail">
								<Option v-for="item in emailArr" :value="item" :key="item">{{ item }}</Option>
							</AutoComplete>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="手机" prop="phone">
                            <Input type="text" v-model="userForm.phone" placeholder="请输入手机"></Input>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="申请加入统一社会信用代码" prop="creditCode" :label-width="200">
                            <Input type="text" v-model="userForm.creditCode" placeholder="请输入申请加入统一社会信用代码"></Input>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="申请加入机构名称" prop="organizationName" :label-width="150">
                            <Input type="text" v-model="userForm.organizationName" placeholder="请输入申请加入机构名称"></Input>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="用户密码" prop="password">
                            <Input type="password" v-model="userForm.password" placeholder="请输入用户密码"></Input>
                        </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="确认密码" prop="verifyPsw">
							<Input type="password" v-model="userForm.verifyPsw" placeholder="请输入确认密码" />
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="是否限制登录" prop="isLimitLogin">
                            <Switch v-model="userForm.isLimitLogin" />
                        </FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="handleSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 拒绝申请弹出窗口 -->
		<Modal
			:title="title"
			v-model="refuseDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="420">
			<Form :model="refuseForm" ref="refuseForm" :rules="rulesRefuse" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="拒绝理由" prop="reason">
                            <Input type="text" v-model="refuseForm.reason" placeholder="请输入拒绝理由"></Input>
                        </FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="toRefuse" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import {getUserPreList,postAddUserPre,postBatchPass,postBatchRefuse,getUserPreValidateE,getUserPreValidateP,getUserPreValidateU} from '_s/enterpriseAdmin'
export default {
	data() {
		return {
			searchForm: {
				userName: '',
				phone: '',
				page: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			total: 0,
			pageLoading: false,//页面loading动画
			ids: [],
			single: true,
			multiple: true,
			title: '',
			userListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '用户ID',
					key: 'userId',
					resizable: true,
					width: 200
				},
				{
					title: '用户名称',
					key: 'userName',
					resizable: true,
					width: 200
				},
				{
					title: '用户昵称',
					key: 'nickName',
					resizable: true,
					width: 200
				},
				{
					title: '职位',
					key: 'position',
					resizable: true,
					width: 200
				},
				{
					title: '邮箱',
					key: 'email',
					resizable: true,
					width: 220,
				},
				{
					title: '手机',
					key: 'phone',
					resizable: true,
					width: 200
				},
				{
					title: '申请加入统一社会信用代码',
					key: 'creditCode',
					resizable: true,
					width: 250,
				},
				{
					title: '申请加入机构名称',
					key: 'organizationName',
					resizable: true,
					width: 250,
				},
				{
					title: '申请状态',
					key: 'statusText',
					resizable: true,
					width: 150
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let status = params.row.status
						let btnArr = []
						if(status == '0') {
							btnArr.push(
								h('Button', {
									props: {
										type: 'primary',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.toPass(params.row)
										}
									}
								}, '通过申请'),
								h('Button', {
									props: {
										type: 'error',
										size: 'small',
									},
									style: {
										marginRight: '5px',
									},
									on: {
										click: () => {
											this.openRefuseDialog(params.row)
										}
									}
								}, '拒绝申请')
							)
						}
						return h('div', btnArr)
					}
				}
			],
			userListData: [],
			btnLoading: false,
			userDialog: false,
			userForm: {
				userName: '',
				nickName: '',
				position: '',
				email: '',
				phone: '',
				creditCode: '',
				organizationName: '',
				password: '',
				verifyPsw: '',
				isLimitLogin: true
			},
			rulesUser: {
				userName: [
					{ required: true, type: 'string', message: '请输入用户名称', trigger: 'blur' },
					{ validator: (rule,value,cb) => {this.validateU(value,cb)}, message:'此用户名称已被使用', trigger:'blur'}
				],
				nickName: [
					{ required: true, type: 'string', message: '请输入用户昵称', trigger: 'blur' }
				],
				position: [
					{ required: true, type: 'string', message: '请输入职位', trigger: 'blur' }
				],
				email: [
					{ required: true, type: 'string', message: '请输入邮箱', trigger: 'blur' },
					{ type: 'string', pattern:/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message:'请输入正确的邮箱', trigger:'blur'},
					{ validator: (rule,value,cb) => {this.validateE(value,cb)}, message:'此邮箱已被使用', trigger:'blur'}
				],
				phone: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ type: 'string',pattern:/^[1][3,4,5,6,7,8,9][0-9]{9}$/, message:'请输入正确的手机号码', trigger:'blur'},
					{ validator: (rule,value,cb) => {this.validateP(value,cb)}, message:'此手机已被使用', trigger:'blur'}
				],
				creditCode: [
					{ required: true, message: '请输入申请加入统一社会信用代码', trigger: 'blur' },
					{ type: 'string',pattern:/(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{16}/, message:'请输入正确的16位统一社会信用代码', trigger:'blur'}
				],
				organizationName: [
					{ required: true, type: 'string', message: '请输入申请加入机构名称', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur'},
					{message: '密码中不能含有空格等特殊字符', trigger: 'blur',pattern: /^\S+$/},
				],
				verifyPsw: [
					{ required: true, message: '请输入确认密码', trigger: 'blur'},
					{message: '密码中不能含有空格等特殊字符', trigger: 'blur',pattern: /^\S+$/},
				],
			},
			refuseDialog: false,
			refuseForm: {
				reason: '',
			},
			rulesRefuse: {
				reason: [
					{ required: true, type: 'string', message: '请输入拒绝理由', trigger: 'blur' }
				]
			},
			refuseIds: [],
			emailArr: []
		}
	},
	mounted() {
		this.getUserPreListData()
	},
	methods: {
		// 获取用户预注册-查询
		getUserPreListData() {
			this.pageLoading = true
			let params = {
				userName: this.searchForm.userName || '',
				phone: this.searchForm.phone || '',
				pageNum: this.searchForm.page, 
				pageSize: this.searchForm.pageSize
			}
			getUserPreList(params).then(res => {
				if(res.code===200) {
					this.pageLoading = false
					this.userListData = res.rows
					this.userListData.forEach((value,index) => {
						if(value.status!=='0') {
							this.userListData[index]._disabled = true
						}
					})
					this.total = res.total
				}else {
					this.pageLoading = false
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 校验邮箱
		validateE(value,cb) {
			getUserPreValidateE(value).then(res => {
				if(res.data) {
					cb(new Error())
				}else {
					return cb()
				}
			}).catch(err => {
				return cb(new Error(err))
			})
		},
		// 校验手机
		validateP(value,cb) {
			getUserPreValidateP(value).then(res => {
				if(res.data) {
					cb(new Error())
				}else {
					return cb()
				}
			}).catch(err => {
				return cb(new Error(err))
			})
		},
		// 校验用户名
		validateU(value,cb) {
			getUserPreValidateU(value).then(res => {
				if(res.data) {
					cb(new Error())
				}else {
					return cb()
				}
			}).catch(err => {
				return cb(new Error(err))
			})
		},
		// 打开创建用户
		openUserDiolog() {
			this.resetForm()
			this.title = '创建用户'
			this.userDialog = true
		},
		// 邮箱提醒
		selectEmail(value) {
			this.emailArr = util.emailArr(value)
			if(value != undefined) {
				this.$nextTick(() => {
					this.$refs['userForm'].validateField('email')
				})
			}
		},
		// 提交创建用户
		handleSubmit() {
			this.btnLoading = true
			this.$refs['userForm'].validate((valid) => {
				if(valid) {
					let params = {
						userName: this.userForm.userName,
						nickName: this.userForm.nickName,
						position: this.userForm.position,
						email: this.userForm.email,
						phone: this.userForm.phone,
						creditCode: this.userForm.creditCode,
						organizationName: this.userForm.organizationName,
						password: this.userForm.password,
						isLimitLogin: this.userForm.isLimitLogin?'1':'0'
					}
					if(this.userForm.verifyPsw !== this.userForm.password) {
						this.$Message.error('用户密码和确认密码不一致，请重新输入')
						this.btnLoading = false
						return
					}
					postAddUserPre(params).then(res => {
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.userDialog = false
							this.btnLoading = false
							this.multiple = true
							this.single = true
							this.getUserPreListData()
						}
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 通过申请
		toPass(data) {
			let ids = data.id?[data.id]:this.ids
			let params = {
				ids: ids
			}
			this.$Modal.confirm({
				title: '通过申请',
				content: '确定通过申请吗？',
				loading: true,
				onOk: () => {
					postBatchPass(params).then(res => {
						if (res.code == 200) {
							this.$Message.success(res.msg)
							this.multiple = true
							this.single = true
							this.$Modal.remove()
							this.getUserPreListData()
						}
					}).catch(res => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 打开拒绝申请弹出窗口
		openRefuseDialog(data) {
			this.resetForm()
			this.title = '拒绝申请'
			this.refuseDialog = true
			this.refuseIds = data.id?[data.id]:this.ids
		},
		// 拒绝申请
		toRefuse() {
			this.btnLoading = true
			this.$refs['refuseForm'].validate((valid) => {
				if(valid) {
					let params = {
						ids: this.refuseIds,
						reason: this.refuseForm.reason
					}
					postBatchRefuse(params).then(res => {
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.multiple = true
							this.single = true
							this.refuseDialog = false
							this.getUserPreListData()
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
			this.userDialog = false
			this.refuseDialog = false
		},
		// 清空
		resetForm() {
			this.$refs['userForm'].resetFields()
			this.$refs['refuseForm'].resetFields()
			this.refuseIds = []
			this.userDialog = false
			this.refuseDialog = false
			this.btnLoading = false
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
			console.log(this.ids)
			this.single = selection.length!==1
			this.multiple = !selection.length
		},
		// 搜索
		handleSearch() {
			this.getUserPreListData()
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.getUserPreListData()
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.page = pages
			this.multiple = true
			this.single = true
			this.getUserPreListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.multiple = true
			this.single = true
			this.getUserPreListData()
		},
	}
}
</script>
<style lang="scss" scoped>
	.registeredUsers {	
	}
</style>