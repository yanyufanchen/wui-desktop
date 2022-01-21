<template>
	<div class="appStore">
		<div class="box flex XleftYcenter">
			<div class="Tabs flex YcenterXcenter">
				<div class="storeTabs flex YtopXcenter">
					<div class="applyBtn tabIcon" :class="activeTab==='applyBtn'?'activeIcon':''"
						@click="tabselect('applyBtn')">应用</div>
				</div>
				<div class="userTabs flex YcenterXcenter">
					<div class="myBtn tabIcon" style="margin-bottom:5px" :class="activeTab==='myBtn'?'activeIcon':''"
						@click="tabselect('myBtn')">我的</div>
					<div class="helpBtn tabIcon" :class="activeTab==='helpBtn'?'activeIcon':''"
						@click="tabselect('helpBtn')">帮助</div>
				</div>
			</div>
			<div class="content">
				<div class="storeList contentItem" v-if="activeTab==='applyBtn'">
					<div class="header">系统应用</div>
					<div class="content_main">
						<el-row :gutter="20">
							<el-col :span="4" v-for="item in stores" :key="item.app_id">
								<div class="content_item_box  flex YtopXcenter" style="margin-bottom:10px"
									:style="{'backgroundColor':item.backgroundColor}">
									<div class="content_item_box_icon"><i :class="item.icon"></i></div>
									<div class="content_item_box_title">{{item.title}}</div>
									<div class="content_item_box_btn">
										<span v-if="user.myappList.find(item2=>item2.app_id===item.app_id)">已安装</span>
										<span class="appBtn" v-else @click="installApp(item)">安装</span>
									</div>
								</div>

							</el-col>
						</el-row>
					</div>
				</div>
				<div class="mystoreList contentItem" v-else-if="activeTab==='myBtn'">
					<div class="header">我的应用</div>
					<div class="content_main">
						<el-row :gutter="20">
							<el-col :span="24" v-for="item in user.myappList" :key="item.app_id">
								<div class="content_item_box flex XleftYcenter" style="padding:10px;margin-bottom:10px"
									:style="{'backgroundColor':getActiveApp(item.app_id).backgroundColor}">
									<div class="content_item_box_icon"
										style="padding: 10px;background:#fff;border-radius:5px;margin-right:5px"><i
											:class="getActiveApp(item.app_id).icon"></i></div>
									<div class="content_item_box_message flex XleftYcenter" style="flex:1;height:100%">
										<div class="content_item_box_title"
											style="flex:1;height:100%;margin-right:40px">
											<span
												style="font-size: 15px;font-weight: 550;color: #333;">{{getActiveApp(item.app_id).title}}</span>
											<p class="p_hide" style="color: #333;">{{getActiveApp(item.app_id).description}}</p>
										</div>
										<div class="content_item_box_time" style="padding:0 10px">{{Time.formatTime(item.installtime,'Y-M-D')}}</div>
									</div>
									<div class="content_item_box_btn">
										<span v-if="getActiveApp(item.app_id).type==='systemApp'">卸载</span>
										<span v-else class="appBtn" @click="uninstall(item)">卸载</span>
									</div>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
				<div class="help contentItem" v-else-if="activeTab==='helpBtn'">
					<div class="header">帮助</div>
					<div class="content_main">
						正在开发中……
					</div>
				</div>
			</div>
		</div>
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
		name: 'appStore',
		props: {
			options: {}
		},
		data() {
			return {
				activeTab: 'applyBtn'
			}
		},
		computed: {
			...mapState(['stores', 'user'])
		},
		created() {

		},
		mounted() {

		},
		methods: {
			tabselect(type) {
				this.activeTab = type
			},
			// 获取当前应用信息
			getActiveApp(app_id) {
				return this.stores.find(item => item.app_id === app_id)
			},
			// 安装App
			installApp(item) {
				this.$confirm('确定要安装该应用吗?', item.title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 将该应用数据写入user的应用列表
					let user = this.Web_api.clone(this.user)
					user.myappList.push({
						app_id: item.app_id,
						data: item.default,
						id: user.myappList[user.myappList.length - 1].id + 1,
						installtime:new Date()

					})
					this.$store.commit('updateUser', user);
				}).catch(() => {});
			},
			// 卸载app
			uninstall(item) {
				this.$confirm('确定要卸载该应用吗?', this.getActiveApp(item.app_id).title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 将该应用数据写入user的应用列表
					let user = this.Web_api.clone(this.user)
					user.myappList = user.myappList.filter(item2 => item2.app_id !== item.app_id)
					this.$store.commit('updateUser', user);
				}).catch(() => {});
			}

		}
	}
</script>

<style lang="less" scoped>
	.appStore {
		width: 100%;
		height: 100%;

		.box {
			width: 100%;
			height: 100%;

			.Tabs {
				width: 50px;
				height: 100%;
				border-right: 1px solid #ddd;

				.storeTabs {
					flex: 1;
					width: 100%;
					// background-color: pink;
				}

				.userTabs {
					width: 100%;
					height: 100px;
					// background-color: #ccc;
				}

				.tabIcon {
					width: 42px;
					height: 42px;
					line-height: 42px;
					text-align: center;
					border: 1px solid #ddd;
					border-radius: 10px;
					cursor: pointer;
				}

				.tabIcon:hover {
					background: #409eff78;
					border: 1px solid #409eff;
				}

				.activeIcon {
					background: #409eff78;
					border: 1px solid #409eff;
				}
			}

			.content {
				width: 100%;
				height: 100%;
				overflow: hidden;

				.contentItem {
					height: 100%;

					.header {
						width: 100%;
						height: 40px;
						line-height: 40px;
						padding-left: 10px;
						font-size: 16px;
						border-bottom: 2px solid #007AFF;
					}

					.content_main {
						box-sizing: border-box;
						height: 100%;
						padding: 0 20px;
						padding-top: 10px;
						overflow-y: auto;
						padding-bottom: 40px;
						.content_item_box:hover {
							background-color: #409eff36 !important;
							border: 1px solid #409effb3 !important;
							cursor: pointer;
						}

						.content_item_box {
							border: 1px solid #ddd;
							padding: 10px 0;

							.content_item_box_icon {
								font-size: 50px;
								color: #333;
							}

							.content_item_box_title {
								font-size: 14px;
								line-height: 30px;
								color: #111;
							}

							.content_item_box_btn {
								span {
									display: inline-block;
									cursor: pointer;
									color: #fff;
									line-height: 20px;
									padding: 0 10px;
									border: 1px;
									background-color: #bebbbc;
								}

								.appBtn {
									background-color: #007AFF;
								}

								.appBtn:hover {
									background-color: #55ffff;
								}
							}
						}
					}
				}
			}
		}

		.title,
		.el-progress,
		.text {
			display: none;
		}
	}
</style>
