<template>
	<div class="basic">
		<tab-menu></tab-menu>
		<div>
			<Form :model="userForm" ref="userForm" :rules="rulesUser" label-position="left" :label-width="100">
				<Row>
					<Col span="8">
						<FormItem label="昵称" prop="nickName">
							<Input type="text" v-model="userForm.nickName" placeholder="请输入昵称" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="头像设置" prop="avatar">
							<div class="upload-btn" @click="uploadPicture">
								<img :src="userForm.avatar" alt="自定义头像">
								<span>设置头像</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="绑定手机" prop="phonenumber">
							<div style="display: flex;"><Input type="text" v-model="userForm.phonenumber" placeholder="绑定手机号码" disabled class="hxy-mr-10"></Input><Button type="text" style="color: #2d8cf0">更换手机</Button></div>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="个人二维码">
							<div></div>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="身份证姓名" prop="idName">
							<Input type="text" v-model="userForm.idName" placeholder="请输入身份证姓名" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="身份证号码" prop="idCardNo">
							<Input type="text" v-model="userForm.idCardNo" placeholder="请输入身份证号码" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="微信" prop="wxId">
							<Input type="text" v-model="userForm.wxId" placeholder="请输入微信号" />
							<!-- <div class="row-box">
								<div class="b1"><Input type="text" v-model="userForm.wxId" placeholder="请输入微信号" /></div>
								<div class="b2" v-if="!userForm.wxId"><Button type="primary">绑定</Button></div>
								<div class="b2" v-if="userForm.wxId"><Button type="text" style="color: #2d8cf0">解绑</Button></div>
							</div> -->
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="邮箱" prop="email">
							<AutoComplete v-model="userForm.email" placeholder="请输入邮箱" @on-search="selectEmail">
								<Option v-for="item in emailArr" :value="item" :key="item">{{ item }}</Option>
							</AutoComplete>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="QQ" prop="qqId">
							<Input type="text" v-model="userForm.qqId" placeholder="请输入QQ号" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem label="登录密码">
							<div style="display: flex;"><Input type="password" value="******" placeholder="请输入登录密码" disabled class="hxy-mr-10"></Input><Button type="text" style="color: #2d8cf0" @click="openPswDialog">修改密码</Button></div>
						</FormItem>
					</Col>
				</Row>
				<div class="hxy-pt-30"><Button type="primary" @click="saveInfo" :loading="btnLoading">保存</Button></div>
			</Form>
		</div>

		<!-- 设置头像对话框 -->
		<Modal
			:title="title"
			v-model="avatarDialog"
			:mask-closable="false"
			:width="720">
			<div>
				<cropper-image
					@uploadImgSuccess="handleUploadSuccess">
				</cropper-image>
			</div>
			<div slot="footer">
				<Button type="default" @click="avatarDialog=false">关闭</Button>
			</div>
		</Modal>

		<!-- 修改密码 -->
		<Modal
			:title="title"
			v-model="pswDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="580">
			<Form :model="pswForm" ref="pswForm" :rules="rulesPsw" label-position="left" :label-width="100">
				<Row :gutter="10">
					<Col span="24">
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
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="pswSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import cropperImage from '_c/cropperImage'
import { getBasicInfo,getCheckEmail,postModifyPwd,postUpdateInfo } from '_s/personBasic'
export default {
	data() {
		return {
			userForm: {
				avatar: '',
				phonenumber: '',
				idCardNo: '',
				idName: '',
				wxId: '',
				email: '',
				qqId: '',
			},
			rulesUser: {
				email: [
					{ type: 'string', pattern:/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message:'请输入正确的邮箱', trigger:'blur'},
					{ validator: (rule,value,cb) => {this.getCheckEmailData(value,cb)}, trigger:'blur'}
				],
				idCardNo: [
					{ type: 'string', pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/, message:'请输入正确身份证号码', trigger:'blur'},
				],
				qqId: [
					{ type: 'string', pattern:/^[1-9][0-9]{4,12}$/, message:'请输入正确qq号码', trigger:'blur'}
				],
				wxId: [
					{ type: 'string', pattern:/^[a-zA-Z][a-zA-Z\d_-]{5,19}$/, message:'请输入正确微信号', trigger:'blur'}
				]
			},
			cropperName:'',
			title: '',
			avatarDialog: false,
			pswDialog: false,
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
			btnLoading: false,
			curEmail: '',
			emailArr: []
		}
	},
	components: {
		cropperImage
	},
	mounted() {
		this.getBasicInfoData()
	},
	methods: {
		// 查询当前登录人个人信息
		getBasicInfoData() {
			getBasicInfo().then(res => {
				if(res.code===200) {
					this.userForm = res.data
					this.curEmail = res.data.email
				}
			})
		},
		// 校验邮箱是否可用
		getCheckEmailData(value,cb) {
			let params = {
				email: value
			}
			if(value==this.curEmail) {
				cb()
			}else {
				getCheckEmail(params).then(res => {
					if(res.data) {
						cb(new Error('该邮箱已绑定其他用户'))
					}else {
						return cb()
					}
				}).catch(err => {
					return cb(new Error(err))
				})
			}
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
		// 打开设置头像对话框
		uploadPicture(){
			this.avatarDialog = true
			this.title = '设置头像'
		},
		// 图片上传成功后
		handleUploadSuccess(data) {
			if(data) {
				this.userForm.avatar = data
				this.$store.dispatch('GetAvatar',data)
				setTimeout(() => {
					this.avatarDialog = false
				},500)
			}
		},
		// 打开修改密码对话框
		openPswDialog() {
			this.resetForm()
			this.pswDialog = true
			this.title = '修改密码'
			this.btnLoading = false
		},
		// 修改密码提交
		pswSubmit() {
			this.btnLoading = true
			this.$refs['pswForm'].validate((valid) => {
				if(valid) {
					let params = {
						orgPassword: this.pswForm.curPsw,
						password: this.pswForm.newPsw
					}
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
					postModifyPwd(params).then(res => {
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.pswDialog = false
							this.btnLoading = false
						}
					}).catch(err => {
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 清空修改密码
		resetForm() {
			this.$refs['pswForm'].resetFields()
		},
		// 保存信息
		saveInfo() {
			this.$refs['userForm'].validate((valid) => {
				if(valid) {
					let params = {
						userId: util.getStorage('userId'),
						nickName: this.userForm.nickName,
						avatar: this.userForm.avatar,
						phonenumber: this.userForm.phonenumber,
						idCardNo: this.userForm.idCardNo,
						idName: this.userForm.idName,
						wxId: this.userForm.wxId,
						email: this.userForm.email,
						qqId: this.userForm.qqId,
					}
					postUpdateInfo(params).then(res => {
						if(res.code===200) {
							if(res.code===200) {
								this.$Message.success(res.msg)
								this.$store.dispatch('GetNickName',this.userForm.nickName)
							}
						}
					}).catch(res => {})
				}
			})
			
		},
		// 关闭设置头像对话框
		closeDialog() {
			this.avatarDialog = false
			this.pswDialog = false
		}
	}
}
</script>
<style lang="scss" scoped>
	.basic {
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
		.upload-list-cover{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 0 40px;
			align-items: center;
			background: rgba(0,0,0,.6);
			opacity: 0;
			transition: opacity 1s;
		}
		.upload-btn{
			width: 120px;
			height: 120px;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			-webkit-box-pack: center;
			-ms-flex-pack: center;
			justify-content: center;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center;
			border: 1px solid #ccc;
			overflow: hidden;
			box-shadow: 0 0 1px #ccc;
			border-radius: 50%;
			position: relative;
			overflow: hidden;
			img {
				width: auto;
				height: 120px;
			}
			span {
				display: none;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background: rgba(0,0,0,.6);
				color: #fff;
				height: 120px;
				line-height: 120px;
				text-align: center;
			}
		}
		.upload-btn:hover {
			border-color: #2d8cf0;
		}
		.upload-btn:hover span {
			display: block;
			cursor: pointer;
		}
	}
	/deep/ .ivu-input[disabled] {
				color:#888 !important;
				background: #f2f2f2 !important;
    			border-color: #e5e5e5 !important;
			}
</style>