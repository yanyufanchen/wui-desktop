<template>
	<div class="borwser">
		<el-tabs v-model="editableTabsValue" type="border-card" :editable="true" @tab-click="selectTab"
			@tab-remove="removeTab" @tab-add="addTab">
			<el-tab-pane v-for="(item, index) in user.myappList.find(app=>app.app_id===options.item.app_id).data.list"
				:key="index" :label="item.name" :name="item.name">
				<div class="content">
					<div class="content_home" v-if="item.type=='home'">
						<div class="content_home_header" style="padding: 50px 100px;">
							<el-autocomplete class="inline-input" v-model="homeValue" :fetch-suggestions="querySearch"
								placeholder="请输入内容/网址" :trigger-on-focus="false" @select="handleSelect"
								style="width:100%;height:40px;box-shadow: 3px 5px 20px 4px #66b1ff2b;">
							</el-autocomplete>
						</div>
						<div class="content_home_main" style="padding: 30px 100px;">
							<span :style="{color:getRandomColor()}" class="content_home_main_webside" v-for="(websize,index3) in loadWebsides"
								:key="index3">{{websize.value}}</span>
						</div>
					</div>
					<iframe ref="iframe" v-show="item.type!=='home'" target="_top" src="./static/browserHtml/home.html"
						frameborder="0" scrolling='auto' style="width:100%;height:100%;"></iframe>
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
				homeValue: '', // home页输入
				restaurants: [], // home页selectlist值
				loadWebsides: []
			}
		},
		computed: {
			...mapState(['user'])
		},
		created() {
			let list = this.user.myappList.find(app => app.app_id === this.options.item.app_id).data.list
			if (list && list.length > 0) {
				this.editableTabsValue = `${list.find(item=>item.show).name}`
			}

		},
		mounted() {
			const {
				iframe
			} = this.$refs;
			iframe.forEach(item => {
				item.contentWindow.location.replace(item.src);
			})
			// home建议
			this.restaurants = loadAll();
			this.loadWebsides = loadWebside();
		},
		methods: {
			selectTab(targetName) {
				// 从我的应用取值
				let user = this.Web_api.clone(this.user)
				let active = ''
				user.myappList.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						active = user.myappList.find(app => app.app_id === item.app_id)
						active.data.list.forEach(item2 => item2.show = false)
						active.data.list.forEach(item2 => {
							if (item2.name === targetName.label) {
								item2.show = true
							}
						})
					}
				})
				// 写入vuex
				this.$store.commit('updateUser', user);
			},
			addTab(targetName) {
				let user = this.Web_api.clone(this.user)
				let active = ''
				let name = ''
				user.wuiModals.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						active = user.myappList.find(app => app.app_id === item.app_id)
						active.data.list.forEach(item2 => item2.show = false)
						name = `新标签页-主页_${active.data.list.length+1}`
						active.data.list.push({
							id: active.data.list.length + 1,
							name: name,
							url: './static/browserHtml/home.html',
							type: 'home',
							show: true,
						})
					}
				})
				this.editableTabsValue = name;
				console.log(this.editableTabsValue, 'this.editableTabsValue')

				// 写入vuex
				this.$store.dispatch('setUserApi', user);
			},
			removeTab(targetName) {
				let user = this.Web_api.clone(this.user)
				user.wuiModals.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						let active = user.myappList.find(app => app.app_id === item.app_id)

						active.data.list = active.data.list.filter(item2 => `${item2.name}` !== targetName)
						active.data.list.forEach((item2, index2) => {
							item2.show = false
							// console.log()
							if (index2 === active.data.list.length - 1) {
								item2.show = true
								this.editableTabsValue = `${item2.name}`;
							}
						})
						if (active.data.list.length == 0) { // 需要退出浏览器
							console.log('需要退出浏览器')
						}
					}
				})
				// 写入vuex
				this.$store.dispatch('setUserApi', user);
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (restaurant) => {
					return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			handleSelect(item) {
				console.log(item);
			},
			getRandomColor(){
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
	}
</style>
