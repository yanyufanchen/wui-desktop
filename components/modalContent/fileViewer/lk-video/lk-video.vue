<template>
	<div class="box flex XcenterYcenter" :style="{'height':`${height}px`}">
		<div id="mui-player" :style="{'height':`${height}px`}" style="width:100%"></div>
	</div>
</template>

<script>
	import 'mui-player/dist/mui-player.min.css'
	import MuiPlayer from 'mui-player'
	import MuiPlayerDesktopPlugin from 'mui-player-desktop-plugin'
	export default {
		data() {
			return {
				

			}
			
		},
		props:{
			height:0,
			src:'',
			name:''
		},
		mounted() {
			// 初始化 MuiPlayer 插件，MuiPlayer 方法传递一个对象，该对象包括所有插件的配置
			var mp = new MuiPlayer({
				container: '#mui-player',
				title:this.name,
				src:this.src,
				// title: '你相信有灵魂伴侣吗',
				// src: 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4',
				plugins: [
					new MuiPlayerDesktopPlugin({
						customSetting:[
							{
								functions: '循环播放',
								name: 'loopPlay'
							},
							{functions:'播放速度',
							name:'playbackRate'}
						], // 设置组配置
						// contextmenu, // 右键菜单组配置
						// thumbnails, // 缩略图配置
					})
				]
			})
			console.log(mp, 'mp')
		},
		onLoad() {

		},
		
		onHide() {
			// this.currentId = 0
		},
		methods: {
			

		}
	}
</script>

<style lang="scss">
	.box {
		width: 100%;
		height: 100%;
	}
</style>
