// 查询系统设置
exports.getSystemData = async (db, event, context) => {
	const collection = db.collection('systemData')
	var res = await collection.get()
	
	return {
		status: true,
		mes: '查询成功',
		data: res.data
	}
}

// 修改系统设置
exports.updateSystemData = async (db, event, context) => {
	const collection = db.collection('systemData')
	var res = await collection.where({
		_id: event._id
	}).update(event.data)
	console.log(event,'event')
	console.log(res,'res')
	return {
		status: true,
		mes: '修改成功'
	}
}