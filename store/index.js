import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let user = uni.getStorageSync('user') || {}
const store = new Vuex.Store({
	state: {
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
		login(state, user) { // 登录状态存全局
			state.user = user
			// console.log(user,'user')
			uni.setStorageSync('user', user)
		},
		// 设置用户
		setUser(state, user) { //重新加载初始化登录状态
			state.user = user
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
		// 系统设置信息
		setSystem(state,systems){
			state.systems = systems
		},
		// 设置桌面数据
		setDesktop(state,desktops){
			state.desktops = desktops
		},
		// 设置应用商店数据
		setStore(state,stores){
			state.stores = stores
		},
		
		
		
		
		
		
		
		
		
		changeCollapse(state) {
			state.isCollapse = !state.isCollapse
		},
		// 编辑后台在线主题色
		editThemeColor(state,color){
			state.themeColor=color
			// console.log(state.themeColor);
		},
		editArticle(state,centent){ // 编辑存储文章信息
			state.articleObj=centent
			// console.log(state.articleObj);
		},
		editlog(state,centent){ // 编辑日志
			state.logObj=centent
		},
		// 编辑前台主题色
		editTheme(state,Desktheme){
			state.Desktheme=Desktheme
			// console.log(state.Desktheme);
		},
		editHeaderBgimg(state,Bgimg){
			// console.log(Bgimg,'vuex-背景图')
			state.headerBgimg=Bgimg
		},
		// 保存网站访问信息
		saveWebCount(state,count){
			state.count=count
		},
		// 保存我的基本信息
		savemymessage(state,mymessage){
			state.mymessage=mymessage
		}
	}
})

export default store
