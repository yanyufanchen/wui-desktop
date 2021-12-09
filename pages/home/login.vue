<template>
	<view class="content">
		<image class="logo" src="/static/logo.png" @click="login"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<div class="user" v-if="user">
			<div>{{user.username}}</div>
			<div>{{user.status}}</div>
			<div>{{user.token}}</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				user:null
			}
		},
		onLoad() {

		},
		methods: {
			async login(){
				const res = await this.Api.sendUniCloud(this, {
					model: 'login',
					event: {
						username:'admin',
						password:'123456'
					}
				});
				console.log(res,'res')
				this.user=res.data
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
