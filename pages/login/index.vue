<template>
	<view class="login_content flex XcenterYcenter" :style="{'backgroundImage':desktopImage}">
		<div class="loginBox flex YcenterXcenter" v-if="!isFaceFlag">
			<div class="logo">
				<i class="el-icon-s-platform"></i>
				<span>WUI 个人云桌面</span>
			</div>
			<div class="form flex YcenterXcenter">
				<el-input placeholder="请输入账号" style="width:300px;border-radius: 40px;margin-bottom:15px" prefix-icon="el-icon-user
" v-model="from.username">
				</el-input>
				<el-input :type="textType" placeholder="请输入密码" style="width:300px;border-radius: 40px;"
					prefix-icon="el-icon-lock" v-model="from.password">
					<i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
				</el-input>
				<div class="code flex XcenterYcenter" style="margin-top:15px;">
					<el-input placeholder="请输入验证码" style="width:170px;margin-right:10px;border-radius: 40px;"
						prefix-icon="el-icon-picture-outline" v-model="from.code">
					</el-input>
					<imgcode />

				</div>
				<div class="hide" style="margin-top:5px;color:#fff">看不清？点击图片刷新验证码</div>
				<div class="btn flex YcenterXcenter" style="width:100%;margin-top:30px">
					<div class="button" @click="account_login">登录</div>
				</div>
				<div class="tools flex XcenterYcenter">
					<div class="tool">
						<el-tooltip class="item" effect="dark" content="扫脸登录" placement="left-end">
							<i class="el-icon-camera-solid" @click="to_face"></i>
						</el-tooltip>
					</div>
					<div class="tool">
						<el-tooltip class="item" effect="dark" @click="to_wechat" content="微信授权登录" placement="left-end">
							<i class="fa fa-wechat"></i>
						</el-tooltip>
					</div>
				</div>
			</div>

		</div>
		<!-- 扫脸 -->
		<face :isFaceFlag="isFaceFlag" v-if="isFaceFlag" @enter="face_login" @faceClose="handlefaceClose" />
		
	</view>
</template>

<script>
	import imgcode from '../../components/imgcode/imgcode.vue'
	import face from '../../components/loginCom/face/index.vue'
	import {
		getMedia,
		takePhoto,
		cancalCloseVideo
	} from '../../components/loginCom/face/camera.js'
	export default {
		data() {
			return {
				title: 'Hello',
				user: null,
				from: {
					username: '',
					password: '',
					code: ''
				},
				desktopImage: 'url(./static/medias/desktop/3.jpg)',
				textType: 'password',
				loginStatus: 'account', // 登录方式 account face  wechat
				isFaceFlag: false, // 扫脸弹框
				
			}
		},
		components: {
			imgcode,
			face
		},
		onLoad() {

		},
		mounted(){
			
		},
		methods: {
			async account_login() {
				for (let k in this.from) {
					if (!this.from[k] && k === 'username') {
						this.$message.error(`账号不能为空`);
						return;
					}
					if (!this.from[k] && k === 'password') {
						this.$message.error(`密码不能为空`);
						return;
					}
					if (!this.from[k] && k === 'code') {
						this.$message.error(`验证码不能为空`);
						return;
					}
				}
				// 获取code
				let codeValue = uni.getStorageSync('imgcode');

				if (codeValue.toLowerCase() !== this.from.code.toLowerCase()) {
					this.$message.error(`验证码错误`);
					return;
				}
				const res = await this.Api.sendUniCloud({
					model: 'login',
					event: {
						type: this.loginStatus,
						username: this.from.username,
						password: this.from.password,
					}
				});
				if (!res.status) {
					this.$message.error(res.mes);
					return
				}
				this.$store.commit('login', res.data);
				this.$message({
					message: '登录成功',
					type: 'success',
					duration: 1000,
					onClose: () => {
						console.log('跳转')
						uni.redirectTo({
							url: "/pages/home/index"
						});
					}
				});
			},
			changeType() {
				this.textType = this.textType === 'password' ? 'text' : 'password';
			},
			to_face() {
				this.isFaceFlag = true
			},
			handlefaceClose() {
				console.log('取消')
				this.isFaceFlag = false
				// 关闭扫描框
				cancalCloseVideo()
			},
			async face_login() {
				this.loginStatus='face'
				const res = await this.Api.sendUniCloud({
					model: 'login',
					event: {
						type: this.loginStatus,
						image: takePhoto(),
					}
				},false);
				if (!res.status) {
					this.$message.error(res.mes);
					return
				}
				if(!this.isFaceFlag){
					console.log('已关闭扫脸弹框')
					return
				}
				if(!res.faceFlag&&this.isFaceFlag){
					this.$message.error(res.mes);
					this.face_login()
					return
				}
				// 关闭扫描框
				cancalCloseVideo()
				this.isFaceFlag = false
				this.$store.commit('login', res.data);
				this.$message({
					message: '登录成功',
					type: 'success',
					duration: 1000,
					onClose: () => {
						console.log('跳转')
						uni.redirectTo({
							url: "/pages/home/index"
						});
					}
				});
				
			}
		}
	}
</script>

<style lang="less">
	

	.login_content {
		width: 100%;
		height: 100vh;
		/* background-image: url(../../static/image/0.jpg); */
		background-repeat: no-repeat;
		background-size: 100% 100%;

		.loginBox {
			width: 600px;
			background: #14365c8a;
			border-radius: 10px;
			border: 1px solid #ebeef547;
			box-shadow: 2px -2px 19px 1px #143b66;
			padding: 20px 0;

			.logo {
				font-size: 40px;
				color: #fff;
				margin-bottom: 25px;

				i {
					font-size: 50px;
					margin-right: 20px;
				}

				span {}
			}

			.form {
				.btn {
					.button {
						cursor: pointer;
						width: 200px;
						height: 35px;
						line-height: 35px;
						border-radius: 35px;
						text-align: center;
						// background-color: #fff;
						color: #fff;
						background-color: #55aaff;
					}
				}
			}

			.tools {
				margin-top: 20px;

				.tool {
					margin: 0 10px;
					cursor: pointer;
					color: #fff;
					font-size: 25px;
				}

				.tool:hover {
					color: aqua;
				}
			}
		}

		
	}
</style>
