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
	var res = await collection.where({
		username: event.username
	}).get()
	if (res.affectedDocs < 1) {
		return {
			status: false,
			mes: '账号或密码错误'
		}
	}
	var user = res.data[0]

	if (user.password !== event.password) {
		return {
			status: false,
			mes: '账号或密码错误'
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
			mes: '验证失败'
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
	const collection = db.collection('users')
	const token = randomString(32)
	var res = await collection.add({
		'username': event.data.username,
		'password': event.data.password,
		'creattime': new Date(),
		'status': '访客', // 访客，管理员
		'token': token,
		'lowerMenu': [],
		'myappList': [],
		'shortcutList': [],
		'systemData': {
			"color": "#14173a", // 主题颜色
			"wallpapers": [], // 壁纸库
			"wallpaper": 1 // 壁纸序号
		},
		'wuiModals': []
	})
	return {
		status: true,
		mes: '新增成功'
	}
}
// 查询账户
exports.getAccountList = async (db, event, context) => {
	const collection = db.collection('users')
	var res = await collection.field({
		'token': false,
		'lowerMenu': false,
		'myappList': false,
		'shortcutList': false,
		'systemData': false,
		'wuiModals': false
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
	var res = await collection.doc(event.id).remove()

	return {
		status: true,
		mes: '删除成功'
	}
}
