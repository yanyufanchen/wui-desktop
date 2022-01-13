import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let user = uni.getStorageSync('user') || {}
const store = new Vuex.Store({
	state: {
		token:'',
		user: {}, // 登录状态
		locking:false, // 锁定状态
		
		
		systems:{},// 系统设置
		desktops:{}, // 桌面
		stores:{}, // 应用商店
		
		
		isCollapse: false ,// 菜单栏状态
		themeColor: '#409EFF', // 后台element默认主题色
		articleObj: {}, // 当前编辑的文章
		logObj: {}, // 当前编辑的日志
		Desktheme: {
			ThemeColor: '#409EFF'
		}, // 前台element默认主题色
		sTitle: '基于uniCloud云开发平台而生的全栈博客项目',
		headerBgimg: '',
		count: '', // 网站访问量
		mymessage:'' // 我的基本信息
	},
	mutations: {
		// 登录
		login(state, data) { // 登录状态存全局
			state.token = data.token
			uni.setStorageSync('token', data.token)
		},
		// 更新用户信息
		async updateUser(state, data){
			state.user=data
		},
		
		// 退出
		logout(state) { // 退出清理登录状态
			state.user = {}
			uni.removeStorageSync('user')
		},
		// 锁定/解除锁定
		locking(state,flag) {
			state.locking = flag
			uni.setStorageSync('locking', flag)
		},
		// 更新系统设置信息
		updateSystem(state,systems){
			state.systems = systems
		},
		// 更新应用商店数据
		updateStore(state,stores){
			state.stores = stores
		},
		

	},
	actions:{
		// 查询用户信息
		async getUserApi({ commit }){
			const res = await this._vm.Api.sendUniCloud(this._vm, {
				model: 'getAccountDetail',
				event: {
					token:uni.getStorageSync('token')
				}
			});
			if(!res.status){
				this._vm.$message.error('或许用户信息失败')
				return
			}
			if(res.data.length==0){
				this._vm.$message.error('该用户不存在或token无效')
				// 前往登录页面
				uni.redirectTo({
					url: "/pages/home/login"
				});
				return
			}
			commit('updateUser', res.data[0], { root: true }) // 重点
		},
		// 更新用户信息
		async setUserApi({ commit },data){
			commit('updateUser', data, { root: true })
			// 更新服务器
			const res = await this._vm.Api.sendUniCloud(this._vm, {
				model: 'updateAccount',
				event: {
					token:uni.getStorageSync('token'),
					data:{
						lowerMenu:data.lowerMenu, // 桌面左下角菜单
						myappList:data.myappList, // 我的应用
						wuiModals:data.wuiModals, // 桌面弹窗
						systemData:data.systemData, // 自定义系统设置
					}
				}
			});
		},
		
		// 查询系统设置信息
		async getSystemApi({ commit }){
			const res = await this._vm.Api.sendUniCloud(this._vm, {
				model: 'getSystemData',
				event: {
					token:uni.getStorageSync('token')
				}
			});
			if(!res.status){
				this._vm.$message.error('查询系统失败')
				return
			}
			// 将用户系统信息和系统信息合并
			let system=res.data[0]
			system.color=this.state.user.systemData.color
			system.wallpaper=this.state.user.systemData.wallpaper
			system.wallpapers=[...system.wallpapers,...this.state.user.systemData.wallpapers]
			commit('updateSystem', system, { root: true }) // 重点
		},
		// 查询应用商店
		async getStoreApi({ commit }){
			const res = await this._vm.Api.sendUniCloud(this._vm, {
				model: 'getSystemStores',
				event: {
					token:uni.getStorageSync('token')
				}
			});
			if(!res.status){
				this._vm.$message.error('查询应用商店失败')
				return
			}
			commit('updateStore', res.data, { root: true }) // 重点
		},
	}
})

export default store
