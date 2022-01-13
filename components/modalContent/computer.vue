<template>
	<div class="computer" @click.stop="clickBlank">
		<div class="tool ">
			<div class="tool_1 flex XleftYcenter" v-if="!selectId">
				<el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/"
				    :disabled="crumbsList.length==1?true:false"
					:multiple="true" :limit="10" :on-preview="handlePreview" :on-remove="handleRemove"
					:on-change="upload" :show-file-list="false" :auto-upload="false">
					<el-button slot="trigger" size="small" type="primary" :disabled="crumbsList.length==1?true:false"
					>上传文件</el-button>
				</el-upload>
				<!-- <el-button style="margin-left:5px" size="small" type="primary" plain :disabled="crumbsList.length==1?true:false">新建文件夹</el-button> -->
			</div>
			<div class="tool_2 flex XleftYcenter" v-else>
				<el-button style="margin-left:5px" size="small" type="primary" plain :disabled="crumbsList.length==1?true:false">删除</el-button>
			</div>
		</div>
		<div class="statusBar flex XleftYcenter">
			<i class="el-icon-arrow-left" style="margin:0 5px" @click="goBack"></i>
			<!-- <i class="el-icon-arrow-right" style="margin:0 5px"></i> -->
			<i class="el-icon-refresh-right" style="margin:0 5px"></i>
			<div class="line">|</div>
			<div class="crumbs" v-for="item in crumbsList" :key="item.id">
				<i style="cursor: pointer;" @click="selectCrumb(item)">{{item.name}}</i>
				<span style="margin:0 10px">></span>
			</div>
		</div>
		<div class="space">
			<el-row :gutter="12">
				<el-col :span="4" v-for="item in fileList" :key="item.id">
					<el-card shadow="hover" :body-style="{ padding: '0px' }">
						<div class="fileBox" @click.stop="selectFile(item)" @dblclick="openFile(item)"
							:class="selectId===item.id?'active':''">
							<div class="file flex YcenterXcenter" v-if="item.fileType==='folder'">
								<i class="el-icon-folder"></i>
								<span class="text_hide">{{item.name}}</span>
							</div>
							<div class="file flex YcenterXcenter" v-else-if="item.fileType==='image'">
								<i class="el-icon-picture-outline"></i>
								<span class="text_hide">{{item.name}}</span>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<div class="message">
			<div class="title">空间</div>
			<el-progress :text-inside="true" :stroke-width="25" :percentage="10"></el-progress>
			<div class="text">10M/100M</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name:'computer',
		props: {
			options: {}
		},
		data() {
			return {
				// 选择id
				selectId: '',
				// 面包屑
				crumbsList: [{id:'0',name:'云盘'}],
				// 资源目录
				original_fileList: [{
					id: '0-1',
					name: '图片库',
					fileType: 'folder',
					children: [{
						id: '0-1-1',
						name: 'app.jpg',
						fileType: 'image',
						fileUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2113e5ce-7fce-45d5-8e2a-a7c1ddb48543/a8bf407a-fd6e-452a-8932-626f46b25749.zip'
					}]
				}, {
					id: '0-2',
					name: '视频库',
					fileType: 'folder'
				}, {
					id: '0-3',
					name: '文档库',
					fileType: 'folder'
				}, {
					id: '0-4',
					name: '音乐库',
					fileType: 'folder'
				}],
				fileList: [{
					id: '0-1',
					name: '图片库',
					fileType: 'folder',
					children: [{
						id: '0-1-1',
						name: 'app.jpg',
						fileType: 'image',
						fileUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2113e5ce-7fce-45d5-8e2a-a7c1ddb48543/a8bf407a-fd6e-452a-8932-626f46b25749.zip'
					}]
				}, {
					id: '0-2',
					name: '视频库',
					fileType: 'folder',
					children:[]
				}, {
					id: '0-3',
					name: '文档库',
					fileType: 'folder',
					children:[]
				}, {
					id: '0-4',
					name: '音乐库',
					fileType: 'folder',
					children:[]
				}, ]
			}
		},
		computed: {
			...mapState(['user'])
		},
		created() {

		},
		mounted() {

		},
		methods: {
			clickBlank(e) {
				this.selectId = ''
			},
			upload(file, fileList) {
				file.url = URL.createObjectURL(file.raw)
				// 将对象写入页面 同时上传 写入服务器
				this.Api.uploadFileCloud(file)
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file, '11');
			},
			// 点击面包屑
			selectCrumb(item){
				if(item.id==='0'){ // 最顶层
					this.crumbsList=[item]
					this.fileList=this.original_fileList
				}
			},
			// 返回
			goBack(){
				// this.crumbsList=this.crumbsList.filter((item,index)=>)
			},
			// 单击资源
			selectFile(item) {
				this.selectId = item.id
			},
			// 双击资源
			openFile(item) {
				this.selectId=''
				if (item.fileType == "folder") {
					this.fileList = item.children||[]
					this.crumbsList.push(item)
				}
			}

		}
	}
</script>

<style lang="less" scoped>
	.computer {
		height: 100%;
		position: relative;

		.tool {
			padding: 5px;
			border-bottom: 1px solid #eee;
		}

		.statusBar {
			padding: 10px 5px;
			border-bottom: 1px solid #eee;

			i:hover {
				color: #007AFF;
			}

			.line {
				color: #ddd;
				padding: 0 5px;
			}

			.crumbs {
				font-size: 12px;
			}
		}

		.space {
			padding: 20px;

			.file {
				padding: 20px;

				i {
					font-size: 60px;
					color: #007AFF;
				}

				span {}
			}

			.active {
				background-color: #1a7afb21;
				border: 1px solid rgb(26, 122, 251);
			}
		}

		.message {
			position: absolute;
			left: 0;
			bottom: 0;
			padding: 15px 20px;
			width: 300px;

			.title {
				font-size: 14px;
				margin: 5px 0;
			}

			.text {
				font-size: 10px;
				color: #ccc;
				margin: 5px 0;
			}
		}
	}
</style>
