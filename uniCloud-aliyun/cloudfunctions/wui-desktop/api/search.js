let needle = require('needle')

let qs = require('querystring');
const lruCache = require('../utils/cache');


async function getNewToken() {
	const param = qs.stringify({
		'grant_type': 'client_credentials',
		'client_id': 'gOdtqhhlvaYyQQn0CW7GBfKg',
		'client_secret': 'ei9rO4BhEDBLplmcgF4KnCDtMTpMNGPV'
	});
	return new Promise(async (resolve) => {
		needle.request('GET', 'https://aip.baidubce.com/oauth/2.0/token', param, {
			// 设置header
			// headers: data.header
		}, (error, response) => {
			// 成功
			if (!error && response.statusCode === 200) {
				resolve({
					message: '查询成功',
					status: true,
					data: response.body
				})
			} else {
				resolve({
					message: '查询失败',
					status: false,
					data: null
				})
			}
		});

	})
}

function getAccessToken() {
	return new Promise(async (resolve) => {
		const oauthValue = await lruCache.get({
			cacheType:'baidu_faceAI_token'
		});
		console.log(oauthValue,'缓存')
		
	})
}
function faceSearch(params){
	const body = {
		
	}
	const url='http://www.goole.com/search?q=111'
	return new Promise(async (resolve) => {
		needle.request('GET', url, params, {
			// 设置header
			// headers: data.header
		}, (error, response) => {
			console.log(error, response,'error, response')
			// 成功
			// if (!error && response.statusCode === 200) {
			// 	resolve({
			// 		message: '查询成功',
			// 		status: true,
			// 		data: response.body
			// 	})
			// } else {
			// 	resolve({
			// 		message: '查询失败',
			// 		status: false,
			// 		data: null
			// 	})
			// }
		});
	
	})
}
module.exports = {
	getAccessToken,
	faceSearch
}
