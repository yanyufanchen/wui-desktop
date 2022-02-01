// 查询反馈建议
exports.getFeedbacks = async (db, event, context) => {
	const collectionFeedbacks = db.collection('feedbacks')
	const feedbacksRes = await collectionFeedbacks.get()
	const feedbackList=feedbacksRes.data
	const collectionUser = db.collection('users')
	var userRes = await collectionUser.field({
		'token': false,
		'lowerMenu': false,
		'myappList': false,
		'shortcutList': false,
		'systemData': false,
		'wuiModals': false
	}).get()
	const userList=userRes.data
	feedbackList.length>0&&feedbackList.forEach(item=>{
		item['username']=userList.find(item2=>item2._id==item.userId).username
	})
	return {
		status: true,
		mes: '查询成功',
		data: feedbackList
	}
}
// 增加反馈建议
exports.addFeedbacks = async (db, event, context) => {
	const collection = db.collection('feedbacks')
	var res = await collection.add({
		"createTime":new Date(),
		"userId":event.data.userId,
		"type":"waiting", // issue 发布 waiting 待审核 delete 删除
		"title":event.data.type.title,
		"content":event.data.content
	})
	if(!res.affectedDocs){
		return {
			status: false,
			mes: '新增失败'
		}
	}
	return {
		status: true,
		mes: '新增成功'
	}
}
// 修改反馈建议
exports.updateFeedbacks = async (db, event, context) => {
	const collection = db.collection('feedbacks')
	var res = await collection.where({
		_id: event._id
	}).update(event.data)
	if(!res.affectedDocs){
		return {
			status: false,
			mes: '修改失败'
		}
	}
	return {
		status: true,
		mes: '修改成功'
	}
}