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
		if(Arr.length==0){
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
	static getRandomColor(){
	    var rand = Math.floor(Math.random( ) * 0xFFFFFF).toString(16);
	        if(rand.length == 6){
	            return '#'+rand;
	        }else{
	            return Web_api.getRandomColor();
	        }
	}
}
