<template>
	<div class="computer" @click.stop="clickBlank">
		<div class="tool ">
			<div class="tool_1 flex XleftYcenter" v-if="!selectId">
				<el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/"
					:disabled="crumbsList.length==1?true:false" :multiple="false" :limit="10" :on-change="upload"
					:show-file-list="false" :auto-upload="false">
					<el-button slot="trigger" size="small" type="primary" :disabled="crumbsList.length==1?true:false">
						上传文件</el-button>
				</el-upload>
				<el-button @click="addFolder" style="margin-left:5px" size="small" type="primary" plain :disabled="crumbsList.length==1?true:false">新建文件夹</el-button>
			</div>
			<div class="tool_2 flex XleftYcenter" v-else>
				<el-button style="margin-left:5px" size="small" type="primary" plain
					:disabled="crumbsList.length==1?true:false" @click.stop="deleteFile">删除</el-button>
			</div>
		</div>
		<div class="statusBar flex XleftYcenter">
			<i class="el-icon-arrow-left" style="margin:0 5px" @click="goBack"></i>
			<i class="el-icon-refresh-right" style="margin:0 5px"></i>
			<div class="line">|</div>
			<div class="crumbs" v-for="item in crumbsList" :key="item.id">
				<i style="cursor: pointer;" @click="selectCrumb(item)">{{item.name}}</i>
				<span style="margin:0 10px">></span>
			</div>
		</div>
		<div class="space">
			<el-row :gutter="12">
				<el-col :span="4" v-for="item in getActiveList(getcustomData(user).original_fileList)" :key="item.id">
					<el-card shadow="click" :body-style="{ padding: '0px' }" style="cursor: default;margin-bottom:5px">
						<el-tooltip placement="bottom" effect="light">
							<div slot="content">
								<div v-if="item.fileType!=='folder'">
									创建时间：{{item.fileTime&&Time.formatTime(item.fileTime,'Y-M-D')}}</div>
								<div v-if="item.fileType!=='folder'">
									大小：{{item.fileSize&&Web_api.toFriendlySize(item.fileSize)}}</div>
								<div v-if="item.fileType!=='folder'">文件类型：{{item.fileType}}</div>
								<div style="text-align: center;">文件名：{{item.name}}</div>
							</div>
							<div class="fileBox" @click.stop="selectFile(item)" @dblclick="openFile(item)"
								:class="selectId===item.id?'active':''">
								<!-- 文件夹 -->
								<div class="file flex YcenterXcenter" v-if="item.fileType==='folder'">
									<i class="el-icon-folder"></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- 图片 -->
								<div class="file flex YcenterXcenter" v-else-if="item.fileType.indexOf('image')>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<!-- 上传成功 -->
									<img :src="item.fileUrl" alt="" style="width: 60px;height: 60px;"
										v-else-if="item.status&&item.status=='success'">
									<!-- 无状态 -->
									<i class="el-icon-picture-outline" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- pdf -->
								<div class="file flex YcenterXcenter" v-else-if="['application/pdf'].findIndex(item2=>item.fileType===item2)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-pdf-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- word -->
								<div class="file flex YcenterXcenter" v-else-if="['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].findIndex(item2=>item.fileType===item2)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-word-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- pptx -->
								<div class="file flex YcenterXcenter" v-else-if="['application/vnd.openxmlformats-officedocument.presentationml.presentation'].findIndex(item2=>item.fileType===item2)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-powerpoint-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- 表格 -->
								<div class="file flex YcenterXcenter" v-else-if="['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].findIndex(item2=>item.fileType==item2)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-excel-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- 文本 -->
								<div class="file flex YcenterXcenter" v-else-if="['text/plain'].findIndex(item2=>item.fileType.indexOf(item2)>-1)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-text-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- 代码 -->
								<div class="file flex YcenterXcenter" v-else-if="['js','css'].findIndex(item2=>item.fileType.indexOf(item2)>-1)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-text-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- 压缩包 -->
								<div class="file flex YcenterXcenter" v-else-if="['application/zip'].findIndex(item2=>item.fileType.indexOf(item2)>-1)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-zip-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- audio-->
								<div class="file flex YcenterXcenter" v-else-if="['audio/mpeg'].findIndex(item2=>item.fileType.indexOf(item2)>-1)>-1">
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-sound-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- video-->
								<div class="file flex YcenterXcenter" v-else-if="['video/mp4'].findIndex(item2=>item.fileType.indexOf(item2)>-1)>-1">
									<!-- 上传中-->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-video-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
								<!-- 未知格式 -->
								<div class="file flex YcenterXcenter" v-else>
									<!-- 上传中 -->
									<i class="el-icon-loading" v-if="item.status&&item.status=='ready'"></i>
									<!-- 上传失败 -->
									<i class="el-icon-remove" color="red"
										v-else-if="item.status&&item.status=='error'"></i>
									<i class="fa fa-file-o" v-else></i>
									<span class="text_hide" style="width: 100%;">{{item.name}}</span>
								</div>
							</div>
						</el-tooltip>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<div class="message">
			<div class="title">空间</div>
			<el-progress :text-inside="true" :stroke-width="25" :percentage="Number(((computeStorageMax().userStorageNum/1024/1024)/(computeStorageMax().systemStorageNum/1024/1024)*100).toFixed())"></el-progress>
			<div class="text">{{(computeStorageMax().userStorageNum/1024/1024).toFixed()}}M/{{(computeStorageMax().systemStorageNum/1024/1024).toFixed()}}M</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: 'wui-my-computer',
		props: {
			options: {}
		},
		computed: {
			...mapState(['user'])
		},
		data() {
			return {
				// 选择id
				selectId: '',
				// 层级
				activeId: '',
				// 面包屑
				crumbsList: [{
					id: '0',
					name: '云盘'
				}],
			}
		},
		computed: {
			...mapState(['stores','user']),

		},
		created() {
			// 如果私有数据为null, 说明是初次进入应用,则进行初始化私有数据字段，并更新user
			let user=this.Web_api.clone(this.user)
			let app=user.myappList.find(app => app.app_id === this.options.item.app_id)
			// let storeApp=this.stores.find(app => app.app_id === this.options.item.app_id)
			if(!app.customData){
				app.customData=app.default
				// 写入vuex
				this.$store.dispatch('setUserApi', user);
			}
		},
		mounted() {
		},
		methods: {
			computeStorageMax(){
				let original_fileList=this.getcustomData(this.user).original_fileList
				return this.Api.computeStorageMax(original_fileList)
			},
			// 获取当前数据
			getcustomData(user) {
				let Data=null
				let myapp=user.myappList.find(item => item.app_id === this.options.item.app_id)
				if(!Data){
					Data={
						original_fileList:[]
					}
				}
				Data=this.Web_api.clone(myapp.default)
				Data.original_fileList.forEach(item=>{
					let active=myapp.customData.original_fileList.find(item2=>item2.id===item.id)
					if(active){
						item.children=active.children
					}
				})
				return Data
			},
			// 获取当前层级数据
			getActiveList(list) {
				let activeList = []
				if (this.activeId === '') {
					activeList = this.getcustomData(this.user).original_fileList
					return activeList
				}
				activeList=this.setTree('item').children
				return activeList
			},
			clickBlank(e) {
				this.selectId = ''
			},
			// 上传
			async upload(file, fileList) {
				// 检测是否满足上传大小
				let checkRes=this.Api.checkStorageMax(file.size)
				if (!checkRes.status) {
					this.$message.error(checkRes.mes)
					return
				}
				file.url = URL.createObjectURL(file.raw)
				// 将对象写入页面 同时上传 写入服务器
				let activedata = this.getActiveList(this.getcustomData(this.user).original_fileList)
				let id = `${this.activeId}-${activedata.length+1}`
				let fileData = {
					id: id,
					name: file.name,
					fileType: file.raw.type,
					status: file.status,
					fileSize: file.size,
					fileUrl: '',
					fileTime: file.raw.lastModifiedDate
				}
				activedata.push(fileData)
				let res = await this.Api.uploadFileCloud(file, this.UploadProgress)
				if (!res.status) {
					this.$message.error(res.mes)
					return
				}
				fileData.status = 'success'
				fileData.fileUrl = res.url
				// 写入vuex
				this.$store.dispatch('setUserApi', this.user);
			},
			// 上传进度
			UploadProgress(resolve) {
				console.log(resolve, '上传进度')
			},
			// 点击面包屑
			selectCrumb(item) {
				if (item.id === '0') { // 最顶层
					this.crumbsList = [item]
					this.activeId = ''
					return
				}
				let clickIndex=this.crumbsList.findIndex((item2=>item2.id===item.id))
				this.crumbsList=this.crumbsList.filter((item2,index2)=>index2<=clickIndex)
				this.activeId = item.id
			},
			// 返回
			goBack() {
				// this.crumbsList=this.crumbsList.filter((item,index)=>)
			},
			// 单击资源
			selectFile(item) {
				this.selectId = item.id
			},
			// 双击资源
			openFile(item) {
				if (item.fileType == "folder") {
					this.selectId = ''
					this.crumbsList.push(item)
					this.activeId = item.id
				} else { // 激活文件查看器
					// 如果没有下载该应用,就无法查看
					if(!this.user.myappList.find(item=>item.app_id=='wui-fileViewer')){
						this.$message.warning('请前往引用商店安装文件查看器')
						return
					}
					
					let activeApp=this.stores.find(item=>item.app_id=='wui-fileViewer')
					let user=this.Web_api.clone(this.user)
					user.wuiModals.push({
						id:this.Web_api.getArrMaxValue(user.wuiModals,'id')+1,
						app_id:activeApp.app_id,
						show_flag:true,
						zIndex:this.Web_api.getArrMaxValue(user.wuiModals,'zIndex')+1,
						data:{
							file:item
						}
					})
					this.$store.dispatch('setUserApi',user)
				}
			},
			// 删除文件 只做了两个固定层级
			deleteFile() {
				this.$confirm('确定要删除该文件吗?', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let user = this.Web_api.clone(this.user)
					let activedata = this.getActiveList(this.getcustomData(user).original_fileList)
					let fileUrl = activedata.find(item => item.id === this.selectId).fileUrl

					// 写入vuex
					let original_fileList = user.myappList[user.myappList.findIndex(item => item.app_id === this
						.options.item
						.app_id)].customData.original_fileList
					let filelist = original_fileList[original_fileList.findIndex(item => item.id === this
						.activeId)].children
					for (var i = 0; i < filelist.length; i++) {
						if (filelist[i].id === this.selectId) {
							filelist.splice(i, 1);
						}
					}
					this.$store.dispatch('setUserApi', user);
					// 发起删除
					if (fileUrl) {
						this.Api.sendUniCloud({
							model: 'deleteFileCloud',
							event: {
								token:uni.getStorageSync('token'),
								fileUrl
							}
						});
					}
				}).catch(() => {});

			},
			// 新建文件夹
			addFolder(){
				let activedata = this.getActiveList(this.getcustomData(this.user).original_fileList)
				// 当前层级新增文件夹
				let name=activedata.find(item=>item.name==='新建文件夹')?`新建文件夹_${new Date().getTime()}`:'新建文件夹'
				let filefolder={
					fileType: "folder",
					id: `${this.activeId}-${activedata.length+1}`,
					name: name,
					children:[]
				}
				// 处理数据
				this.setTree('add',filefolder)
				
			},
			// 设置数据结构
			setTree(type,filefolder){
				let user=this.user
				let active=null
				let search=(tree)=>{
					tree.children.forEach(item=>{
						if(item.id===this.activeId){
							if(type==='add'){
								item.children.push(filefolder)
								// 写入vuex
								this.$store.dispatch('setUserApi', user);
								return
							}
							if(type==='item'){
								active=item
								return
							}
						}else{
							item.children&&search(item)
						}
					})
				}
				search({
					id:'0',
					children:this.getcustomData(this.user).original_fileList
				})
				return active
			}
		}
	}
</script>

<style lang="less" scoped>
	.text_hide {
		text-align: center;
	}
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
			.fileBox {
				border: 1px solid #60626645;
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
