function nav() {
    // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先，如果有getUserMedia的话，就获得它
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // 否则，为老的navigator.getUserMedia方法包裹一个Promise
            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }
}
export function setCamera(faceVideoSrc) {
    const constraints = {
        video: true,
        audio: false
    };
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(stream => {
        // let v = document.getElementById(videoId);
        // 旧的浏览器可能没有srcObject
        console.log(stream, 'stream')
		faceVideoSrc=stream
   //      if ("srcObject" in v) {
   //          v.srcObject = stream;
			// console.log(1)
   //      } else {
   //          // 防止再新的浏览器里使用它，应为它已经不再支持了
			// console.log(window.URL,2)
   //          // v.src = window.URL.createObjectURL(stream);
			
   //      }
   //      v.onloadedmetadata = function (e) {
   //          v.play();
   //      };
    }).catch(err => {
        console.error(err.name + ": " + err.message);
    })
}
export function takePhone() {
    //写入画布，并转换为base64
    // Elements for taking the snapshot 
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');

    context.drawImage(video, 0, 0, 320, 240);

    // 如果 toBlob 方法出现兼容性问题建议引入 https://github.com/eligrey/canvas-toBlob.js
    console.log(canvas.toDataURL(),'canvas.toDataURL()')
    
    // canvas.toBlob(function (blob) {
    //     saveAs(blob, `AI人脸收录_${new Date().getTime()}`)
    //     console.log(blob,'blob')
    // });
}
export function takePhoneDownload(){
     //写入画布，并转换为base64
    // Elements for taking the snapshot 
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');

    context.drawImage(video, 0, 0, 320, 240);

    // 如果 toBlob 方法出现兼容性问题建议引入 https://github.com/eligrey/canvas-toBlob.js
    // console.log(canvas.toDataURL(),'canvas.toDataURL()')
    
    canvas.toBlob(function (blob) {
        saveAs(blob, `AI人脸收录_${new Date().getTime()}`)
        console.log(blob,'blob')
    });
}