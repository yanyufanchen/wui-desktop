<template>
	<div class="navigation">
		<div class="header">
			<el-tabs type="border-card" v-model="oneactiveId"  @tab-click="handleClick">
				<el-tab-pane v-for="item in loadWebsides" :label="item.name" :name="item.id">
					<div class="content flex">
						<div class="tabLeft">
							<div class="tab" @click="toTwo(item2.id)" v-for="item2 in item.children" :class="twoActiveId===item2.id?'navActive':''">{{item2.name}}</div>
						</div>
						<div class="tabRight">
							<div class="NavItem" v-for="nav in twoActiveList" >
								<div class="title flex">
									<div class="icon flex XcenterYcenter">
										<img style="width:20px;height:20px" :οnerrοr="defaultImg" :src="nav.icon" alt="" srcset="">	
									</div>
									<div class="name" style="margin-left: 10px;">{{nav.name}}</div>
								</div>
								<div class="desc">{{nav.description}}</div>
							</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		// loadAll,
		loadWebside
	} from './homeSelectList.js'
	export default {
		name: 'wui-webNavigation',
		props: {
			options: {}
		},
		data() {
			return {
				// defaultImg:"this.src='https://www.baidu.com/favicon.ico'",
				defaultImg: `this.onerror='';this.src="https://www.baidu.com/favicon.ico"`,
				loadWebsides: [],
				oneactiveId: '',
				twoActiveId:'',
				twoActiveList: [],
			}
		},
		computed: {
			...mapState(['user', 'stores'])
		},
		created() {
			// 获取初始数据
			let list = this.user.myappList.find(app => app.app_id === this.options.item.app_id).data.list
			console.log(this.options, 'this.options')
			console.log(list, '获取初始数据')
			
			this.loadWebsides = list;
			this.oneactiveId=this.loadWebsides[0].id
			this.twoActiveList=this.loadWebsides[0].children[0].children
			this.setTwoActiveList()
			this.twoActiveId=this.loadWebsides[0].children[0].id
			console.log(this.loadWebsides[0].children[0])
		},
		mounted() {
			
		},
		methods: {
			defaultImg(event){
				console.log(this.src,222222)
			    // logo: 'this.src="' + require('../../../static/image/0.jpg') + '"'  
			},
			// 顶部tab栏
			handleClick(tab, event) {
				let oneIndex=this.loadWebsides.findIndex(item=>item.id===this.oneactiveId)
				if(this.loadWebsides[oneIndex].children.length>0){
					this.twoActiveId=this.loadWebsides[oneIndex].children[0].id
					let twoIndex=0
					this.twoActiveList=this.loadWebsides[oneIndex].children[twoIndex].children
					this.setTwoActiveList()
				}
				
			},
			// 左侧tab栏
			toTwo(id){
				let oneIndex=this.loadWebsides.findIndex(item=>item.id===this.oneactiveId)
				this.twoActiveId=id
				let twoIndex=this.loadWebsides[oneIndex].children.findIndex(item=>item.id===this.twoActiveId)
				this.twoActiveList=this.loadWebsides[oneIndex].children[twoIndex].children
				this.setTwoActiveList()
			},
			setTwoActiveList(){
				this.twoActiveList.length>0&&this.twoActiveList.forEach(item=>{
					item.icon=`${this.Web_api.getLocation(item.url).origin}/favicon.ico`
					console.log(item,'111')
				})
			},
			// 随机颜色
			getRandomColor() {
				return this.Web_api.getRandomColor()
			}
		}
	}
</script>

<style lang="less" scoped>
	.navActive {
		background-color: #333;
		color: #fff!important;
	}
	.navigation {
		height: 100%;
		.header {
			height: 100%;
			
		}
	}
	.content {
		height: 100%;
		.tabLeft {
			width: 100px;
			height: 100%;
			    background-color: #999;
				.tab {
					font-size: 14px;
					color: #333;
					height: 40px;
					line-height: 40px;
					padding-left: 10px;
					cursor: pointer;
				}
				.tab:hover {
					background-color: #333;
					color: #fff;
				}
		}
		.tabRight {
			padding-left: 20px;
			padding-top: 20px;
			.NavItem {
				.title {
					font-size: 16px;
					color: aquamarine;
					height: 30px;
					line-height: 30px;
					cursor: pointer;
				}
				.title:hover {
					color: brown;
				}
				.desc {
					
				}
			}
		}
	}
</style>
<style lang="less">
	/deep/.el-tabs__header {
		padding-left: 100px !important;
		background-color: #86909c!important;
		.el-tabs__item {
			color: #fff;
		}
	}
</style>
