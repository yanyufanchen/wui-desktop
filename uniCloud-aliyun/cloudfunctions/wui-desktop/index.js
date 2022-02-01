'use strict';
const db = uniCloud.database()
// 模块方法
let users = require('./users.js') // 用户
let systemData = require('./systemData.js') // 系统设置
let systemStores = require('./systemStores.js') // 系统应用商店
let feedbacks = require('./feedbacks.js') // 系统反馈建议
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
	if (event.model == 'addAccount') { // 新增用户
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await users.addAccount(db, event.event, context)
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
	if (event.model == 'updateUser') { // 通过id修改指定用户
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await users.updateUser(db, event.event, context)
	}
	if (event.model == 'editPassword') { // 修改用户密码
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await users.editPassword(db, event.event, context)
	}
	if (event.model == 'getAccountList') { // 查询用户列表
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await users.getAccountList(db, event.event, context)
	}
	// 系统设置
	if (event.model == 'getSystemData') { // 查询系统设置
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemData.getSystemData(db, event.event, context)
	}
	if (event.model == 'updateSystemData') { // 更新系统设置
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemData.updateSystemData(db, event.event, context)
	}
	// 系统应用商店
	if (event.model == 'getSystemStores') { // 查询系统应用商店
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemStores.getSystemStores(db, event.event, context)
	}
	if (event.model == 'addSystemStores') { // 新增应用
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemStores.addSystemStores(db, event.event, context)
	}
	if (event.model == 'updateSystemStores') { // 修改应用
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemStores.updateSystemStores(db, event.event, context)
	}
	if (event.model == 'deleteSystemStores') { // 删除应用
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await systemStores.deleteSystemStores(db, event.event, context)
	}
	// 系统反馈建议
	if (event.model == 'getFeedbacks') { // 查询系统反馈建议
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await feedbacks.getFeedbacks(db, event.event, context)
	}
	if (event.model == 'addFeedbacks') { // 添加系统反馈建议
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await feedbacks.addFeedbacks(db, event.event, context)
	}
	if (event.model == 'updateFeedbacks') { // 修改系统反馈建议
		let checkToken = await users.checkToken(db, event.event, context)
		if (!checkToken.status) {
			return checkToken
		}
		return await feedbacks.updateFeedbacks(db, event.event, context)
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
