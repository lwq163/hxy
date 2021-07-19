<template>
	<div>
		<Upload 
			:action="actionUrl"
			:headers="headers"
			:with-credentials="true"
			:show-upload-list="false"
			:multiple="multiple"
			:on-success="loadSuccess"
			:before-upload="beforeLoad"
			:on-progress="progress"
			:on-error="error"
		>
			<Button type="primary" class="hxy-mr-20" v-if="upLoadText!=''">{{upLoadText}}</Button>
		</Upload>
		
		<div v-for="(item,index) in processData" :key="index" class="hxy-mt-15">
			<div>上传进度</div>
			<Progress :percent="item.len" />
		</div>
		
		
		<div class="isFlexalitem fileBox">
			<div  class="isFlexalitem hxy-mt-20 hxy-mr-20"  v-for="(item,index) in fileData" :key="index">
				<img :src="item.url" alt="" class="loadImg hxy-mr-10">
				<div>
					<div class="fileName">{{item.displayName}}</div>
					<div class="fileSize">大小{{ (item.showSize)}}<span v-if="multiple"><em @click="delFile(index)" class="delBtn hxy-ml-20" v-if="upLoadText!=''">删除</em></span></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import util from '_m/util'
	export default {
		props:{
			upLoadText : {
				type : String,
				default : "上传附件"
			},
			unType : {
				type : String,			//区分是新增还是编辑进来的
				default:""
			},
			multiple : {				//默认多张上传，false是单张
				type : Boolean,
				default : true
			},
			fileType : {
				type : String,
				default: "all"
			}
		},
		data() {
			return {
				headers  : {
					'Authorization' : 'Bearer ' + util.getCookie('Admin-Token')
				},
				maxSize	: 1024,	//上传大小kb，最大1M
				fileData: [],	//附件集合
				processData:[],	//上传的进度条集合
			}
		},
		created() {
			this.actionUrl = process.env.VUE_APP_BASE_API+"/file/upload";
		},
		methods:{
			beforeLoad(file){
				let ext = file.name.slice(file.name.lastIndexOf(".")+1).toLowerCase(); //取文件后缀名
				let checkTypeArry = [];
				if(this.fileType=='img'){			//头像的校验
					if(file.size / 1024 > this.maxSize){
						this.$Message.error("请上传小于1M的图片！")
						return false
					}
					checkTypeArry = ["jpg","png","jfif","gif", "jpeg"];
				}else{								//其它文件类型的校验
					checkTypeArry = ["doc","docx","xls	","xlsx","jpg","png","bmp","jfif","gif", "jpeg", "ppt", "pptx", "html", "htm", "txt", "rar", "zip", "gz", "bz2", "mp4", "avi", "rmvb", "pdf"];
				}
				if(checkTypeArry.indexOf(ext)===-1){ //存在数据
					this.$Message.error("当前格式不支持！")
					return false
				}
				var obj = {
					len : 0,
					uid : file
				}
				this.processData.push(obj);
			},
			progress(e,file){
				// console.log("e: " + JSON.stringify(e));
				console.log("file: " + JSON.stringify(file));
				if(this.processData!=''){
					for(var i=0;i<this.processData.length;i++){
						var temp = this.processData[i];
						if(temp.uid.uid==file.uid){
							temp.len = e.percent
							if(e.percent==100){		
								this.processData.splice(i,1)
							}
						}
					}
				}
			},
			loadSuccess(e,file){
				if(file.response.code==200){
					file.response.data.showSize = this.$util.conver(file.response.data.size);
					if(!this.multiple){
						this.fileData = [];
					}
					this.fileData.push(file.response.data);
					this.$emit('listenFile',this.fileData,this.unType);
				}else{
					this.$Message.error(file.response.msg)
				}
			},
			delFile(index){
				this.fileData.splice(index,1);
				this.$emit('listenFile',this.fileData,this.unType)
			},
			changeData(data){
				if(data){
					data.forEach((item)=>{
						this.$set(item,'showSize',this.$util.conver(item.size))
					})
					this.processData = [];
				}
				this.fileData = data;
			},
			error(error){
				console.log("error: " + JSON.stringify(error));
			}
		}
	}
</script>
<style>
	.fileBox{
		flex-wrap: wrap;
	}
	.fileName{
		max-width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.fileSize em{
		font-style: normal;
	}
	.delBtn{
		cursor: pointer;
	}
	.loadImg{
		width: 40px;
		height: 40px;
		border-radius: 4px;
	}
</style>
