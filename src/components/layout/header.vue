<template>
    <div class="header">
		<div>
			<div class="headTitle isFlexSpace">
				<div>{{timeState}}～！{{masterDeptName[0].masterDeptName}}  欢迎您登录。</div>
				<div class="headerInfo">
					<div class="message pos-r">
						<div class="message-icon" @click="$router.push({name: 'notice'})">
							<Badge :count="total" :offset="[-7,-8]"><i class="iconfont iconPC-21 hxy-font-size-12"></i></Badge>
						</div>
						<div class="message-box">
							<div class="box1">
								<div class="msg-tab" @click="num=index" :class="{active:num==index}" v-for="(item,index) in msgTab" :key="index">{{item}}</div>
							</div>
							<div class="box2" v-show="num==0">
								<div class="hide-scroll">
									<div v-if="noticeListData.length!=0">
										<div class="msg-list" @click="toNotice(item.id)" v-for="(item,index) in noticeListData" :key="index" >
											<div class="b1 icon-one">
												<i class="iconfont iconPC-32 hxy-font-size-12"></i>
											</div>
											<div class="b2">
												<div class="text">{{item.content}}</div>
												<div class="time hxy-font-size-12">{{item.createTime}}</div>
											</div>
										</div>
									</div>
									<div v-if="noticeListData.length==0" class="no-message">
										暂时没有新消息
									</div>
								</div>
								<div class="bottom-box">
									<div class="more">
										<Button type="text" gost style="color: #2d8cf0;" @click="$router.push({name: 'notice'})">查看更多</Button>
									</div>
									<div class="clear">
										<Button type="text" gost :disabled="ids.length==0" @click="allOnRead"><i class="iconfont iconPC-63 hxy-font-size-14 hxy-mr-10"></i>清空通知</Button>
									</div>
								</div>
							</div>
							<div class="box2" v-show="num==1"></div>
							<div class="box2" v-show="num==2"></div>
						</div>
					</div>
					
					<Dropdown>
						<div class="isFlexalitem">
							<Avatar icon="ios-person" size="40" :src="avatar" @on-error="defaultPic" />
							<!-- <Avatar icon="ios-person" size="40" :src="avatar"/> -->
							<div class="infoName">
								<div class="nickname">{{nickName}}</div>
								<div class="workName">{{workName}}</div>
							</div>
							<Icon type="ios-arrow-down"></Icon>
						</div>
						<DropdownMenu slot="list">
							<DropdownItem @click.native="$router.push({name:'personBasic'})"><i class="iconfont iconPC-68 hxy-font-size-14 hxy-mr-10"></i>个人设置</DropdownItem>
							<DropdownItem @mouseover.native="isShow = true" @mouseleave.native="isShow = false" class="pos-r">
								<i class="iconfont iconPC-70 hxy-font-size-14 hxy-mr-10"></i>切换企业
								<div v-if="isShow" class="add-menu">
									<ul>
										<li v-for="(item,index) in get_deptList" :key="index" @click="changeDept(item)" :class='{curCompany:masterDeptId==item.masterDeptId}'>{{item.masterDeptName}}</li>
									</ul>
								</div>
							</DropdownItem>
							<DropdownItem @click.native="logout"><i class="iconfont iconPC-69 hxy-font-size-14 hxy-mr-10"></i>退出账户</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<!-- 二级菜单 -->
			<div class="headMenuSecond isFlexalitem" v-if="path[1]!='index' && path[1]!='approval'">
				<div v-for="(item,index) in get_secList" :key="index" class="mySecond">
					<router-link :to="'/'+path[1]+'/'+item.path" >
						<i :class="'iconfont '+item.icon"></i>{{item.title}}
					</router-link>
				</div>
			</div>
		</div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import util from '_m/util'
import { getNoticeList,postOnRead } from '_s/notice'
export default {
    data(){
        return{
            avatar: '',
            nickName: '姓名',
			workName: '职位展示',
			path: [],
			isLoginOut : false,
			isShow: false,
			masterDeptId: parseInt(util.getStorage('masterDeptId')),
			defaultAvatar: require('@/assets/logo.png'),
			noticeDialog: false,
			num: 0,
			msgTab: ['全部','工作助手','系统消息'],
			timeState: util.getTimeState(),
			masterDeptName: '',
			noticeListData: [],
			total: 0,
			ids: []
        }
    },
	computed:{
		...mapGetters([
			'get_secList',
			'get_userinfo',
			'get_deptList',
			'get_avatar',
			'get_nickName'
		])
	},
    mounted(){
		this.setInfo()
		this.getNoticeListData()
    },
	watch:{
        "$route": {
            handler(val,oldVal){
                if(val){
                    this.path = this.$route.path.split('/')
					this.masterDeptId = parseInt(util.getStorage('masterDeptId'))
					this.masterDeptName = this.get_deptList.filter(item => {
						return item.masterDeptId == this.masterDeptId
					})
                }
            },
            immediate: true
        },
		'get_avatar': {
			handler(val,oldVal){
				if(val) {
					this.avatar = val
				}
            },
            immediate: true
		},
		'get_nickName': {
			handler(val,oldVal){
				if(val) {
					this.nickName = val
				}
            },
            immediate: true
		}
    },
    methods: {
		// 头像加载错误显示默认头像
		defaultPic(e) {
			this.avatar = this.defaultAvatar
		},
		// 显示消息
		showNotice() {
			this.noticeDialog = !this.noticeDialog
		},
		// 跳转消息页面
		toNotice(id) {
			this.onReadData(id)
			this.$router.push({name:'notice'})
		},
		// 获取消息列表数据
		getNoticeListData() {
			let params = {
				isRead: 0,
			}
			getNoticeList(params).then(res => {
				if(res.code===200) {
					this.noticeListData = res.rows
					this.ids = this.noticeListData.map(item => item.id)
					this.total = res.total
				}else {
					this.pageLoading = false
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 已读
		onReadData(id) {
			let params = {
				ids: [id]
			}
			postOnRead(params).then(res => {
				if(res.code===200) {
					this.getNoticeListData()
					this.$store.dispatch('GetIsRead',true)
				}
			}).catch(err=>{})
		},
		// 全部已读
		allOnRead() {
			let params = {
				ids: this.ids
			}
			postOnRead(params).then(res => {
				if(res.code===200) {
					this.getNoticeListData()
					this.$Message.success(res.msg)
					this.$store.dispatch('GetIsRead',true)
				}
			}).catch(err=>{})
		},
		// 选择公司
		changeDept(data) {
			this.$Modal.confirm({
				title: `${data.masterDeptName}`,
				content: `是否切换到${data.masterDeptName}团队？`,
				loading: true,
				onOk: () => {
					this.$Modal.remove()
					util.setStorage('masterDeptId',data.masterDeptId)
					this.$Spin.show({
						render: (h) => {
							return h('div', [
								h('Icon', {
									'class': 'demo-spin-icon-load',
									props: {
										type: 'ios-loading',
										size: 18
									}
								}),
								h('div', '正在切换团队，请稍后...')
							])
						}
					})
					let p = new Promise((resolve,reject) => {
						setTimeout(() => {
							this.$Spin.hide()
							resolve()
						}, 1500)
					}).then(() => {
						window.location.reload()
					})
				}
			})
		},
		setInfo(){
			this.avatar   = this.get_avatar
			this.nickName = this.get_nickName || this.get_userinfo.nickName
			this.workName = (this.get_userinfo.roles && this.get_userinfo.roles.length!==0) ? this.get_userinfo.roles[0].roleName : '';
		},
		// 登出
		logout() {
			this.$Modal.confirm({
				title: '提示',
				content: '确定注销并退出系统吗？',
				loading: true,
				onOk: () => {
					util.delCookie('Admin-Token')
					localStorage.clear()
					this.$Modal.remove()
					this.$store.commit('SET_SECLIST',{index:0,data:""})
					this.$Spin.show({
						render: (h) => {
							return h('div', [
								h('Icon', {
									'class': 'demo-spin-icon-load',
									props: {
										type: 'ios-loading',
										size: 18
									}
								}),
								h('div', '正在退出系统，请稍后...')
							])
						}
					})
					let p = new Promise((resolve,reject) => {
						setTimeout(() => {
							this.$Spin.hide()
							resolve()
						}, 1500)
					}).then(() => {
						this.$router.push('/login')
						window.location.reload()
					})
				}
			})
		}
    }
}
</script>
<style>
	.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
	.curCompany {
		color: #007aff !important;
		cursor: not-allowed !important;
		pointer-events: none;
	}
</style>
<style lang="scss" scoped>
	.headTitle{
		padding-left:42px;
		height: 64px;
		color:#515A6E;
		font-size: 14px;
		background: white;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	//二级菜单
	.headMenuSecond{
		width: calc(100% - 24px);
		margin: 0 auto;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 1;
		flex-wrap: wrap;
		background-color: white;
		img{
			width: 24px;
			height: 24px;
			vertical-align: middle;
		}
		margin-top:12px;
	}
	.menuSpan{
		color:#515A6E;
		margin-left: 11px;
		font-size: 14px;
		font-weight: 400;
	}
	.ivu-menu-item .active .menuSpan{
		color: #2D8CF0 !important;
	}
	.mySecond{
		height: 48px;
		font-size: 14px;
		a {
		    display: flex;
			align-items: center;
			height: 48px;
		    padding: 0 35px;
		    color: #515A6E;
			.iconfont,>svg{
				font-size: 14px;
				margin: 0 11px 0 0;
			}
		    &:hover {
		        color: #5CADFF;
		    }
		    &.active{
		        color: #5CADFF;
		        font-weight: 500;
		        border-bottom: 2px solid #5CADFF;
				background: #f0faff;
		    }
		}
	}
	
	
	//用户信息
	.headerInfo{
		padding-right: 22px;
		cursor: pointer;
		display: flex;
		align-items: center;
		.ivu-menu-submenu-title{
			display: flex;
			align-items: center;
		}
	}
	.userInfo{
		height: 100%;
		line-height: 24px;
		display: flex !important;
		flex-direction: row !important;
		align-items: center !important; 
		&>div{
			margin-right: 11px;
			margin-left: 13px;
		}
		
	}
	.infoName{
		margin: 0 11px 0 13px;
		.nickname{
			color: #515A6E;
			font-size: 600;
		}
		.workName{
			color: #777D93;
		}
	}
	
	.loginImg{
		width: 50px;
		height: 57px;
	}
	.add-menu {
		width: 260px;
		background-color: #fff;
		box-sizing: border-box;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		position: absolute;
		padding: 5px 0;
		left: -260px;
		top: 0;
		ul {
			li {
				padding: 7px 16px;
			}
			li:hover {
				background: #F3F3F3;
			}
		}
	}
	.message {
		width: 80px;
		height: 64px;
		align-items: center;
		justify-content: center;
		display: flex;
		.message-icon {
			width: 40px;
			height: 40px;
			opacity: 1;
			border: 1px solid #dcdee2;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.message-box {
			width: 320px;
			max-height: 500px;
			background: #fff;
			box-shadow: 0px 0 15px 0px rgba(0, 0, 0, 0.1);
			position: absolute;
			right: -100px;
			top: 60px;
			z-index: 9999;
			border-radius: 10px;
			.box1 {
				height: 46px;
				border-bottom: 1px solid #DCDEE2;
				color: #657180;
				display: flex;
				justify-content: center;
				.msg-tab {
					width: 33.33%;
					height: 46px;
					line-height: 46px;
					font-size: 12px;
					text-align: center;
				}
				.active {
					color: #2d8cf0;
					height: 46px;
					border-bottom: 1px solid #2d8cf0;
					font-size: 14px;
				}
			}
			.box2 {
				min-height: 300px;
				overflow: hidden;
				position: relative;
				.hide-scroll {
					position: absolute;
					left: 0;
					top: 0;
					right: -17px;
					bottom: 0;
					padding-bottom: 86px;
					overflow-x: hidden;
					overflow-y: scroll;
					.msg-list {
						background: #fff;
						padding: 15px 25px;
						border-bottom: 1px solid #F3F4F5;
						zoom: 1;
						overflow: hidden;
						.b1 {
							width: 33px;
							height: 33px;
							border-radius: 33px;
							color: #fff;
							display: flex;
							justify-content: center;
							align-items: center;
							margin-right: 10px;
							float: left;
						}
						.icon-one {
							background: #F6A936;
						}
						.icon-two {
							background: #3391E5;
						}
						.icon-three {
							background: #C5C8CE;
						}
						.b2 {
							zoom: 1;
							overflow: hidden;
							.text {
								color: #666;
								margin-bottom: 5px;
								text-align: justify;
							}
							.time {
								color: #ccc;
							}
						}
					}
					.msg-list:hover {
						background: #f0faff;
					}
					.no-message {
						height: 214px;
						font-size: 14px;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
				.bottom-box {
					position: absolute;
					left: 0; 
					right: 0;
					bottom: 0; 
					height: 86px;
					background: #fff;
					.more {
						border-top: 1px solid #F3F4F5;
						border-bottom: 1px solid #F3F4F5;
						text-align: center;
						padding: 5px;
					}
					.clear {
						text-align: center;
						padding: 5px;
					}
				}
			}
		}
	}
	.message .message-box {
		display: none;
	}
	.message:hover .message-box { 
		display: block; 
		animation-name: slide;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}
	@keyframes slide {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	
</style>