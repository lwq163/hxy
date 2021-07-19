<template>
	<div class="tranBox isFlexCenter" @click.stop='closeTran'>
		<div class="tranAlert" @click.stop="nothing">
			<div class="tranHead isFlexSpace"><span>栏目标题</span><span class="tranClose" @click="closeTran">x</span></div>
			<div class="tranHeadSec">提示：不需要显示的模块,可移至左侧！</div>
			<Transfer 
				:filterable='true'
				:filter-method="filterMethod"
				:titles="titles"
				:data="dataShow"
				:target-keys="targetKeys"
				:render-format="render"
				@on-change="handleChange">
			</Transfer>
		</div>
	</div>
</template>
<script>
	
	export default {
		props : {
			dataShow   :Array,
			TranListNo :Array
		},
		data() {
			return {
				titles      : ["已显示","未显示"],
				targetKeys  : []
			}
		},
		methods:{
			closeTran(){
				this.$emit('closeTran');
			},
			render(item) {
				return item.title;
			},
			filterMethod (data, query) {
				return data.title.indexOf(query) > -1;
			},
			handleChange(newTargetKeys) {
				var arry  = this.dataShow;
				var newArry = [];
				this.targetKeys = newTargetKeys;
				newArry = arry.filter((item)=>{					 	//取出当前右侧对应的数据
					for(var i=0;i<this.targetKeys.length;i++){
						var temp = this.targetKeys[i];
						if(temp==item.key){
							return item
						}
					}
				})
				var c = this.getArrDifference(this.dataShow,newArry);
				this.$emit('refresh',c)					//刷新当前数据
			},
			getArrDifference(arr1, arr2) {				//取出两个数组不相等的数据
				return arr1.concat(arr2).filter(function(v, i, arr) {
					return arr.indexOf(v) === arr.lastIndexOf(v);
				});
			},
			nothing(){
				//防止蒙版点击穿透
			}
		}
	}
</script>

<style lang="scss">
	.tranBox{
		width: 100%;
		height: 100%;
		position: fixed;
		top:0;
		left: 0;
		z-index: 1000;
		background-color: rgba(0,0,0,0.3);
		.tranAlert{
			padding: 24px;
			background: white;
			border-radius: 12px;
			.tranHead{
				width: 100%;
				font-size: 16px;
				font-weight: 600;
				color: #000;
				margin-bottom: 16px;
				.tranClose{
					cursor: pointer;
					color: #000;
					font-size: 20px;
				}
			}
			.tranHeadSec{
				font-size: 14px;
				color: red;
				margin-bottom: 16px;
			}
		}
	}
</style>
