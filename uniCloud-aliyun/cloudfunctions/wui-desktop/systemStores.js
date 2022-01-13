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