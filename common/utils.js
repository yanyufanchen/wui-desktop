export default class Utils {
	// 获取路由跳转传参
	static getRouteData() {
		let path = window.location.hash
		let dataArr = path.split('?')[1].split('&')
		if (dataArr.length == 0) return {}
		let dataObj = {}
		dataArr.forEach(item => {
			dataObj[item.split('=')[0]] = item.split('=')[1]
		})
		return dataObj
	}

	static GetUrlByParamName(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var URL = decodeURI(window.location.href.split('?'));
		var r = URL.substr(1).match(reg);
		if (r != null) {
			//decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码
			return decodeURI(r[2]);
		};
		return null;
	}

	// 当前日期
	static todayDate() {
		let dt, y, m, d, w
		dt = new Date()
		y = dt.getFullYear()
		m = dt.getMonth() + 1
		d = dt.getDate()
		w = dt.getDay()
		let weeks = ['天', '一', '二', '三', '四', '五', '六']
		return `${y} 年 ${m.toString().padStart(2, '0')} 月 ${d.toString().padStart(2, '0')} 日 星期${weeks[w]}`
	}

	// 浏览器全屏
	static fullScreen() {
		let isFull = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen

		// 判断是否全屏
		if (isFull) {
			let close = document.exitFullscreen || document.webkitCancelFullScreen || document
				.mozCancelFullScreen || document.msExitFullscreen
			close && close.call(document)
		} else {
			let docElm = document.documentElement
			let open = docElm.requestFullScreen || docElm.webkitRequestFullScreen || docElm.mozRequestFullScreen ||
				docElm.msRequestFullscreen
			open && open.call(docElm)
		}
	}
	// 在页面生命周期执行,可以得到全局app加载完成后的状态(防止全局未加载完就提前执行了生命周期内的方法)
	// this.Utils.getAppCallbackFlag(this.AppFlag)
	static getAppCallbackFlag(app) {
		return new Promise((resolve, reject) => {
			if (!app) {
				getApp().globalData.AppCallback = async (flag) => {
					resolve(flag)
				}
			}

		})
	}
	// 隐藏当前弹窗
	static setModalHide(that, active) {
		// 设置当前弹窗显影
		let user = that.Web_api.clone(that.user)
		let maxIndex = that.Web_api.getArrMaxValue(user.wuiModals, 'zIndex') + 1
		user.wuiModals.forEach(item => {
			if (item.id === active.id) {
				item.show_flag = !item.show_flag
			}
		})
		let newwuiModals = user.wuiModals.filter(item => item.show_flag === true)
		// 折叠的是最后一个 就让第一个高亮
		if (newwuiModals.length == 0) {
			that.$store.dispatch('setUserApi', user)
			return
		}
		if (user.wuiModals[user.wuiModals.length - 1].id === active.id) {
			newwuiModals[0].zIndex = maxIndex
		} else {
			newwuiModals[newwuiModals.length - 1].zIndex = maxIndex
		}
		that.$store.dispatch('setUserApi', user)
	}
	// 置顶当前弹窗
	static setModalTop(that, active, defaultObj) {
		let user = that.Web_api.clone(that.user)
		let maxIndex = that.Web_api.getArrMaxValue(user.wuiModals, 'zIndex') + 1
		user.wuiModals.forEach(item => {
			if (item.id === active.id) {
				item.zIndex = maxIndex + 1
				item.show_flag = true
				if (defaultObj) {
					item.data = defaultObj.data
				}
			}
		})
		// 写入vuex
		that.$store.dispatch('setUserApi', user)
	}
	static openModal(that, active, defaultObj) {
		// 检索是否有该应用 有(显示) 无(添加)
		let user = that.Web_api.clone(that.$store.state.user)
		let activeApp = user.wuiModals.find(item => item.app_id == active.app_id)
		if (activeApp) {
			// 置顶显示
			that.Utils.setModalTop(that, activeApp, defaultObj)

		} else {
			user.wuiModals.push({
				id: that.Web_api.getArrMaxValue(user.wuiModals, 'id') + 1,
				app_id: active.app_id,
				show_flag: true,
				zIndex: that.Web_api.getArrMaxValue(user.wuiModals, 'zIndex') + 1,
				data: defaultObj.data ? defaultObj.data : {}
			})
			that.$store.dispatch('setUserApi', user)
		}
	}
}
