'use strict';
const db = uniCloud.database()
// 模块方法
let users = require('./users.js') // 用户
let systemData = require('./systemData.js') // 系统设置
let systemStores = require('./systemStores.js') // 系统应用商店
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// users
	if (event.model == 'login') { // 登录-
		return await users.login(db, event.event, context)
	}
	if (event.model == 'checkAccount') { // 锁定 验证
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await users.checkAccount(db, event.event, context)
	}
	if (event.model == 'getAccountDetail') { // 查询用户信息
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await users.getAccountDetail(db, event.event, context)
	}
	if (event.model == 'updateAccount') { // 修改用户信息
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await users.updateAccount(db, event.event, context)
	}
	// 系统设置
	if (event.model == 'getSystemData') { // 查询系统设置
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemData.getSystemData(db, event.event, context)
	}
	// 系统应用商店
	if (event.model == 'getSystemStores') { // 查询系统应用商店
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemStores.getSystemStores(db, event.event, context)
	}
	// 通用方法

	if (event.model == 'deleteFileCloud') { // 删除云存储文件
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		const result = await uniCloud.deleteFile({
			fileList: [
				event.event.fileUrl // 阿里云fileID是url形式，例：https://xxx.com/xxx.png
			]
		});
		return {
			status: result[0].success,
			mes: result[0].success ? '删除成功' : '删除失败',
		}
	}
	//返回数据给客户端
	// return event
};
