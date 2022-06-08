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
		
		if (!oauthValue) {
			console.log('没有缓存')
			// 重新获取token
			let result = await getNewToken();
			console.log(result, 'result')
			if (!result.status) {
				resolve({
					status: false
				})
				return
			}
			// 写入缓存
			lruCache.set({
				cacheType:'baidu_faceAI_token', 
				cacheData:result.data.access_token,
				expirationTime:result.data.expires_in*1000
			});
			resolve({
				status: true,
				AccessToken: result.data.access_token
			})

		} else {
			console.log('有缓存')
			resolve({
				status: true,
				AccessToken: oauthValue
			})
		}

	})
}
function faceSearch(params){
	const body = {
		"image": params.image,
		"image_type": "BASE64",
		"group_id_list": "web_faceAi",
		"quality_control":"NORMAL"
	}
	const url='https://aip.baidubce.com/rest/2.0/face/v3/search?access_token='+params.AccessToken
	return new Promise(async (resolve) => {
		needle.request('POST', url, body, {
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
module.exports = {
	getAccessToken,
	faceSearch
}
