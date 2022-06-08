<template>
	<el-dialog title="人脸识别" :visible.sync="isFaceFlag" width="50%" :center="true" top="20vh" modal
		:before-close="handlefaceClose">
		<div class="faceBox flex XcenterYcenter">
			<div class="scanBox">
				<video id="face_video" style=""
					src=""
					@error="videoErrorCallback" :show-play-btn="false" :show-center-play-btn="false" enable-danmu
					danmu-btn :controls="false"></video>
				<!-- <video id="face_video" width="100%" height="100%" autoplay="autoplay"></video> -->
				<canvas id="face_canvas" style="width: 300px; height: 400px;position: absolute;top:0px;" ></canvas>
				<div class="scanline" :style="{top:`${scanlineTop}%`}"></div>
			</div>
		</div>
		<span slot="title" style="color: #fff;font-size: 20px;">人脸识别</span>
		<span slot="footer" class="dialog-footer">
			<!-- <el-button @click="handlefaceClose">取 消</el-button> -->
			<!-- <el-button type="primary" @click="face_login">确 定</el-button> -->
		</span>
	</el-dialog>
</template>

<script>
	import {
		getMedia,
		takePhoto,
		cancalCloseVideo
	} from './camera.js'
	export default {
		props: {
			isFaceFlag: false
		},
		data() {
			return {
				scanlineTop: 0, // 扫描线
				// faceVideoSrc:''
			}
		},
		mounted() {
			// scanlineTop
			setInterval(() => {
				if (this.scanlineTop === 100) {
					this.scanlineTop = 0
				}
				this.scanlineTop = this.scanlineTop + 1
			}, 20)
			// 启动相机
			this.$nextTick(() => {
				getMedia(this.faceCallback)
			})

		},
		methods: {
			handlefaceClose() {
				this.$emit('faceClose', false)
			},
			facelogin() {
				this.$emit('enter', false)
			},
			faceCallback(e) {
				console.log(e, '扫描')
				if (e) {
					// setInterval(()=>{
						// let image = takePhoto()
						// console.log(image, 'image')
						// 进行人脸识别
						this.$emit('enter')
					// },1000)
					
				}

			},
			videoErrorCallback(err) {
				console.log(err, 'err')
			}

		}
	}
</script>

<style lang="less">
	/deep/.el-dialog {
		background-color: #9dcacf69 !important;
		backdrop-filter: blur(6px);
		border-radius: 10px;
	}

	// .face_video {}

	.faceBox {
		padding: 30px;

		.scanBox {
			width: 300px;
			height: 400px;
			background-color: #d7e2e61f;
			border: 4px dashed #7efbfc;
			position: relative;
			box-shadow: -1px -4px 19px 1px #9fcee2;

			// border: 4mm ridge rgba(85, 255, 255, 0.6);
			.scanline {
				width: 100%;
				height: 0px;
				border: 2px dashed #7efbfc;
				position: absolute;
				// top: 0px;
			}
		}
	}
</style>
