<template>
	<div class="locking">
		<div class="content flex YcenterXcenter">
			<div class="header">
				<i class="el-icon-user-solid"></i>
			</div>
			<el-input style="width:300px" placeholder="请输入密码" v-model="password" show-password></el-input>
			<el-button type="primary" round @click="unlocking" style="width:200px;margin-top:20px">解除锁定</el-button>
		</div>
	</div>
</template>
     
<script>
	
	import {
		mapState
	} from 'vuex';
	export default {
		name:'locking',
		data() {
			return {
				password:''
			};
		},
		
		computed: {
			...mapState(['user'])
		},
		components: {
			
		},
		onLoad() {
			
		},
		methods: {
			async unlocking(){
				if(!this.password){
					this.$message.error('请输入密码');
					return
				}
				const res = await this.Api.sendUniCloud(this, {
					model: 'checkAccount',
					event: {
						token:uni.getStorageSync('token'),
						username: this.user.username,
						password: this.password,
					}
				});
				if(!res.status){
					this.$message.error(res.mes);
					return
				}
				this.$store.commit('locking',false)
				uni.setStorageSync('locking',false)
			}
		}
	};
</script>

<style lang="less" scoped>
	.locking {
		position: fixed;
		width: 100%;
		height: 100vh;
		z-index: 1001;
		background-color: #383a31;
		.content {
			position: relative;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			// background-color: #a7ad93;
			width: 300px;
			height: 300px;
			.header {
				width: 120px;
				height: 120px;
				border-radius: 120px;
				line-height: 120px;
				text-align: center;
				font-size: 55px;
				color: #0089FE;
				background: #ccc;
				margin-bottom: 30px;
			}
			.hint {
				margin-top: 10px;
				font-size: 12px;
				color: #ccc;
			}
		}
	}
</style>
