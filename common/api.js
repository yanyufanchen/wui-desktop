export default class Api {
	static VM=null // vue实例化对象
	// 请求数据库
	static sendUniCloud(that, data, flag = true) { // path==云函数 data={mode: getarticle,event: {参数}}
		let path = 'wui-desktop'
		let loadingInstance = null
		if (flag) {
			// loadingInstance=that.Loading.service({
			//   fullscreen: true,
			//   background: 'rgba(250,250,250, 0.2)'
			// });
		} else {
			// console.log('不刷新')
		}

		return new Promise((resolve, reject) => {
			let timeer = null
			uniCloud.callFunction({
				name: path,
				data: data
			}).then((res) => {
				if (res.result.code && res.result.code == 401) {
					that.$message.error('token失效，立即前往登录页面')
					timeer = setTimeout(() => {
						// 前往登录页面
						uni.redirectTo({
							url: "/pages/home/login"
						});
					}, 500)
					return
				}
				if (flag) {
					that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
						// loadingInstance.close();
					});
				}
				resolve(res.result)
			}).catch((err) => {
				console.log(err, '请求云函数错误')
				that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
					// loadingInstance.close();
				});
				resolve({
					statu: false,
					mes: '请求失败'
				})
			})
		})

	}
	// 上传云存储
	static async uploadFileCloud(file, UploadProgress) {
		console.log(file,'上传云存储')
		this.checkStorageMax(file.size)
		const result = await uniCloud.uploadFile({
			filePath: file.url,
			cloudPath: file.name,
			onUploadProgress: function(progressEvent) {
				console.log(progressEvent);
				var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				UploadProgress({
					percentCompleted,
					file
				})
			}
		});
		if (!result.success) {
			console.log('上传失败');
			return {
				mes: '上传失败',
				status: false
			}
		}
		return {
			mes: '上传成功',
			url: result.fileID,
			filePath:result.filePath,
			status: true
		}
	}
	// 获取用户和系统存储量
	static computeStorageMax(){
		let maxStorage=100*1024*1024 // 100M
		let filelist=this.VM.$store.state.user.myappList[0].data.original_fileList
		let storageNum=0
		let computes=(list)=>{
			list.length>0&&list.forEach(item=>{
				if(item.fileSize){
					storageNum=storageNum+item.fileSize
				}
				if(item.children){
					computes(item.children)
				}
			})
		}
		computes(filelist)
		return {
			userStorageNum:storageNum, // 用户存储量
			uploadMaxStorageNum:20*1024*1024, // 最大上传量
			systemStorageNum:maxStorage, // 系统存储量
		}
	}
	// 检测是否满足存储
	static checkStorageMax(fileSize){
		let computeStorageRes=this.computeStorageMax()
		if(fileSize>computeStorageRes.uploadMaxStorageNum){
			return {
				status:false,
				mes:'超出最大上传限制'
			}
		}
		let oddStoreNum=computeStorageRes.systemStorageNum-computeStorageRes.userStorageNum
		if(fileSize>oddStoreNum){
			return {
				status:false,
				mes:'存储空间不足'
			}
		}
		return {
			status:true,
			mes:'检测通过'
		}
	}
	static Toast(message, type = 'success', that) {
		that.$message({
			showClose: true,
			message: message,
			type: type,
			duration: 1000
		});
	}
}
