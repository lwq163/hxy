<template>
	<div>
		<div class="isFlexalitem underBtn"  :class="{'padRight':isScroll}">
			<Button class="hxy-mr-30"  @click="cancleBtn">{{canlceText}}</Button>
			<Button type="primary"    @click="sureBtn">{{sureText}}</Button>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'modalBtn',
		props:{
			isScroll : {				//如果是滚动的话，与滚动条保持24间距
				type : Boolean,
				default : false
			},
			canlceText : {
				type : String,
				default : "取消"
			},
			sureText : {
				type : String,
				default : "确认新增"
			}
		},
		methods:{
			cancleBtn(){
				this.$emit('cancleBtn');
			},
			sureBtn(){
				this.$emit('sureBtn');
			}
		}
	}
</script>
<style>
	.underBtn{
		margin-top: 60px;
		justify-content: flex-end;
	}
	.padRight{
		padding-right: 24px;
	}
</style>
