<template>
	<!-- 拖拽弹窗 -->
	<!-- <div class="goinvoice" > -->
	<div class="goinvoice" ref="goinvoice_content" v-if="options" v-show="options.item.show_flag"
		@mousedown.stop="selectModal" :style="{'left':`${left}px`,
		'top':`${top}px`,
		'width':`${width}px`,'height':`${height}px`,
		'zIndex':`${zIndex}`,'boxShadow': `0px 1px 3px 1px ${user.systemData.color}`}">
		<div class="goinvoice_header flex XspaceBYcenter" @mousedown.stop="mousedown($event)"
			:style="{'backgroundColor':user.systemData.color,'opacity': zIndex==Web_api.getArrMaxValue(user.wuiModals, 'zIndex')?1:0.9}"
			ref="goinvoice_header">
			<div class="left flex XcenterYcenter">
				<div class="icon flex XcenterYcenter"
					:style="{'backgroundColor':stores.find(item=>item.app_id==options.item.app_id).backgroundColor}">
					<i class="fa fa-lg" :class="stores.find(item=>item.app_id==options.item.app_id).icon"></i>
				</div>
				<div class="title">{{stores.find(item=>item.app_id==options.item.app_id).title}}</div>
			</div>
			<div class="right">
				<i class="el-icon-minus tool wui-icon" style="font-size: 14px;" @click.stop="selectTools(1)"></i>
				<i class="iconfont tool wui-icon" :class="size==1?'icon-zuidahua':'icon-zuidahua1'"
					style="font-size: 14px;" @click.stop="selectTools(2)"></i>
				<i class="el-icon-close tool wui-icon" style="font-size: 14px;" @click.stop="selectTools(3)"></i>
			</div>
		</div>
		<div class="main">
			<!-- 需要配置到应用的 -->
			<keep-alive>
				<component :is="options.item.app_id"  :options="options"></component>
			</keep-alive>
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
			...mapState(['systems', 'stores', 'user'])
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
				let user = this.Web_api.clone(this.user)
				let maxIndex = this.Web_api.getArrMaxValue(user.wuiModals, 'zIndex')
				let active = user.wuiModals.find(item => item.zIndex === maxIndex)
				// 如果点击的是最顶层,就不执行
				if (this.options.item.app_id === active.app_id) return
				user.wuiModals.forEach(item => {
					if (item.id === this.options.item.id) {
						item.zIndex = maxIndex + 1
					}
				})
				// 写入vuex
				this.$store.dispatch('setUserApi', user);
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
					this.Utils.setModalHide(this, this.options.item)
				}
				if (type === 2) { // 放大缩小
					this.size = this.size == 0.8 ? 1 : 0.8
					this.setModalSize()
				}
				if (type === 3) { // 关闭
					let user = this.Web_api.clone(this.user)
					user.wuiModals = user.wuiModals.filter(item => item.id !== this.options.item.id)
					// 写入vuex
					this.$store.dispatch('setUserApi', user);
				}
			},

			// 设置窗口大小
			setModalSize() {
				// 判断是否是自定义大小
				if (this.stores.find(item => item.app_id == this.options.item.app_id).customSize && this.size !==
					1) { // 自定义大小
					this.width = this.stores.find(item => item.app_id == this.options.item.app_id).style.width
					this.height = this.stores.find(item => item.app_id == this.options.item.app_id).style.height
				} else {
					this.width = document.body.clientWidth * this.size
					this.height = (document.body.clientHeight - 40) * this.size
				}
				this.left = (document.body.clientWidth - this.width) / 2 + this.options.item.id * 10 // 控制窗口的定位
				this.top = (document.body.clientHeight - this.height) / 2 + this.options.item.id * 0

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
			top: 43px;
			left: 0;
			width: 100%;
			height: calc(100% - 44px);
			background-color: #fff;
		}

	}
</style>
