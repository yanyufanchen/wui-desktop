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
		return newArr[newArr.length-1][key]
	}
}
