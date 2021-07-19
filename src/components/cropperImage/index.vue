<template>
	<div>
		<div class="cropper-content">
			<div class="cropper-box">
				<div class="cropper">
					<vue-cropper
						ref="cropper"
						:img="option.img"
						:outputSize="option.outputSize"
						:outputType="option.outputType"
						:info="option.info"
						:canScale="option.canScale"
						:autoCrop="option.autoCrop"
						:autoCropWidth="option.autoCropWidth"
						:autoCropHeight="option.autoCropHeight"
						:fixed="option.fixed"
						:fixedNumber="option.fixedNumber"
						:full="option.full"
						:fixedBox="option.fixedBox"
						:canMove="option.canMove"
						:canMoveBox="option.canMoveBox"
						:original="option.original"
						:centerBox="option.centerBox"
						:height="option.height"
						:infoTrue="option.infoTrue"
						:maxImgSize="option.maxImgSize"
						:enlarge="option.enlarge"
						:mode="option.mode"
						@realTime="realTime"
						@imgLoad="imgLoad">
					</vue-cropper>
				</div>
			</div>
			<!--预览效果图-->
			<div class="show-preview">
				<div :style="previews.div" class="preview">
					<img :src="previews.url" :style="previews.img">
				</div>
			</div>
		</div>
		<!--底部操作工具按钮-->
		<div class="footer-btn">
			<div class="box1">
				<label class="btn-upload" for="uploads">选择图片</label>
				<input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)">
				<Button @click="changeScale(1)">+</Button>
				<Button @click="changeScale(-1)">-</Button>
				<Button @click="rotateLeft">↺</Button>
				<Button @click="rotateRight">↻</Button>
			</div>
			<div class="box2">
				<Button type="primary" icon="ios-cloud-upload-outline" @click="uploadImg('blob')">上传头像</Button>
			</div>
		</div>
	</div>
</template>

<script>
import {VueCropper} from 'vue-cropper'
import {postUserAvatar} from '_s/personBasic'
export default {
	name: "CropperImage",
	components: {
		VueCropper
	},
	data() {
		return {
			previews: {},
			option:{
				img: this.$store.getters.get_avatar,             //裁剪图片的地址
				outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
				outputType: 'jpeg',  //裁剪生成图片的格式（jpeg || png || webp）
				info: true,          //图片大小信息
				canScale: true,      //图片是否允许滚轮缩放
				autoCrop: true,      //是否默认生成截图框
				autoCropWidth: 200,  //默认生成截图框宽度
				autoCropHeight: 200, //默认生成截图框高度
				fixed: true,         //是否开启截图框宽高固定比例
				fixedNumber: [1, 1], //截图框的宽高比例
				full: false,         //false按原比例裁切图片，不失真
				fixedBox: true,      //固定截图框大小，不允许改变
				canMove: false,      //上传图片是否可以移动
				canMoveBox: true,    //截图框能否拖动
				original: false,     //上传图片按照原始比例渲染
				centerBox: false,    //截图框是否被限制在图片里面
				height: true,        //是否按照设备的dpr 输出等比例图片
				infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
				maxImgSize: 3000,    //限制图片最大宽度和高度
				enlarge: 1,          //图片根据截图框输出比例倍数
				mode: '200px 200px'  //图片默认渲染方式
			}
		}
	},
	methods: {
		//初始化函数
		imgLoad (msg) {
			console.log("工具初始化函数====="+msg)
		},
		//图片缩放
		changeScale (num) {
			num = num || 1
			this.$refs.cropper.changeScale(num)
		},
		//向左旋转
		rotateLeft () {
			this.$refs.cropper.rotateLeft()
		},
		//向右旋转
		rotateRight () {
			this.$refs.cropper.rotateRight()
		},
		//实时预览函数
		realTime (data) {
			this.previews = data
		},
		//选择图片
		selectImg (e) {
			let file = e.target.files[0]
			if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
			this.$message({
				message: '图片类型要求：jpeg、jpg、png',
				type: "error"
			});
			return false
			}
			//转化为blob
			let reader = new FileReader()
			reader.onload = (e) => {
			let data
			if (typeof e.target.result === 'object') {
				data = window.URL.createObjectURL(new Blob([e.target.result]))
			} else {
				data = e.target.result
			}
			this.option.img = data
			}
			//转化为base64
			reader.readAsDataURL(file)
		},
		//上传图片
		uploadImg (type) {
			if(type==='blob') {
				this.$refs.cropper.getCropBlob(data => {
					let formData = new FormData()
					formData.append("avatarfile", data)
					postUserAvatar(formData).then(res => {
						if(res.code==200) {
							let avatar = res.data
							this.$emit('uploadImgSuccess',avatar)
							this.$store.commit('SET_AVATAR', avatar)
							this.$Message.success(res.msg)
						}
					})
				})
			}
		},
	},
}
</script>

<style scoped lang="scss">
.cropper-content{
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  .cropper-box{
    flex: 1;
    width: 100%;
    .cropper{
      width: auto;
      height: 300px;
    }
  }

  .show-preview{
    flex: 1;
    -webkit-flex: 1;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    .preview{
      overflow: hidden;
      width: auto;
      border:1px solid #67c23a;
      background: #ccc;
    }
  }
}
.footer-btn{
  padding: 20px 0 10px 0;
  display: flex;
  display: -webkit-flex;
  .box1{
	flex: 1;
    -webkit-flex: 1;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
  }
  .box2{
	flex: 1;
    -webkit-flex: 1;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }
  .btn-upload {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transition: .1s;
    transition: .1s;
    border-radius: 3px;
    border:1px solid #dcdee2;
    font-size: 14px;
    padding: 8px 20px;
  }
}
</style>