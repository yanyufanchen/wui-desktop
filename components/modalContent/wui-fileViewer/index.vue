<template>
	<div class="fileViewer flex YcenterXcenter">
		<div class="tool flex XcenterYcenter">
			<i class="fa fa-search-plus no_use"></i>
			<i class="fa fa-search-minus no_use"></i>
			<i class="fa fa-question-circle-o no_use"></i>
			<i class="fa fa-share-square no_use"></i>
			<i class="fa fa-download no_use" @click="downloadFile"></i>
		</div>
		<div class="view">
			<div ref="viewBox" class="viewBox flex YcenterXcenter" style="height: 100%;" v-if="!this.options.item.data.file">
				无文件
			</div>
			<div class="viewBox" ref="viewBox" v-else>
				<img style="max-width: 100%;max-height: 100%;"
					v-if="Web_api.checkArrActive(config.fileViewTypes.image,options.item.data.file.fileType)"
					:src="options.item.data.file.fileUrl" alt="">
				<iframe v-else-if="Web_api.checkArrActive(config.fileViewTypes.pdf,options.item.data.file.fileType)"
					:src="options.item.data.file.fileUrl" frameborder="0" style="width: 100%;height: 100%;"></iframe>

				<lkaudio v-else-if="Web_api.checkArrActive(config.fileViewTypes.audio,options.item.data.file.fileType)"
					:src="options.item.data.file.fileUrl" :name="options.item.data.file.name" author="未知"
					:play.sync="audioPlay" />

				<lkvideo v-else-if="Web_api.checkArrActive(config.fileViewTypes.video,options.item.data.file.fileType)"
					:height="viewBoxHeight" :src="options.item.data.file.fileUrl"
					:name="options.item.data.file.fileUrl.name" />
				<lkword v-else-if="Web_api.checkArrActive(config.fileViewTypes.word,options.item.data.file.fileType)"
					:height="viewBoxHeight" :src="options.item.data.file.fileUrl" />
				<lkexcel v-else-if="Web_api.checkArrActive(config.fileViewTypes.excel,options.item.data.file.fileType)"
					:height="viewBoxHeight" :src="options.item.data.file.fileUrl" />
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
	import lkaudio from './lk-audio/lk-audio.vue'
	import lkvideo from './lk-video/lk-video.vue'
	import lkword from './lk-word/lk-word.vue'
	import lkexcel from './lk-excel/lk-excel.vue'
	export default {
		name: 'wui-fileViewer',
		props: {
			options: {}
		},
		data() {
			return {
				viewBoxHeight: 0, // 控制iframe的高度
				audioPlay: false, // 控制音频播放器
			}
		},
		components: {
			lkaudio,
			lkvideo,
			lkword,
			lkexcel
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
		},
		methods: {
			// 下载文件
			async downloadFile() {
				if(!this.options.item.data.file)return
				let type=this.options.item.data.file.fileUrl.substring(this.options.item.data.file.fileUrl.lastIndexOf('.'))
				let data = await this.Web_api.renderFile("blob", this.options.item.data.file.fileUrl)
				const blob = new Blob([data]); // 把得到的结果用流对象转一下
				let a = document.createElement("a"); //创建一个<a></a>标签
				a.href = URL.createObjectURL(blob); // 将流文件写入a标签的href属性值
				a.download = `${new Date().getTime()}_download.${type}`; //设置文件名
				a.style.display = "none"; // 障眼法藏起来a标签
				document.body.appendChild(a); // 将a标签追加到文档对象中
				a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
				a.remove(); // 一次性的，用完就删除a标签
			}

		}
	}
</script>

<style lang="less" scoped>
	.fileViewer {
		height: 100%;
		position: relative;

		.tool {
			position: absolute;
			top: 10px;
			width: 100%;
			height: 40px;

			// background-color: #d9d9d9;
			i {
				width: 40px;
				font-size: 20px;
				line-height: 40px;
				cursor: pointer;
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
			padding-top: 50px;

			.viewBox {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
