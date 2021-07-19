<template>
	<div class="fileCont">
		<div v-if="row!=''">
			<div style="height: 15px;"></div>
			<div v-for="(item,num) in row" :key="num" >
				<div class="hxy-mb-15">
					<span>{{item.displayName}}</span>
					<Button type="success" size="small" style="margin:0 15px" @click.stop="preview(item.url)">预览</Button>
					<Button type="primary" size="small" @click="load(item)">下载</Button>
				</div>
			</div>
		</div>
		<div v-if="row==''||row==null">-</div>
		
		
		<!-- 附件图片预览 -->
		<Modal 
			title="图片预览" 
			v-model="previewDialog">
			<img :src="imgUrl" style="width: 100%">
			<div slot="footer">
				<Button type="default" @click="previewDialog = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
	export default {
		props : {
			row : Array
		},
		data() {
			return {
				//图片附件预览
				previewDialog: false,
				imgUrl: ''
			}
		},
		methods:{
			// 附件预览
			preview(url) {
				this.previewDialog = true;
				this.imgUrl  = url;
			},
			//下载附件
			load(data){
				console.log("data: " + JSON.stringify(data));
				let openWindow = window.open('about:blank', '_blank')
				openWindow.location = data.url
			},
		}
	}
</script>
<style>
	.fileCont{
		position: relative;
		z-index: 3 !important;
	}
</style>
