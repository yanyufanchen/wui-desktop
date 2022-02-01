<template>
	<div class="desktopIcons" :style="{'backgroundImage':`url(${findWallpaper()})`}">
		<div class="shortcut flex YcenterXcenter" v-for="item in user.myappList" :key="item.app_id"
			 @dblclick="openModal(stores.find(item2 => item2.app_id == item.app_id))">
			<div class="icon" :style="{'backgroundColor':stores.find(item2 => item2.app_id == item.app_id).backgroundColor}">
				<i class="fa fa-lg" :class="stores.find(item2 => item2.app_id == item.app_id).icon"></i>
			</div>
			<div class="title">{{stores.find(item2 => item2.app_id == item.app_id).title}}</div>
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
			...mapState(['user','systems','stores'])
		},
		components: {

		},
		onLoad() {},
		methods: {
			// 打开应用
			openModal(active) {
				this.Utils.openModal(this,active,{
					data:{}
				})
			},
			findWallpaper(){
				let list=[...this.systems.wallpapers,...this.user.systemData.wallpapers]
				let itemActive=list.find(item=>item.id===this.user.systemData.wallpaper)
				if(itemActive){
					return itemActive.url
				}else{
					return this.systems.wallpapers[0].url
				}
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
