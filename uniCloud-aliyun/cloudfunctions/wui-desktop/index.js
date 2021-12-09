'use strict';
const db = uniCloud.database()
// 模块方法
let login = require('./login.js')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	if (event.model == 'login') { // 登录-
		return await login.login(db, event.event, context)
	}
	//返回数据给客户端
	// return event
};
