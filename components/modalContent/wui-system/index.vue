<template>
	<div class="system flex XleftYcenter">
		<div class="tabs ">
			<div class="tabsHeader">
				<i class="fa fa-lg" :class="stores.find(item=>item.app_id==options.item.app_id).icon"></i>
				<span>系统设置</span>
			</div>
			<div class="tabsList">
				<div class="tabItem flex XleftYcenter" v-for="(item,index) in tabsList" :key="item.id"
					@click="selectTab(index)">
					<div class="tabItem_box flex XleftYcenter" v-if="['应用设置','用户设置'].findIndex(item2=>item.name===item2)>-1&&user.status==='管理员'">
						<div class="line" style="margin-right:10px" :style="{'background':activeIndex===index?user.systemData.color:''}" ></div>
						<div class="box">
							<i class="fa fa-lg" :class="item.icon" style="margin-right:10px" ></i>
							<span >{{item.name}}</span>
						</div>
					</div>
					<div class="tabItem_box flex XleftYcenter" v-else-if="['应用设置','用户设置'].findIndex(item2=>item.name===item2)==-1">
						<div class="line" style="margin-right:10px" :style="{'background':activeIndex===index?user.systemData.color:''}" ></div>
						<div class="box">
							<i class="fa fa-lg" :class="item.icon" style="margin-right:10px" ></i>
							<span >{{item.name}}</span>
						</div>
					</div>
				</div>
			</div>

		</div>
		<div class="content">
			<div class="header">{{tabsList[activeIndex].name}}</div>
			<!-- 主页 -->
			<div class="contentBox" v-if="tabsList[activeIndex].id===1">
				<div class="contentBoxItem">
					<div class="title">系统主题色</div>
					<el-color-picker :value="systems.color" @active-change="setSystem($event,'color')" show-alpha
						:predefine="predefineColors">
					</el-color-picker>
				</div>
				<div class="contentBoxItem">
					<div class="title">系统壁纸</div>
					<wallpaper type="system" @addWallpaper="setSystem($event,'addWallpaper')"
						@selectWallpaper="setSystem($event,'selectWallpaper')" />
				</div>
				<!-- <div class="contentBoxItem">
					<div class="title">最大窗口数</div>
					<el-select  placeholder="请选择最大窗口数">
						<el-option label="6" value="6"></el-option>
						<el-option label="9" value="9"></el-option>
						<el-option label="12" value="12"></el-option>
					</el-select>
				</div> -->

			</div>
			<!-- 应用设置 -->
			<div class="contentBox" v-else-if="tabsList[activeIndex].id===2" >
				<div class="contentBoxItem">
					<applylist />
				</div>
			</div>
			<!-- 用户设置 -->
			<div class="contentBox" v-else-if="tabsList[activeIndex].id===3">
				<div class="contentBoxItem">
					<div class="title">用户列表</div>
					<userlist />
				</div>
			</div>
			<!-- 个人设置 -->
			<div class="contentBox" v-else-if="tabsList[activeIndex].id===4">
				<div class="contentBoxItem">
					<div class="title">个人账号</div>
					<el-input style="width:300px;margin-right:5px" :value="user.username"
						@input="selectUserSystem($event,'username')" placeholder="请输入个人账号"></el-input>
				</div>
				<div class="contentBoxItem">
					<div class="title">个人密码</div>
					<el-button @click="editPasswordVisible=true">修改密码</el-button>
					<el-dialog title="修改密码" :visible.sync="editPasswordVisible" width="40%">
						<el-form :model="userfrom" :rules="userRules" ref="userfrom" label-width="100px">
							<el-form-item label="原密码" prop="password">
								<el-input style="width:100%;margin-bottom:5px" v-model="userfrom.password"
									placeholder="请输入原密码"></el-input>
							</el-form-item>
							<el-form-item label="新密码" prop="newPassword">
								<el-input style="width:100%;margin-bottom:5px" v-model="userfrom.newPassword"
									placeholder="请输入新密码"></el-input>
							</el-form-item>
							<el-form-item label="再次新密码" prop="newPasswordtwo">
								<el-input style="width:100%;margin-bottom:5px" v-model="userfrom.newPasswordtwo"
									placeholder="再次输入新密码"></el-input>
							</el-form-item>
						</el-form>
						<span slot="footer" class="dialog-footer">
							<el-button @click="()=>{
							editPasswordVisible = false
							userfrom.password=''
							userfrom.newPassword=''
							userfrom.newPasswordtwo=''
						}">取 消</el-button>
							<el-button type="primary" @click="selectUserSystem($event,'password')">确 定</el-button>
						</span>
					</el-dialog>
				</div>
				<div class="contentBoxItem">
					<div class="title">个人主题色</div>
					<el-color-picker :value="user.systemData.color" @active-change="selectUserSystem($event,'color')" show-alpha
						:predefine="predefineColors">
					</el-color-picker>
				</div>
				<div class="contentBoxItem">
					<div class="title">个人壁纸</div>
					<wallpaper type="user" @addWallpaper="selectUserSystem($event,'addWallpaper')"
						@selectWallpaper="selectUserSystem($event,'selectWallpaper')" />
				</div>
			</div>
			<!-- 其他 -->
			<div class="contentBox" v-if="tabsList[activeIndex].id===5">
				<otherview />
			</div>
			<!-- 关于 -->
			<div class="contentBox" v-if="tabsList[activeIndex].id===6">
				<about />
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import wallpaper from './wallpaper/wallpaper.vue'
	import userlist from './userlist/userlist.vue'
	import applylist from './applylist/applylist.vue'
	import about from './about/about.vue'
	import otherview from './otherview/otherview.vue'
	export default {
		name: 'wui-system',
		props: {
			options: {}
		},
		data() {
			return {
				tabsList: [{
						id: 1,
						icon: 'fa-home',
						name: '主页',
						type:'system-home'
					},
					{
						id: 2,
						icon: 'fa-tasks',
						name: '应用设置',
						type:'system-apply'
					},
					{
						id: 3,
						icon: 'fa-user',
						name: '用户设置',
						type:'system-user'
					},
					{
						id: 4,
						icon: 'fa-address-card-o',
						name: '个人设置',
						type:'system-me'
					},
					{
						id: 5,
						icon: 'fa-pencil',
						name: '其他',
						type:'system-other'
					},
					{
						id: 6,
						icon: 'fa-info-circle',
						name: '关于',
						type:'system-about'
					},
				],
				activeIndex: 0,
				// 主题色
				predefineColors: [
					'rgba(21, 24, 61, 1)',
					'#ff4500',
					'#ff8c00',
					'#ffd700',
					'#90ee90',
					'#00ced1',
					'#1e90ff',
					'#c71585',
					'rgba(255, 69, 0, 0.68)',
					'rgb(255, 120, 0)',
					'hsv(51, 100, 98)',
					'hsva(120, 40, 94, 0.5)',
					'hsl(181, 100%, 37%)',
					'hsla(209, 100%, 56%, 0.73)',
					'#c7158577'
				],
				// 个人设置
				editPasswordVisible: false, // 修改密码弹窗
				userfrom: {
					password: '',
					newPassword: '',
					newPasswordtwo: '',
				},
				userRules: {
					password: [{
							required: true,
							message: '请输入原密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '长度在 6 到 12 个字符',
							trigger: 'blur'
						}
					],
					newPassword: [{
							required: true,
							message: '请输入新密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '长度在 6 到 12 个字符',
							trigger: 'blur'
						}
					],
					newPasswordtwo: [{
							required: true,
							message: '请再次输入新密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '长度在 6 到 12 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		components: {
			wallpaper,
			userlist,
			applylist,
			otherview,
			about
		},
		computed: {
			...mapState(['stores', 'systems', 'user'])
		},
		watch:{
			options(newV,oldV){ // 监听其他组件超控tab切换
				if(newV.item.data.type!==oldV.item.data.type){
					this.activeIndex=this.tabsList.findIndex(item=>item.type===newV.item.data.type)
				}
			}
		},
		async created() {
			
		},
		beforeUpdate() {
			
		},
		mounted() {

		},
		methods: {
			selectTab(index) {
				this.activeIndex = index
			},
			// 设置系统
			setSystem(e, type) {
				let systems = this.Web_api.clone(this.systems)
				if (type === 'color') {
					systems.color = e
					// 写入vuex
					this.$store.dispatch('setSystemApi', systems);
				}
				if (type === 'addWallpaper') {
					if (!e) {
						this.$message.warning('地址不能为空')
						return
					}
					systems.wallpapers.push({
						id: new Date().getTime(),
						url: String(e)
					})
					// 写入vuex
					this.$store.dispatch('setSystemApi', systems);
				}
				if (type === 'selectWallpaper') {
					systems.wallpaper = e
					// 写入vuex
					this.$store.dispatch('setSystemApi', systems);
				}
			},
			// 设置个人信息
			async selectUserSystem(e, type) {
				let user = this.Web_api.clone(this.user)
				if (type === 'username') {
					user.username = e
					// // 写入vuex
					this.$store.dispatch('setUserApi', user);
					return
				}
				if (type === 'password') {
					if (this.userfrom.newPassword !== this.userfrom.newPasswordtwo) {
						this.$message.error('两次输入密码不一致')
						return
					}
					const res = await this.Api.sendUniCloud({
						model: 'editPassword',
						event: {
							token: uni.getStorageSync('token'),
							data: {
								password: this.userfrom.password,
								newPassword: this.userfrom.newPassword
							}
						}
					});
					if (!res.status) {
						this.$message.error('修改密码失败')
					}
					this.$message.success('修改密码成功')
					this.editPasswordVisible = false
					return
				}
				if (type === 'color') {
					user.systemData.color = e
					// 写入vuex
					this.$store.dispatch('setUserApi', user);
					return
				}
				if (type === 'addWallpaper') {
					if (!e) {
						this.$message.warning('地址不能为空')
						return
					}
					user.systemData.wallpapers.push({
						id: new Date().getTime(),
						url: String(e)
					})
					// 写入vuex
					this.$store.dispatch('setUserApi', user);
				}
				if (type === 'selectWallpaper') {
					user.systemData.wallpaper = e
					// 写入vuex
					this.$store.dispatch('setUserApi', user);
				}

			},


		}
	}
</script>

<style lang="less" scoped>
	.system {
		width: 100%;
		height: 100%;

		.tabs {
			width: 200px;
			height: 100%;

			// background-color: #333;
			.tabsHeader {
				line-height: 60px;
				font-size: 25px;
				color: #333;
			}

			.tabsList {
				width: 100%;

				.tabItem {
					width: 100%;
					cursor: pointer;

					.line {
						width: 5px;
						height: 40px;
						background-color: #ffffff00;
					}

					.lineActive {
						// background-color: #007AFF;
					}

					.box {
						line-height: 50px;
						font-size: 15px;
						padding-left: 10px;
					}

				}

				.tabItem:hover {
					background-color: #e2e2e2;
				}
			}
		}

		.content {
			flex: 1;
			height: 100%;
			background-color: #f4f3f3;
			padding-left: 15px;

			.header {
				width: 100%;
				line-height: 50px;
				font-size: 20px;
				color: #333;
			}

			.contentBox {
				overflow-y: auto;
				height: calc(100% - 50px);

				.contentBoxItem {
					.title {
						font-weight: 550;
						line-height: 30px;
					}
				}
			}
		}
	}
</style>
