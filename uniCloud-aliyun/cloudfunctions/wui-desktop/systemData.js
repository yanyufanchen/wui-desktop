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