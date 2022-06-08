<template>
	<div class="borwser">
		<el-tabs v-model="editableTabsValue" type="border-card" :editable="true" @tab-click="selectTab"
			@tab-remove="removeTab" @tab-add="addTab">
			<el-tab-pane v-for="(item, index) in user.myappList.find(app=>app.app_id===options.item.app_id).customData.list"
				:key="index" :label="item.title" :name="item.id">
				<div class="content">
					<div class="content_home" v-if="item.type=='home'">
						<div class="content_home_header" style="padding: 50px 100px;">
							<el-autocomplete class="inline-input" v-model="homeValue" :fetch-suggestions="querySearch"
								placeholder="请输入内容/网址" :trigger-on-focus="false" @select="handleSelect"
								style="width:100%;height:40px;box-shadow: 3px 5px 20px 4px #66b1ff2b;">
								<el-button @click="searchWebSize" slot="append" icon="el-icon-search"></el-button>
							</el-autocomplete>
						</div>
						<div class="content_home_main" style="padding: 30px 100px;">
							<span :style="{color:getRandomColor()}" class="content_home_main_webside"
								@click="handleSelect(websize)" v-for="(websize,index3) in loadWebsides"
								:key="index3">{{websize.value}}</span>
						</div>
					</div>
					<div class="tools flex XspaceBYcenter" v-show="item.type!=='home'">
						<div class="left flex XspaceBYcenter">
							<i class="el-icon-back" @click="handleTool('back',item.url)"></i>
							<i class="el-icon-right" @click="handleTool('to',item.url)"></i>
							<i class="el-icon-refresh-right" @click="handleTool('refresh',item.url)"></i>
						</div>
						<div class="search"></div>
						<div class="right">
							<i class="el-icon-monitor" @click="handleTool('open',item.url)"></i>
						</div>
					</div>
					<iframe ref="iframe" v-show="item.type!=='home'" target="_top" :src="item.url+t" frameborder="0"
						allowfullscreen scrolling='auto' style="width:100%;height:100%;">
						</iframe>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		loadAll,
		loadWebside
	} from './homeSelectList.js'
	export default {
		name: 'wui-browser',
		props: {
			options: {}
		},
		data() {
			return {
				editableTabsValue: '', // tab栏value
				TabsIndex:0,
				t:'',
				homeValue: '', // home页输入
				restaurants: [], // home页selectlist值
				loadWebsides: []
			}
		},
		computed: {
			...mapState(['user', 'stores'])
		},
		created() {
			// 如果私有数据为null, 说明是初次进入应用,则进行初始化私有数据字段，并更新user
			let user = this.Web_api.clone(this.user)
			let app = user.myappList.find(app => app.app_id === this.options.item.app_id)
			// let storeApp = this.stores.find(app => app.app_id === this.options.item.app_id)
			if (!app.customData) {
				app.customData={
					list:app.default.list
				}
				this.$store.dispatch('setUserApi', user);
			}else{ // 有数据，则进一步处理 合并数据
				app.customData={
					list:Object.assign(app.customData.list,app.default.list)
				}
			}
			this.editableTabsValue=app.customData.list[0].id
			// home建议
			this.restaurants=app.default.restaurants
			this.loadWebsides=app.default.loadWebsides
		},
		mounted() {
		},
		methods: {
			handleTool(type,url){
				if(type==='back'){
					this.$refs.iframe[this.TabsIndex].contentWindow.location.replace(url)
				}
				if(type==='to'){
					
				}
				if(type==='refresh'){
					this.t=`?_${new Date().getTime()}`
				}
				if(type==='open'){
					window.open(url,'_blank')
				}
			},
			selectTab(targetName) {
				this.TabsIndex=Number(targetName.index)
				// 从我的应用取值
				let user = this.Web_api.clone(this.user)
				let active = ''
				user.myappList.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						active = user.myappList.find(app => app.app_id === item.app_id)
						active.customData.list.forEach(item2 => item2.show = false)
						active.customData.list.forEach(item2 => {
							if (item2.title === targetName.label) {
								item2.show = true
							}
						})
					}
				})
				// 写入vuex
				this.$store.commit('updateUser', user);
			},
			addTab(targetName) {
				let active = this.stores.find(app => app.app_id === this.options.item.app_id)
				this.createTabApi(active.default.list[0])
			},
			createTabApi(tabObj) {
				let user = this.Web_api.clone(this.user)
				let active = ''
				let id = ''
				user.wuiModals.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						active = user.myappList.find(app => app.app_id === item.app_id)
						active.customData.list.forEach(item2 => item2.show = false)
						id = String(new Date().getTime())
						active.customData.list.push({
							id,
							title: tabObj.title,
							url: tabObj.url,
							type: tabObj.type,
							show: true,
						})
					}
				})
				this.editableTabsValue = id;
				// 写入vuex
				this.$store.dispatch('setUserApi', user);
				// const {iframe} = this.$refs;
				// console.log(iframe,'iframe')
			},
			removeTab(targetName) {
				let user = this.Web_api.clone(this.user)
				user.wuiModals.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						let active = user.myappList.find(app => app.app_id === item.app_id)
						active.customData.list = active.customData.list.filter(item2 => `${item2.id}` !== targetName)
						active.customData.list.forEach((item2, index2) => {
							item2.show = false
							if (index2 === active.customData.list.length - 1) {
								item2.show = true
								this.editableTabsValue = item2.id;
								console.log(this.editableTabsValue,'this.editableTabsValue')
								console.log(item2,'this.editableTabsValue')
							}
						})
						if (active.customData.list.length == 0) { // 需要退出浏览器
							console.log('需要退出浏览器')
							user.wuiModals = user.wuiModals.filter(item => item.id !== this.options.item.id)
							// 往Applist写入默认数据
							let active3 = this.stores.find(app => app.app_id === this.options.item.app_id)
							active.customData.list = active3.default.list
						}
					}
				})
				// 写入vuex
				this.$store.dispatch('setUserApi', user);
			},
			// 检索方法
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			// 检索过滤
			createFilter(queryString) {
				return (restaurant) => {
					return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			// 检索
			handleSelect(item) {
				this.homeValue = ''
				this.createTabApi({
					title: item.value,
					url: item.address,
					type: 'other',
				})
			},
			// 点击按钮搜索
			searchWebSize() {
				if (this.homeValue.indexOf('https://') == 0) {
					this.createTabApi({
						title: '新窗口栏',
						url: this.homeValue,
						type: 'other',
					})
					this.homeValue = ''
					this.$nextTick(() => {

					})
					// https://www.taobao.com

				} else if (this.homeValue.indexOf('http://') == 0) {
					// console.log(this.homeValue,'this.homeValue')
					this.$message.warning('只支持https://协议访问')
				} else {
					this.$message.warning('只支持域名访问')
				}
			},
			// 随机颜色
			getRandomColor() {
				return this.Web_api.getRandomColor()
			}
		}
	}
</script>

<style lang="less" scoped>
	.borwser {
		height: 100%;
	}

	.content {
		width: 100%;
		height: 100%;
		position: relative;
		.content_home_main {
			.content_home_main_webside {
				color: #7e7e7e;
				font-size: 20px;
				display: inline-block;
				padding: 10px 40px;
			}

			.content_home_main_webside:hover {
				cursor: pointer;
				text-decoration: underline;
			}
		}
		.tools {
			width: 100%;
			height: 40px;
			// position: absolute;
			// top: 0;
			.left ,.right{
				// width: 100px;
				i {
					margin: 0 10px;
					width: 20px;
					height: 20px;
					line-height: 20px;
					text-align: center;
					border-radius: 20px;
					cursor: pointer;
					
				}
				i:hover {
					background-color: #d0d0d0;
				}
			}
			.search {
				width: 70%;
				height: 30px;
				border-radius: 30px;
				background-color: #d0d0d0;
			}
			.right {
				flex: 1;
			}
		}
	}
</style>
