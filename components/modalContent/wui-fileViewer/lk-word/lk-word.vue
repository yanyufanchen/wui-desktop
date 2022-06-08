<template>
	<div class="box flex XcenterYcenter" :style="{'height':`${height}px`}">
		<!-- word查看详情 -->
		<div ref="word" class="word"></div>
	</div>

	</div>
</template>

<script>
	// const docx = require("docx-preview");
	import docx from 'docx-preview'
	import axios from 'axios'
	export default {
		props: {
			src: '', //文件地址
			height: 0
		},
		data() {
			return {
				vHtml: "",
				wordURL: '' //文件地址，看你对应怎末获取、赋值
			};
		},
		mounted() {
			// 具体函数调用位置根据情况而定
			this.readExcelFromRemoteFile();
		},
		methods: {
			// 在线查看word文件
			async readExcelFromRemoteFile() {
				let res=await this.Web_api.renderFile("blob", this.src)
				docx.renderAsync(res, this.$refs.word); // 渲染到页面
			},
		}

	}
</script>

<style lang="scss">
	.box {
		width: 100%;
		height: 100%;
		.word {
			height: 100%;
			overflow-y: auto;
		}
	}
</style>
