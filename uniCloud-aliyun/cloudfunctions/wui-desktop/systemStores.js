// 查询系统设置
exports.getSystemStores = async (db, event, context) => {
	const collection = db.collection('systemStores')
	var res = await collection.get()
	
	return {
		status: true,
		mes: '查询成功',
		data: res.data
	}
}
// 新增应用
exports.addSystemStores= async (db, event, context) => {
	const collection = db.collection('systemStores')
	var res = await collection.add(event.data)
	return {
		status: true,
		mes: '新增成功'
	}
}
// 修改应用
exports.updateSystemStores = async (db, event, context) => {
	const collection = db.collection('systemStores')
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
// 删除应用
exports.deleteSystemStores = async (db, event, context) => {
	const collection = db.collection('systemStores')
	var res = await collection.doc(event._id).remove()
	if(res.deleted==0){
		return {
			status: false,
			mes: '删除失败'
		}
	}
	return {
		status: true,
		mes: '删除成功'
	}
}