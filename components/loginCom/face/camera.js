let buffer;
//获得video摄像头区域
let video = null;
//获得Canvas对象
let canvas = null;
let ctx = null;
let MediaStreamTrack = null;
export function closeMedia() {
	try {
		buffer && buffer.getTracks()[0].stop(); //关闭摄像头
	} catch (e) {
		//TODO handle the exception
		return;
	}
}
export function getMedia(faceCallback) {
	video = document.getElementsByClassName('uni-video-video')[0]
	canvas = document.getElementById('face_canvas').children[0]
	console.log(canvas, 'canvas')
	// uni.createCanvasContext(canvasId, this)

	ctx = canvas.getContext('2d')
	let mediaConfig = {
		// 强制打开后置摄像头video:视频  audio:音频
		// video: {
		// 	facingMode: {
		// 		exact: 'environment'
		// 	}
		// },
		audio: false,
		// 请求不带任何参数的视频和音频
		// vidio: true, audio: false
		// 指定视频分辨率
		// video: {width: 480, height: 320}
		// 移动设备，优先使用前置摄像头
		video: {
			facingMode: 'user',
			width: 300,
			height: 400
		}
		// 移动设备，优先使用后置摄像头
		// {video: {facingMode: {exact: 'environment'}}}
	};
	var errBack = function(e) {
		console.log('An error has occurred!', e)
	};
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

		navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
			console.log(video, 1)
			// video.src = window.URL.createObjectURL(stream);
			video.srcObject = stream;
			video.play();
			buffer = stream;
			scan(faceCallback)
		}).catch((err) => {
			console.log(err, 'err')
		})
	} else if (navigator.getUserMedia) { // Standard
		console.log(2)
		navigator.getUserMedia(mediaConfig, function(stream) {
			video.src = stream;
			video.play();
			buffer = stream;
			scan(faceCallback)
		}, errBack);
	} else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
		console.log(3)
		navigator.mozGetUserMedia(mediaConfig, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
			buffer = stream;
			scan(faceCallback)
		}, errBack);
	} else if (navigator.msGetUserMedia) { // Mozilla-prefixed
		console.log(4)
		navigator.msGetUserMedia(mediaConfig, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
			buffer = stream;
			scan(faceCallback)
		}, errBack);
	} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
		console.log(5)
		navigator.webkitGetUserMedia(mediaConfig, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
			buffer = stream;
			scan(faceCallback)
		}, errBack);
	}
}

function scan(faceCallback) {
	// setInterval(()=>{
	let type = false
	if (video) {
		type = true
		MediaStreamTrack = typeof buffer.stop === 'function' ? buffer : buffer.getTracks()[0]
	}
	faceCallback(type)
	// },1000)
}
export function takePhoto() {
	ctx.drawImage(video, 0, 0, 300, 400);
	// 把画布的内容转换为base64编码格式的图片
	var data = canvas.toDataURL('image/png', 1); //1表示质量(无损压缩)
	return data.replace('data:image/png;base64,', '');
}
export function cancalCloseVideo() {
	console.log('关闭摄像头')
	MediaStreamTrack && MediaStreamTrack.stop();
}
