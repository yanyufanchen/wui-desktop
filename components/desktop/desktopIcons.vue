<template>
	<div class="desktopIcons" :style="{'backgroundImage':`url(${systems.wallpaper})`}">
		<div class="shortcut flex YcenterXcenter" v-for="item in desktops.shortcutList" :key="item.id"
			 @dblclick="openModal(item)">
			<div class="icon" :style="{'backgroundColor':item.backgroundColor}">
				<i class="fa fa-lg" :class="item.icon"></i>
			</div>
			<div class="title">{{item.title}}</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';

	export default {
		name: 'desktopIcons',
		data() {
			return {};
		},
		computed: {
			...mapState(['desktops','systems'])
		},
		components: {

		},
		onLoad() {},
		methods: {
			// 打开应用
			openModal(active) {
				console.log(active,'active')
				
				// 检索是否有该应用 有(显示) 无(添加)
				let desktops=this.Web_api.clone(this.desktops)
				let activeApp=desktops.wuiModals.find(item=>item.app_id==active.app_id)

				if(activeApp){
					activeApp.show_flag=true
					
				}else{
					desktops.wuiModals.push({
						id:desktops.wuiModals.length-1+1,
						app_id:active.app_id,
						show_flag:true,
						zIndex:this.Web_api.getArrMaxValue(desktops.wuiModals,'zIndex')+1,
						data:{}
					})
				}
				// console.log(desktops.wuiModals,'111')
				this.$store.commit('setDesktop', desktops);
			}
		}
	};
</script>
<style>

</style>
<style lang="less" scoped>
	.desktopIcons {
		position: fixed;
		top: 0;
		width: 100%;
		height: calc(100% - 40px);
		z-index: 0;
		background-size: cover;
		display: flex;
		flex-flow: column;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-content: start;

		.shortcut {
			width: 64px;
			cursor: pointer;
			box-sizing: border-box;
			border: 1px solid transparent;
			transition: opacity 0.3s, top 0.3s, left 0.3s, border 0.3s, background-color 0.3s;

			.icon {
				width: 40px;
				height: 40px;
				font-size: 22px;
				line-height: 40px;
				text-align: center;
				margin: 5px auto;
				color: white;
				position: relative;

				i {
					color: #fff;

				}
			}

			.title {
				color: white;
				text-shadow: 0px 0px 4px rgb(0 0 0 / 60%);
				text-align: center;
				font-size: 12px;
				line-height: 14px;
				margin-bottom: 5px;
				transition: all 0.5s;
				height: 28px;
				overflow: hidden;
			}

		}

		.shortcut:hover {
			border: 1px solid rgba(255, 255, 255, 0.25);
			background-color: rgba(239, 255, 236, 0.25);
		}
	}
</style>
