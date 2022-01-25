import Vue from "vue"

const requireCompontentApp=require.context('./components/modalContent',true,/\index.vue$/)

requireCompontentApp.keys().forEach(fileName=>{
	const app=requireCompontentApp(fileName)
	const ctrl=app.default||app
	console.log(ctrl.name,'应用名称')
	Vue.component(ctrl.name, ctrl)
})