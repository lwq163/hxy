<template>
	<div>
		<transition name="el-fade-in-linear">
			<div class="chatWebview">
				<div class="chatHead">
					<div><img class="chatLogo" src="../../assets/logo.png" alt="">杭州弘小样</div> <span
						@click="closeFlag()">X</span>
				</div>
				<div class="chatContent" id="chatContent">
					<div v-for="(item,index) in msgList" :key="index" style="margin-bottom:20px;">
						<!-- 服务端 -->
						<div class="server isFlexalitem" v-if="item.type=='server'">
							<img class="serverPhoto" src="../../assets/logo.png"></img>
							<div class="serverInfo">
								<div class="isFlexalitem">
									<div class="serverName">{{item.name}}</div>
									<span class="serverTime">{{item.time}}</span>
								</div>
								<div class="serverMsg">
									<div class="useText" v-html="item.msg.content"></div>
								</div>
							</div>
						</div>


						<!-- 用户端 -->
						<div class="user" v-if="item.type=='user'">
							<div class="userInfo">
								<div class="userHead isFlexalitem">
									<span class="userTime">{{item.time}}</span>
									<div class="userName">{{item.name}}</div>
								</div>
								<div class="userMsg">
									<div class="useText" v-html="item.msg.content"></div>
								</div>
							</div>
							<img class="userPhoto" src="../../assets/logo.png"></img>
						</div>
					</div>
				</div>
				<div class="chatInput">
					<textarea class="inpTalk" v-model="inpTalk" placeholder="请输入..."></textarea>
					<button  size="small" round class="sendBtn" @click="sendBtn">发送</button>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				isShow: false,
				tranFlag: true, //动画开关防止mouseenter一直触发
				hoverFlag: false,
				inpTalk: "",
				msgList: [{
						type: "user",
						name: "测试BBH",
						time: "2020.03.21",
						msg: {
							type: "text",
							content: "这是客户端"
						}
					},
					{
						type: "server",
						name: "机器人",
						time: "2020.03.21",
						msg: {
							type: "text",
							content: "这是服务端"
						}
					}
				]
			}
		},
		methods: {
			closeFlag() {
				this.$emit("hideChat");
			},
			sendBtn() {
				if (this.inpTalk.trim() == "") {
					alert("输入不能为空")
					return false
				}
				var time = new Date().toLocaleString(); //获取日期与时间;
				var obj = {
					type: "user",
					name: "测试",
					time: time,
					msg: {
						type: "text",
						content: this.inpTalk
					}
				};
				this.msgList.push(obj);
				this.inpTalk = "";
				//滑动到底部
				var ele = document.getElementById('chatContent');
				setTimeout(() => {
					ele.scrollTop = ele.scrollHeight;
				}, 100)
			}
		}
	}
</script>
<style lang="scss">
	$greenBg: linear-gradient(to right, #66D1B6,#00AF83) !important;
	.chatWebview {
		width: 400px;
		height: 500px;
		border-radius: 8px;
		box-shadow: 0 0 10px #CCCCCC;
		overflow: hidden;
		position: fixed;
		bottom: 100px;
		right:30px;
		.chatHead {
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: $greenBg;
			color: white;
			padding-right: 12px;
			span{
				cursor: pointer;
			}
			&>div {
				display: flex;
				align-items: center;
			}
			.chatLogo {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin: 0 20px;
			}
		}

		.chatContent {
			height: 350px;
			width: 100%;
			background: #f5f5f5;
			padding: 12px 8px;
			overflow: scroll;
		}
		.chatInput {
			height: 90px;
			position: relative;
			.inpTalk {
				width: 100%;
				height: 100%;
				padding: 20px;
				outline: none;
				border: none;
			}
			.sendBtn {
				width:72px !important;
				height:30px;
				position: absolute;
				bottom: 16px;
				right: 16px;
				background: $greenBg;
				color: white;
			}
		}
	}

	// 聊天内容
	//服务端
	.isFlexalitem {
		display: flex;
		align-items: center;
	}

	.server,
	.user {
		position: relative;
		align-items: flex-start;
	}

	.serverPhoto {
		width: 50px;
		height: 50px;
		margin-right: 16px;
	}

	.serverInfo {
		flex: 1;

		.serverName {
			font-size: 16px;
			font-weight: bold;
			margin-right: 20px;
		}

		.serverTime {
			font-size: 14px;
			color: #CCCCCC;
		}

		.serverMsg {
			max-width: 250px;
			margin-top: 6px;
		}

		.useText {
			display: inline-block;
			padding: 12px 24px;
			border-radius: 16px;
			background: white;
			font-size: 16px;
			color: #333;
			position: relative;
			text-align: justify;
		}

		.useText::after {
			content: "";
			width: 16px;
			height: 16px;
			background: white;
			transform: rotate(45deg);
			position: absolute;
			top: 12px;
			left: -5px;
		}
	}

	//用户端
	.user {
		display: flex;
		flex: 1;
		justify-content: flex-end;
	}

	.userPhoto {
		width: 50px;
		height: 50px;
		margin-left: 16px;
	}

	.userInfo {
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		.userHead {
			justify-content: flex-end;

			.userName {
				font-size: 16px;
				font-weight: bold;
			}

			.userTime {
				font-size: 14px;
				color: #CCCCCC;
				margin-right:20px;
			}
		}

		.userMsg {
			max-width: 250px;
			margin-top: 6px;
			display: flex;
			justify-content: flex-end;
		}

		.useText {
			display: inline-block;
			padding: 12px 24px;
			border-radius: 16px;
			background: white;
			font-size: 16px;
			color: #333;
			position: relative;
			text-align: justify;
		}

		.useText::after {
			content: "";
			width: 16px;
			height: 16px;
			background: white;
			transform: rotate(45deg);
			position: absolute;
			top: 12px;
			right: -5px;
		}
	}



	//悬浮窗
	.myDrop {
		width: 100px;
		height: 100px;
		border: 1px solid red;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		right: 0;
		z-index: 999;
		background: orangered;
		color: white;
	}
</style>
