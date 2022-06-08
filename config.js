export default {
	uploadfileConfig:{
		maxStorage:100*1024*1024 ,// 100M
		uploadMaxStorageNum:20*1024*1024, // 最大上传量
	},
	fileViewTypes:{
		image:['image/jpeg','image/gif','image/png'],
		pdf:['application/pdf','text/plain'],
		audio:['audio/mpeg'],
		video:['video/mp4'],
		word:['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
		excel:['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
	}
}