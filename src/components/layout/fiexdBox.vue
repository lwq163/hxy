<template>
	<div>
		<!-- 右侧固定栏窗口 -->
		<div class="moduBox">
			<div class="moduList"  :class="{'borNone':index==0}"  v-for="(item,index) in moduList" :key="index" @click="goClick(item.id)"  >
				<img :src="item.src" alt=""><span>{{item.name}}</span>
			</div>
		</div>
		
		
		
		<!-- 客服模块 -->
		<chat v-show="chatShow" @hideChat="hideChat"></chat>
		<!-- 客服模块结束 -->
		
		<!-- 悬浮球 -->
		<!-- <dragBall></dragBall> -->
		<!-- 悬浮球结束 -->
		
		<!-- 操作说明 -->
		<div class="playSay" v-if="sayFlag">
		  <div class="playSayHead"><span></span>这是操作说明标题<span @click="openPlaySay">X</span></div>
		  <div class="playSayContent">这是内容</div>
		</div>
		
		
	</div>
</template>
<script>
import chat from "../../components/chat/chat.vue"
import dragBall from "../../components/dragBall/index.vue"
export default {
	components:{
	  chat,
	  dragBall,
	},
	data() {
		return {
			sayFlag  : false,
			chatShow : false,
			moduList : [
				{id:0,name:"操作说明",src:require("../../assets/images/caozuo.png")},
				{id:1,name:"在线咨询",src:require("../../assets/images/zx.png")},
				{id:2,name:"协同模块",url:"",src:require("../../assets/images/db.png")},
			],
		}
	},
    methods: {
		goClick(id){
		  if(id==0){
		    this.openPlaySay();
		  }else if(id==1){
		    this.hideChat();
		  }else if(id==2){
		    this.arrowCtrl();
		  }
		},
		openPlaySay(){
		  this.sayFlag = !this.sayFlag
		},
		hideChat(){
		  this.chatShow= !this.chatShow;
		},
		arrowCtrl() {
		}
	}
};
</script>
<style lang="scss">
	.moduBox {
		width:60px;
		background: rgba(0,0,0,0.3);
		cursor: pointer;
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		right:20px;
		transition: all 0.6s;
		display: flex;
		align-items:flex-end ;
		justify-content: center;
		flex-direction: column;
		border-radius: 4px 0 0 4px;
		z-index: 999;
	}
	.moduList{
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		font-size: 14px;
		color: #FFFFFF;
		border-top: 1px solid #FFFFFF;
		transition: all 0.6s;
		position: relative;
		span{
			display: none;
		}
		img{
			width: 24px;
			height: 24px;
		}
	}
	.moduList:hover img{
		margin-left: -60px !important;
	}
	.moduList:hover span{
		width:80px;
		height:60px;
		text-align: center;
		line-height: 60px;
		display: block;
		position: absolute;
		top: 0;
		left:48px;
	}
	.moduList:hover{
		width: 130px !important;
		border-radius: 4px 0 0 4px;
		transition: all 0.6s;
		background: linear-gradient(to right, #66D1B6,#00AF83) !important;
	}
	
	
	
	//操作说明
	.playSay{
		width: 400px;
		height: 500px;
		position: fixed;
		bottom: 100px;
		right:20px;
		background: white;
		border-radius: 4px;
		box-shadow: 0px 0px 10px #ccc;
		.playSayHead{
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 20px;
			span{
				cursor: pointer;
				color: red;
			}
		}
		.playSayContent{
			height: 450px;
			padding: 12px;
			box-sizing: border-box;
			overflow: auto;
		}
	}
</style>