import axios from 'axios'
export default class Web_api {
	static clone(obj) { // 复杂对象克隆
		return JSON.parse(JSON.stringify(obj))
	}
	static sort(Arr, key) { // 数组排序
		Arr.sort((a, b) => {
			if (a[key] < b[key]) {
				return -1
			} else if (a[key] > b[key]) {
				return 1
			} else {
				return 0
			}
		})
		return Arr
	}
	static getArrMaxValue(Arr, key) { // 数组最大值取值
		if (Arr.length == 0) {
			return 0
		}
		let newArr = Web_api.clone(Arr, key)
		newArr.sort((a, b) => {
			if (a[key] < b[key]) {
				return -1
			} else if (a[key] > b[key]) {
				return 1
			} else {
				return 0
			}
		})
		return newArr[newArr.length - 1][key]
	}
	// 计算文件大小
	static toFriendlySize(byteSize) {
		if (!Number.isNaN(byteSize)) {
			if (byteSize < 1024) {
				return byteSize + "b";
			} else if (byteSize < 1024 * 1024) {
				return (byteSize / 1024).toFixed(1) + "k";
			} else if (byteSize < 1024 * 1024 * 1024) {
				return (byteSize / 1024 / 1024).toFixed(1) + "M";
			} else {
				return (byteSize / 1024 / 1024 / 1024).toFixed(1) + "G";
			}
		}
		return "EMPTY";
	}
	// 获取随即颜色 #ccc
	static getRandomColor() {
		var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
		if (rand.length == 6) {
			return '#' + rand;
		} else {
			return Web_api.getRandomColor();
		}
	}
	static getLocation(url) {
		if (url) {
			let aDom = document.createElement('a');
			aDom.href = url;
			let j = {
				hostname: aDom.hostname,
				host: aDom.host,
				origin: aDom.origin,
				protocol: aDom.protocol,
				pathname: aDom.pathname,
				hash: aDom.hash
			}
			let Domain = j.hostname.match(
				/([a-z0-9][a-z0-9\-]*?\.(?:com\.cn|net\.cn|org\.cn|com\.au|imipo\.shop|com|cn|co|net|org|gov|cc|biz|info|hn|xyz|hk|icu|us|mobi|art|wang|me|so|top|win|vip|ltd|red|ru|ac\.cn|xn--kput3i|xin|xn--3ds443g|shop|site|club|fun|online|link|gov\.cn|name|pro|work|tv|kim|group|tech|store|cx|ren|ink|pub|live|wiki|design|xn--fiq228c5hs|xn--6qq986b3xl|xn--fiqs8s|xn--ses554g|xn--hxt814e|xn--55qx5d|xn--io0a7i|xn--3bst00m)(?:\.(?:cn|jp))?)$/
				);
			if (Domain) {
				j.domain = Domain[0];
			}
			return j;
		}
	}
	// 检测一维数组当前项是否存在
	static checkArrActive(arr, i) {
		return arr.findIndex(item2 => i == item2) > -1;
	}
	static renderFile(type, url) {
		return new Promise((resolve) => {
			axios({
				method: "get",
				responseType: type, // 因为是流文件，所以要指定blob类型
				url: url, // 自己的服务器，提供的一个word下载文件接口
			}).then(({
				data
			}) => {
				resolve(data)
			});
		})
	}
	
}
