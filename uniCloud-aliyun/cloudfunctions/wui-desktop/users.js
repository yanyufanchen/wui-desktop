const baidu_faceAI = require('./api/baidu_faceAI.js')
const search = require('./api/search.js')
const errMes=require('./api/error.js')
// 生成随机字符串
function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

// 登录--
exports.login = async (db, event, context) => {
	const collection = db.collection('users')

	if (!event.type) {
		return {
			status: false,
			mes: '请选择登录类型'
		}
	}
	// 人脸检测登录
	if (event.type === 'face') {
		let baidu_faceAI_token = null
		// 从缓存中查找code值所携带数据
		let tokenRes = await baidu_faceAI.getAccessToken()
		// console.log(tokenRes, 'tokenRes----------')
		// 通过token和人脸信息进行搜索用户人脸信息
		// console.log(event, 'event')
		let faceSearchRes = await baidu_faceAI.faceSearch({
			image: event.image,
			AccessToken: tokenRes.AccessToken,
		})
		console.log(faceSearchRes.data.error_code, 'faceSearchRes')
		if (!faceSearchRes.status) {
			return {
				status: false,
				mes: '查询失败'
			}
		}
		
		if(faceSearchRes.data.error_code){
			let item=errMes.find(item=>faceSearchRes.data.error_code==item.code)
			return {
				status: true,
				faceFlag:false,
				mes: item?item.mes:'未匹配，请重试!'
			}
		}
		if(faceSearchRes.data.result.user_list.length===0){
			return {
				status: true,
				faceFlag:false,
				mes: '未查询到用户'
			}
		}
		const token = randomString(32)
		// 通过face_id查询用户
		let searchUserRes = await collection.where({
			faceData: {
				group_id: faceSearchRes.data.result.user_list[0].group_id,
				user_id: faceSearchRes.data.result.user_list[0].user_id
			}
		}).get()
		if (searchUserRes.affectedDocs < 1) {
			return {
				status: false,
				mes: '该用户未录入人脸信息'
			}
		}
		// console.log(res,'res')
		// 写入token
		let user = searchUserRes.data[0]
		var updateUserRes = await collection.doc(user._id).update({
			token
		})
		
		return {
			status: true,
			data: {
				// ...userObj,
				token
			},
			faceFlag:true,
			faceData: faceSearchRes.data,
			mes: '登录成功'
		}

	}
	// 账号密码登录
	if (event.type === 'account') {
		let res = await collection.where({
			username: event.username
		}).get()
		if (res.affectedDocs < 1) {
			return {
				status: false,
				mes: '账号或密码错误'
			}
		}
		let user = res.data[0]
		if (user.password !== event.password) {
			return {
				status: false,
				mes: '账号或密码错误'
			}
		}
	}

	const token = randomString(32)
	// 写入token
	var res = await collection.doc(user._id).update({
		token
	})
	// 过滤密码
	let {
		password,
		userObj
	} = user
	return {
		status: true,
		mes: '登录成功',
		data: {
			// ...userObj,
			token
		}
	}
}
exports.checkToken = async (db, event, context) => {
	
	const collection = db.collection('users')
	var res = await collection.where({
		token: event.token
	}).get()
	if (res.data.length == 0) {
		return {
			status: false,
			code: 401,
			mes: '验证token失败'
		}
	}
	if (res.data[0].type !== "use") {
		return {
			status: false,
			code: 501,
			mes: '该账户无法使用'
		}
	}
	return {
		status: true,
		code: 200,
		mes: '验证成功'
	}
}
// 新增账户
exports.addAccount = async (db, event, context) => {
	const collectionUsers = db.collection('users')
	const token = randomString(32)
	let params = {
		'username': event.data.username,
		'password': event.data.password,
		'creattime': new Date(),
		'status': '访客', // 访客,管理员
		'token': token,
		"type": event.data.type, // use 使用 waiting 审核 stop 禁用
		"comment": event.data.comment, // 备注
		'lowerMenu': [],
		'myappList': [],
		'systemData': null,
		'wuiModals': [],
		'faceData':null, // 百度人脸AI信息
	}
	// 查询系统数据
	const collectionStores = db.collection('systemStores')
	var systemStoresRes = await collectionStores.field({}).get()
	systemStoresRes.data.forEach(item => {
		if (item.type === "systemApp") {
			params.myappList.push({
				"app_id": item.app_id,
				"customData": null,
				"installtime": new Date(),
				"id": new Date().getTime(),
				"default": item.default
			})
		}
	})

	const collectionsystemData = db.collection('systemData')
	var systemDataRes = await collectionsystemData.field({}).get()
	params.systemData = {
		color: systemDataRes.data[0].color,
		wallpaper: systemDataRes.data[0].wallpaper,
		wallpapers: []
	}

	var res = await collectionUsers.add(params)
	return {
		status: true,
		mes: '新增成功'
	}
}
// 查询账户
exports.getAccountList = async (db, event, context) => {
	search.faceSearch()
	const collection = db.collection('users')
	var res = await collection.field({
		'token': false,
		'lowerMenu': false,
		'myappList': false,
		'shortcutList': false,
		'systemData': false,
		'wuiModals': false
	}).where({
		type: event.type
	}).get()

	return {
		status: true,
		mes: '查询成功',
		data: res.data
	}
}
// 查询账户详情
exports.getAccountDetail = async (db, event, context) => {
	const collection = db.collection('users')
	var res = await collection.field({
		'password': false,
		'token': false
	}).where({
		token: event.token
	}).get()

	return {
		status: true,
		mes: '查询成功',
		data: res.data
	}
}
// 验证账户--
exports.checkAccount = async (db, event, context) => {
	const collection = db.collection('users')
	var res = await collection.where({
		username: event.username
	}).get()
	var user = res.data[0]
	if (user.password !== event.password) {
		return {
			status: false,
			mes: '密码错误'
		}
	}
	return {
		status: true,
		mes: '验证成功',
		data: null
	}
}
// 修改账户
exports.updateAccount = async (db, event, context) => {
	const collection = db.collection('users')
	var res = await collection.where({
		token: event.token
	}).update(event.data)
	return {
		status: true,
		mes: '修改成功'
	}
}
// 通过id修改指定账户
exports.updateUser = async (db, event, context) => {
	const collection = db.collection('users')
	var res = await collection.where({
		_id: event._id
	}).update(event.data)
	return {
		status: true,
		mes: '修改成功'
	}
}
// 修改密码
exports.editPassword = async (db, event, context) => {
	const collection = db.collection('users')
	var res = await collection.where({
		token: event.token
	}).get()
	var user = res.data[0]
	if (user.password !== event.data.password) {
		return {
			status: false,
			mes: '原密码错误'
		}
	}
	var res = await collection.where({
		token: event.token
	}).update({
		password: event.data.newPassword
	})
	return {
		status: true,
		mes: '修改成功'
	}
}
// 删除账户
exports.removeAccount = async (db, event, context) => {
	const collection = db.collection('users')
	var res = await collection.doc(event._id).remove()

	return {
		status: true,
		mes: '删除成功'
	}
}
