<template>
	<!-- 拖拽弹窗 -->
	<!-- <div class="goinvoice" > -->
	<div class="goinvoice" ref="goinvoice_content" v-if="options" v-show="options.item.show_flag"
		@mousedown.stop="selectModal" :style="{'left':`${left}px`,
		'top':`${top}px`,
		'width':`${width}px`,'height':`${height}px`,
		'zIndex':`${zIndex}`,'boxShadow': `0px 1px 3px 1px ${systems.color}`}">
		<div class="goinvoice_header flex XspaceBYcenter" @mousedown.stop="mousedown($event)"
			:style="{'backgroundColor':systems.color,'opacity': options.index==desktops.wuiModals.length-1?1:0.9}"
			ref="goinvoice_header">
			<div class="left flex XcenterYcenter">
				<div class="icon flex XcenterYcenter"
					:style="{'backgroundColor':stores.appList.find(item=>item.app_id==options.item.app_id).backgroundColor}">
					<i class="fa fa-lg" :class="stores.appList.find(item=>item.app_id==options.item.app_id).icon"></i>
				</div>
				<div class="title">{{stores.appList.find(item=>item.app_id==options.item.app_id).title}}</div>
			</div>
			<div class="right">
				<i class="el-icon-minus tool wui-icon" style="font-size: 14px;" @click.stop="selectTools(1)"></i>
				<i class="iconfont tool wui-icon" :class="size==1?'icon-zuidahua':'icon-zuidahua1'"
					style="font-size: 14px;" @click.stop="selectTools(2)"></i>
				<i class="el-icon-close tool wui-icon" style="font-size: 14px;" @click.stop="selectTools(3)"></i>
			</div>
		</div>
		<div class="main">
			{{stores.appList.find(item=>item.app_id==options.item.app_id).title}}
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: 'wuimodal', // 应用弹框
		data() {
			return {
				size: 0.8,
				width: 0,
				height: 0,
				left: 0,
				top: 0,

			}

		},
		props: {
			options: {},
			zIndex: 0
		},
		computed: {
			...mapState(['systems', 'stores', 'desktops'])
		},
		components: {

		},
		mounted() {
			this.setModalSize()
		},
		onLoad() {


		},
		methods: {
			// 点击当前窗口
			selectModal() {
				// 点击,将当前项排到最后一位，目的是置顶
				let desktops = this.Web_api.clone(this.desktops)
				let maxIndex = this.Web_api.getArrMaxValue(desktops.wuiModals, 'zIndex') + 1
				desktops.wuiModals.forEach(item => {
					if (item.id === this.options.item.id) {
						item.zIndex = maxIndex
					}
				})
				// 写入vuex
				this.$store.commit('setDesktop', desktops);
			},
			// 移动窗口
			mousedown(e) {
				this.selectModal()
				// 头部
				let el = this.$refs.goinvoice_header
				// 弹框盒子
				let Boxel = this.$refs.goinvoice_content
				// 鼠标点击时的相对距离
				let disx_old = e.pageX - el.offsetLeft;
				let disy_old = e.pageY - el.offsetTop;
				// 暂存弹框盒子定位坐标
				let left = this.left
				let top = this.top
				document.onmousemove = (e) => {
					// 鼠标移动时的相对距离
					let disx_new = e.pageX - el.offsetLeft;
					let disy_new = e.pageY - el.offsetTop;
					// 弹框盒子的定位坐标
					this.left = left + (disx_new - disx_old)
					this.top = top + (disy_new - disy_old)
				}
				document.onmouseup = function() {
					// 取消事件
					document.onmousemove = document.onmouseup = null;
				}
			},
			// 工具栏
			selectTools(type) {
				if (type === 1) { // 折叠
					this.Utils.setModalHide(this,this.options.item)
				}
				if (type === 2) { // 放大缩小
					this.size = this.size == 0.8 ? 1 : 0.8
					this.setModalSize()
				}
				if (type === 3) { // 关闭
				let desktops = this.Web_api.clone(this.desktops)
					desktops.wuiModals= desktops.wuiModals.filter(item => item.id !== this.options.item.id)
					this.$store.commit('setDesktop', desktops);
				}
			},
			// 设置窗口隐藏
			// setModalHide(){
			// 	// 设置当前弹窗显影
			// 	let desktops = this.Web_api.clone(this.desktops)
			// 	let maxIndex = this.Web_api.getArrMaxValue(desktops.wuiModals, 'zIndex') + 1
			// 	desktops.wuiModals.forEach(item => {
			// 		if (item.id === this.options.item.id) {
			// 			item.show_flag = false
			// 		}
			// 	})
			// 	let newwuiModals = desktops.wuiModals.filter(item => item.show_flag === true)
			// 	// 折叠的是最后一个 就让第一个高亮
			// 	if (newwuiModals.length == 0) {
			// 		this.$store.commit('setDesktop', desktops);
			// 		return
			// 	}
			// 	if (desktops.wuiModals[desktops.wuiModals.length - 1].id === this.options.item.id) {
			// 		newwuiModals[0].zIndex = maxIndex
			// 	} else {
			// 		newwuiModals[newwuiModals.length - 1].zIndex = maxIndex
			// 	}
			// 	this.$store.commit('setDesktop', desktops);
			// },
			// 设置窗口大小
			setModalSize() {
				// 判断是否是自定义大小
				if (this.stores.appList.find(item => item.app_id == this.options.item.app_id).customSize && this.size !==
					1) { // 自定义大小
					this.width = this.stores.appList.find(item => item.app_id == this.options.item.app_id).style.width
					this.height = this.stores.appList.find(item => item.app_id == this.options.item.app_id).style.height
				} else {
					this.width = document.body.clientWidth * this.size
					this.height = (document.body.clientHeight - 40) * this.size
				}
				this.left = (document.body.clientWidth - this.width) / 2 + this.options.item.id * 10
				this.top = (document.body.clientHeight - this.height) / 2 + this.options.item.id * 10

				if (this.size == 1) { // 最大化
					this.left = 0
					this.top = 0
				}

			}
		}
	};
</script>

<style lang="less" scoped>
	.goinvoice {
		width: 100%;
		// height: calc(100% - 40px);
		position: fixed;
		// background: rgba(0, 0, 0, 0.5);
		// z-index: 100;
		box-sizing: border-box;
		background: white;
		padding: 10px;
		border-radius: 2px;

		// box-shadow: -1px 2px 2px 0px #e4e7ed;
		// box-shadow-color: pink;
		.goinvoice_header {
			position: absolute;
			top: 0;
			left: 0;
			box-sizing: border-box;
			width: 100%;
			height: 40px;
			transition: all 0.3s;
			padding: 0 10px;
			cursor: move;

			// background: rgb(24, 28, 71);
			.left {
				.icon {
					width: 20px;
					height: 20px;
					color: #fff;
					font-size: 14px;
				}

				.title {
					color: #fff;
					margin-left: 10px;
				}
			}

			.right {
				width: 164px;
				cursor: default;
				text-align: right;
				height: 40px;
				overflow: hidden;

				.tool {
					color: white;
					display: inline-block;
					width: 40px;
					line-height: 40px;
					text-align: center;
					cursor: pointer;
					transition: all 0.3s;
				}
			}
		}

		.main {
			position: absolute;
			top: 50px;
			left: 0;
			width: 100%;
			height: 50px;
			background-color: #fff;
		}

	}
</style>
