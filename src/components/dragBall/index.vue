<template>
	<div>
		<div class="drag_box" v-drag  @click.stop="showMenu">
			<div class="dragFather">
				<transition name="el-fade-in-linear">	
					<div class="dargMenu" v-show="menuFlag" :style="{'top':top}">
						<div v-for="(item,index) in menuList" :key="index" class="dragList">
							<img class="dragIcon" src="../../assets/404_images/404.png" alt="">
							<div>{{item.id+item.name}}</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				menuFlag : false,
				menuList : [
					{id:1,name:"用户管理"},
					{id:2,name:"测试菜单"},
					{id:3,name:"测试菜单"},
					{id:4,name:"测试菜单"},
					{id:5,name:"测试菜单"},
				],
				top : 0
			}
		},
		created() {
			//80是根据元素dragFather的值来的
			this.top = -(Math.ceil(this.menuList.length/2))*80+80/2+'px'
		},
		methods:{
			showMenu(){
				this.menuFlag = !this.menuFlag;
			}
		},
		//滑动指令
		directives: {
			drag: function(el) {
				console.log("el: " + JSON.stringify(el));
				let dragBox = el; //获取当前元素
				dragBox.onmousedown = e => {
					//算出鼠标相对元素的位置
					let disX = e.clientX - dragBox.offsetLeft;
					let disY = e.clientY - dragBox.offsetTop;
					document.onmousemove = e => {
						//用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
						let left = e.clientX - disX;
						let top = e.clientY - disY;
						//移动当前元素
						dragBox.style.left = left + "px";
						dragBox.style.top = top + "px";
					};
					document.onmouseup = e => {
						//鼠标弹起来的时候不再移动
						document.onmousemove = null;
						//预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
						document.onmouseup = null;
					};
				};
			}
		}
	}
</script>

<style lang="scss">
	.drag_box {
		width: 80px;
		height:80px;
		border-radius: 50%;
		font-size: 12px;
		background-color:rgba(31,45,61,1);
		position: fixed;
		bottom: 90px;
		right: 30px;
		z-index: 3000;
		.dragFather{
			position: relative;
			width: 70px;
			height:70px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			margin-left: 5px;
			margin-top: 5px;
			border-radius: 50%;
			border:1px solid  #2ED;
			.dargMenu{
				width: 200px;
				display: flex;
				flex-wrap: wrap;
				overflow: hidden;
				background: rgba(0,0,0,0.8);
				position: absolute;
				left:-160px;
				.dragList{
					width: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					color:white;
					height:80px;
					font-size: 12px;
					cursor: pointer;
					padding: 12px 4px;
					.dragIcon{
						width: 28px;
						height: 28px;
						margin-bottom: 10px;
					}
				}
			}
		}
	}
	.dragList:hover{
		border: 1px solid #1890FF;
		background: rgba(24,144,255,0.6);
	}
</style>
