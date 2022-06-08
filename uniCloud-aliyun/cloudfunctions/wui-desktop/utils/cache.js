const db = uniCloud.database()

let cache = {
	get: (event) => {
		return new Promise(async (resolve) => {
			const collection = db.collection('cache')
			let res = await collection.where({
				cacheType: event.cacheType
			}).get()

			if (res.affectedDocs === 0) {
				resolve(false)
				return
			}
			// 检测是否过期
			let nowTime = new Date().getTime()
			let createTime = new Date(res.data[0].createTime).getTime()
			let timeNum = (nowTime - createTime)
			if (res.data[0].expirationTime < timeNum) {
				console.log('已过期')
				resolve(false)
				return
			} else {
				console.log('正常')
				resolve(res.data[0].cacheData)
			}

		})
	},
	set: async (event) => {
		console.log(event,'设置token')
		const collection = db.collection('cache')
		let res = await collection.add({
			cacheType:event.cacheType,
			cacheData:event.cacheData,
			expirationTime:event.expirationTime,
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
}
module.exports = cache;
