<template>
	<div class="fileViewer flex YcenterXcenter">
		<div class="tool flex XcenterYcenter">
			<i class="fa fa-search-plus no_use"></i>
			<i class="fa fa-search-minus no_use"></i>
			<i class="fa fa-question-circle-o no_use"></i>
			<i class="fa fa-share-square no_use"></i>
			<i class="fa fa-download no_use"></i>
		</div>
		<div class="view">
			<div class="viewBox" ref="viewBox">
				<img style="width:100%"
					v-if="['jpg','jpeg','png','gif'].findIndex(item2=>options.item.data.file.fileType.indexOf(item2)>-1)>-1"
					:style="{'height':`${viewBoxHeight}px`}" :src="options.item.data.file.fileUrl" alt="">

				<iframe
					v-else-if="['application/pdf','text/plain'].findIndex(item2=>options.item.data.file.fileType==item2)>-1"
					:src="options.item.data.file.fileUrl" frameborder="0" style="width: 100%;height: 100%;"></iframe>

				<lkaudio v-else-if="['audio/mpeg'].findIndex(item2=>options.item.data.file.fileType==item2)>-1"
					:src="options.item.data.file.fileUrl" :name="options.item.data.file.name" author="未知"
					:play.sync="audioPlay" />
					
					<lkvideo v-else-if="['video/mp4'].findIndex(item2=>options.item.data.file.fileType==item2)>-1"
					:height="viewBoxHeight"  
					:src="options.item.data.file.fileUrl" :name="options.item.data.file.fileUrl.name"
					/>
				<!-- <video id="myVideo" style="width:100px"
					v-else-if="['video/mp4'].findIndex(item2=>options.item.data.file.fileType==item2)>-1"
					src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"
					:danmu-list="danmuList" enable-danmu danmu-btn controls></video> -->
				<div v-else class="no_view flex YcenterXcenter" style="width:100%;height:100%">
					暂不支持该格式预览
					<p>{{options.item.data.file.fileType}}</p>
				</div>
			</div>
			<div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import lkaudio from '@/components/lk-audio/lk-audio.vue'
	import lkvideo from '@/components/lk-video/lk-video.vue'
	export default {
		name: 'fileViewer',
		props: {
			options: {}
		},
		data() {
			return {
				viewBoxHeight: 0, // 控制iframe的高度
				audioPlay:false, // 控制音频播放器
			}
		},
		components: {
			lkaudio,
			lkvideo
		},
		computed: {
			// ...mapState(['desktops'])

		},
		created() {

		},
		mounted() {
			this.$nextTick(() => {
				this.viewBoxHeight = this.$refs.viewBox.offsetHeight
			})
			// console.log(this.$refs.viewBox.offsetHeight,'this.$refs.viewBox.offsetHeight')
			// this.viewBoxHeight=this.$refs.viewBox.offsetHeight
		},
		methods: {
			

		}
	}
</script>

<style lang="less" scoped>
	.fileViewer {
		height: 100%;
		position: relative;

		.tool {
			width: 100%;
			height: 40px;

			// background-color: #d9d9d9;
			i {
				width: 40px;
				font-size: 20px;
				line-height: 40px;
			}

			.no_use {
				color: #aaa;
			}
		}

		.view {
			box-sizing: border-box;
			width: 100%;
			height: 100%;
			padding: 20px;
			padding-top: 0;

			.viewBox {
				height: 100%;

			}
		}
	}
</style>
