<template>
    <div class="basic">
		<tab-menu></tab-menu>
		<div class="package">
			<!-- <div class="left-box fl hxy-mr-20">
				<div class="menu-tab" @click="num=index" :class="{active:num==index}" v-for="(item,index) in menuTab" :key="index">{{item}}</div>
			</div> -->
			<div class="right-box">
				<div v-if="num==0">
					<h3 class="hxy-mb-30">基本信息</h3>
					<div>
						<Form :model="basicForm" ref="basicForm" :rules="rulesBasic" label-position="left" :label-width="100">
							<Row :gutter="10">
								<Col span="12">
									<FormItem label="企业名称" prop="masterDeptName">
										<Input type="text" v-model="basicForm.masterDeptName" placeholder="请输入企业名称" />
									</FormItem>
									<FormItem label="所在行业" prop="industry">
										<Input type="text" v-model="basicForm.industry" placeholder="请输入所在行业" />
									</FormItem>
								</Col>
								<Col span="24">
									<FormItem label="开票信息">
										<Row :gutter="10" class="hxy-mb-15">
											<Col span="6">
												<Input type="text" v-model="basicForm.invTitle" placeholder="请输入开票抬头" />
											</Col>
											<Col span="6">
												<Input type="text" v-model="basicForm.invTaxNo" placeholder="请输入税号" />
											</Col>
											<Col span="6">
												<Input type="text" v-model="basicForm.invBankAccount" placeholder="请输入银行账号" />
											</Col>
											<Col span="6">
												<Input type="text" v-model="basicForm.invDeposit" placeholder="请输入开户行" />
											</Col>
										</Row>
										<Row :gutter="10">
											<Col span="6">
												<Input type="text" v-model="basicForm.invPhone" placeholder="请输入电话" />
											</Col>
											<Col span="6">
												<Input type="text" v-model="basicForm.invAddress" placeholder="请输入注册地址" />
											</Col>
											<Col span="6">
												<Input type="text" v-model="basicForm.invRemark" placeholder="请输入注备注" />
											</Col>
										</Row>
									</FormItem>
								</Col>
								<Col span="12">
									<FormItem label="办公地址" prop="address">
										<Input type="text" v-model="basicForm.address" placeholder="请输入办公地址" />
									</FormItem>
								</Col>
							</Row>
							<Row :gutter="10">
								<Col span="12">
									<FormItem label="logo上传">
										<modalUpLoad ref="logo" fileType="img" :multiple="false" upLoadText="logo上传" @listenFile="listenLogo"></modalUpLoad>
										<div style="color: #ccc;">
											建议上传图片尺寸为118*36，大小不超过1M，显示在pc端左上角，png
										</div>
									</FormItem>
								</Col>
								<Col span="12">
									<FormItem label="头像">
										<modalUpLoad ref="avatar" fileType="img" :multiple="false" upLoadText="头像上传" @listenFile="listenAvatar"></modalUpLoad>
										<div style="color: #ccc;">
											建议上传图片尺寸为640*640，大小不超过1M视觉元素保持在圆形区域内，显示在手机端，jpg/png
										</div>
									</FormItem>
								</Col>
							</Row>
							<div class="hxy-pt-30"><Button type="primary" @click="basicSubmit" :loading="btnLoading">保存</Button></div>
						</Form>
					</div>
				</div>
				<div v-show="num==1">
					<h3 class="hxy-mb-30">解散企业</h3>
					<div class="hxy-mb-30">
						<div class="hxy-mb-10">解散后，你的后台管理帐号和通讯录将会删除；（如有需要，请先导出通讯录）</div>
						<div>该操作不可撤销，请谨慎操作。同时删除的包括云盘文件，应用数据（公告，考勤，审批等），请做好相应的备份。</div>
					</div>
					<div>
						<Button type="primary" class="hxy-mr-30" @click="exportContacts">导出通讯录</Button>
						<Button type="error" @click="dissolution">解散</Button>
					</div>
				</div>
				<div v-show="num==2">
					<h3 class="hxy-mb-30">转让企业</h3>
					<div class="hxy-mb-30">
						<div class="hxy-mb-10">换绑主管理账号，需要验证当前主管理账号的身份，然后选择新的主管理员</div>
					</div>
					<div>
						<Button type="primary" @click="openTransferDialog">转让</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- 转让企业 -->
		<Modal
			:title="title"
			v-model="transferDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="720">
			<Form :model="transferForm" ref="transferForm" :rules="rulesTransfer" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="邮箱号" prop="email">
							<div class="row-box">
								<div class="b1 hxy-mr-10"><Input type="text" v-model="transferForm.email" placeholder="请输入邮箱号" /></div>
								<div class="b2">
									<Button type="primary" @click="getSendAuthCode" v-if="!isShow"> {{countdownValue}}</Button>
									<Button type="default" v-if="isShow">{{countdownValue}}</Button>
								</div>
							</div>
						</FormItem>
					</Col>
					<Col span="17">
						<FormItem label="验证码" prop="authCode">
							<Input type="text" v-model="transferForm.authCode" placeholder="请输入验证码" />
							<div style="color: #999">请输入邮箱验证码，确认该操作为本人账号</div>
						</FormItem>
					</Col>
					<Col span="17">
						<FormItem label="选择成员" prop="userId">
							<Select v-model="transferForm.userId" placeholder="请选择成员" clearable filterable>
								<Option v-for="(val,index) in currStaffList" :value="val.userId" :key="index">{{val.userName}}</Option>
							</Select>
							<div style="color: #999">请选择企业内成员，转移后本账号为企业普通成员</div>
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
import util from '_m/util'
import { mapGetters } from 'vuex'
import { postEditCompany,getDissolution,getQueryCurrStaff,getTransferMasterAdmin } from '_s/companyBase'
import { sendAuthCode } from '_s/login'
export default {
	data() {
		return {
			num: 0,
			basicForm: {
				id: '',
				masterDeptName: '',
				industry: '',
				invTitle: '',
				invTaxNo: '',
				invBankAccount: '',
				invDeposit: '',
				invPhone: '',
				invAddress: '',
				address: '',
				invRemark: '',
				logo: '',
				icon: '',
				logoFile: {
					displayName: '',
					name: '',
					size: 0,
					url: ''
				},
				iconFile: {
					displayName: '',
					name: '',
					size: 0,
					url: ''
				},
			},
			rulesBasic: {},
			btnLoading: false,
			menuTab: ['基本设置','解散企业','转让企业'],
			transferDialog: false,
			transferForm: {
				email: '',
				userId: '',
				authCode: ''
			},
			rulesTransfer: {
				email: [
					{ required: true, type: 'string', message: "请输入邮箱", trigger: "blur" },
					{ pattern:/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message:'请输入正确的邮箱', trigger:'blur'}
				],
				userId :[{ required: true, type: 'number', message: '请选择选择成员', trigger: 'change' }],
				authCode: [{ required: true, type: 'string', message: "请输入验证码", trigger: "blur" }]
			},
			title: '',
			currStaffList: [],
			countdownValue: '获取验证码',
			countdown: 60,
			isShow: false,
		}
	},
	computed: {
        ...mapGetters({
			companyInfo: 'get_company_info'
        })
    },
	mounted() {
		setTimeout(() => {
			this.basicForm = this.companyInfo
			let logoFile = this.basicForm.logoFile
			if(logoFile && Object.keys(logoFile).length != 0) {
				// 回显logo
				let logoArr = []
				logoArr.push({
					displayName: logoFile.displayName,
					name: logoFile.name,
					size: logoFile.size,
					url: logoFile.url
				})
				this.$refs.logo.changeData(logoArr)
			}
			let iconFile = this.basicForm.iconFile
			if(iconFile && Object.keys(iconFile).length != 0) {
				// 回显头像
				let avatarArr = []
				avatarArr.push({
					displayName: iconFile.displayName,
					name: iconFile.name,
					size: iconFile.size,
					url: iconFile.url
				})
				this.$refs.avatar.changeData(avatarArr)
			}
		},300)
	},
	methods: {
		// 查询当前登录企业下所有人员
		getQueryCurrStaffData() {
			getQueryCurrStaff().then(res => {
				if(res.code===200) {
					this.currStaffList = res.data
				}
			})
		},
		// 提交基本信息
		basicSubmit() {
			if(!this.basicForm.masterDeptName) {
				this.$Message.error('请填写企业名称!')
				return
			}
			let params = {
				id: this.basicForm.id,
				masterDeptId: util.getStorage('masterDeptId'),
				masterDeptName: this.basicForm.masterDeptName,
				industry: this.basicForm.industry,
				invTitle: this.basicForm.invTitle,
				invTaxNo: this.basicForm.invTaxNo,
				invBankAccount: this.basicForm.invBankAccount,
				invDeposit: this.basicForm.invDeposit,
				invPhone: this.basicForm.invPhone,
				invAddress: this.basicForm.invAddress,
				address: this.basicForm.address,
				invRemark: this.basicForm.invRemark,
				logoFile: this.basicForm.logoFile,
				iconFile: this.basicForm.iconFile
			}
			console.log(params)
			postEditCompany(params).then(res => {
				if(res.code===200) {
					let val = res.data
					this.$Message.success(res.msg)
					this.$store.dispatch('GetCompanyInfo',val)
				}
			}).catch(err =>{})
		},
		//获取上传logo的数据
		listenLogo(data,unType){
			this.basicForm.logoFile = data[0]
		},
		//获取上传头像avatar的数据
		listenAvatar(data,unType){
			this.basicForm.iconFile = data[0]
		},
		// 导出通讯录
		exportContacts() {
			let params = {}
			let fileName = '通讯录'
			let url = '/system/dept/exportContacts'
			this.axiosPost(url,params,fileName)
		},
		// 解散企业
		dissolution() {
			let params = {
				masterDeptId: util.getStorage('masterDeptId')
			}
			this.$Modal.confirm({
				title: '解散企业',
				content: `确定解散该企业吗？`,
				loading: true,
				onOk: () => {
					getDissolution(params).then(res => {
						if(res.code===200) {
							this.$Message.success('操作成功')
							this.$Modal.remove()
						}
					}).catch(err =>{
						this.$Modal.remove()
					})
				}
			})
		},
		// 转让企业弹窗
		openTransferDialog() {
			this.transferDialog = true
			this.title = '转让企业'
			this.btnLoading = false
			this.$refs['transferForm'].resetFields()
			this.getQueryCurrStaffData()
		},
		// 获取验证码
		getSendAuthCode() {
			if(!this.transferForm.email) {
				this.$Message.error('请输入邮箱')
				return
			}
			let params = {
				email: this.transferForm.email,
          		type: 3
			}
			sendAuthCode(params).then(res => {
				if(res.code===200) {
					this.setTime()
					this.$Message.success('验证码已发送')
				}
			})
		},
		// 重新获取验证码倒计时
		setTime() {
			if (this.countdown == 0) {
				this.isShow = false
				this.countdownValue = '重新获取'
				this.countdown = 60
			} else {
				this.isShow = true
				this.countdownValue = this.countdown + 's重新获取'
				this.countdown--
				setTimeout(() => {
					this.setTime()
				}, 1000)
			}
		},
		// 转让企业提交
		handleSubmit() {
			this.btnLoading = true
			this.$refs['transferForm'].validate((valid) => {
				if(valid) {
					let params = {
						authCode: this.transferForm.authCode,
						userId: this.transferForm.userId
					}
					getTransferMasterAdmin(params).then(res => {
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.transferDialog = false
						}
					})
				}else {
					this.btnLoading = false
				}
			})			
		},
		
		// 关闭弹窗
		closeDialog() {
			this.transferDialog = false
		},
	}
}
</script>
<style lang="scss" scoped>
	.basic {
		.package {
			zoom: 1;
			overflow: hidden;
			.left-box {
				width: 140px;
				padding: 5px;
				.menu-tab {
					width: 100%;
					height: 40px;
					line-height: 40px;
					padding: 0 15px;
					border-radius: 4px;
					font-size: 14px;
					border: 1px solid #dcdee2;
					text-align: center;
					cursor: pointer;
					margin-bottom: 15px;
				}
				.menu-tab:hover {
					border: 1px solid #5CADFF;
					color: #2d8cf0;
					transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
				}
				.active {
					border: 1px solid #5CADFF;
					color: #2d8cf0;
					font-weight: 600;
					box-shadow: 0 0 5px #86bbf3;
					transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,
				}
			}
			.right-box {
				zoom: 1;
				overflow: hidden;
				padding: 10px 20px;
				h3 {
					font-size: 18px;
					color: #333;
				}
			}
		}	
	}
	.row-box {
		display: flex;
		.b1 {
			flex: 2;
			height: 34px;
			line-height: 34px;
		}
		.b2 {
			flex: 1;
			height: 32px;
		}
	}
</style>