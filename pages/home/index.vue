<template>
	<div class="desktop flex YcenterXcenter" v-if="show">
		<locking v-if="locking" />
		<div class="content" @click.stop="bindDesktop">
			<desktopIcons @change="SortChange"></desktopIcons>
			<wuiModal :options="{item,index}" :zIndex="item.zIndex" v-for="(item,index) in user.wuiModals"
				:key="item.id" />
		</div>
		<bottomBar ref="bottomBar" />
	</div>
	<div class="desktop flex YcenterXcenter" v-else>
		无
	</div>
</template>

<script>
	import bottomBar from '@/components/desktop/bottomBar.vue'
	import locking from '@/components/desktop/locking.vue'
	import desktopIcons from '@/components/desktop/desktopIcons.vue'
	import wuiModal from '@/components/desktop/wuiModal.vue'
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				show:false
			};
		},

		computed: {
			...mapState(['user', 'locking', 'desktops', 'stores'])
		},
		components: {
			bottomBar,
			desktopIcons,
			wuiModal,
			locking
		},
		async created() {
			this.$BusEvent.$on('initDesktop', () => {
				this.bindDesktop()
			})
			// 判断锁定
			if (uni.getStorageSync('locking')) {
				this.$store.commit('locking', true);
			}
			// 查询商店应用
			await this.$store.dispatch('getStoreApi')
			// 查询用户信息
			await this.$store.dispatch('getUserApi')
			// 查询系统设置
			await this.$store.dispatch('getSystemApi')
			// 请求完成后显示桌面
			this.show=true
			
			// 图标从上到下摆放8个  90高一个
			let user = this.Web_api.clone(this.user)
			user.shortcutList.forEach((item, index) => {
				user.shortcutList[index] = this.stores.find(item2 => item2.app_id == item)
				user.shortcutList[index].id = index
			})
			// 写入vuex
			this.$store.commit('updateUser', user);
		},
		mounted() {
			
		},
		async onLoad() {
			
			
		},
		methods: {
			bindDesktop() {
				// 点击桌面隐藏状态栏
				this.$refs.bottomBar.drawerNewsWidth = '0px'
				this.$refs.bottomBar.lowerMenuFlag = false
				this.$refs.bottomBar.lowerMenuUserFlag = false
				this.$refs.bottomBar.lowerDateFlag = false

			},
			SortChange(e) {
				console.log(e)
			},
			
		}
	};
</script>

<style lang="less" scoped>
	uni-page-body {
		height: 100%;
	}

	.desktop {
		width: 100%;
		height: 100vh;
		background-color: #383a31;
		overflow: hidden;

		.content {
			width: 100%;
			flex: 1;

		}

		.locking {
			position: fixed;
			width: 100%;
			height: 100vh;
			z-index: 1001;
			background-color: #383a31;

			.content {
				position: relative;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				// background-color: #a7ad93;
				width: 300px;
				height: 300px;

				.header {
					width: 120px;
					height: 120px;
					border-radius: 120px;
					line-height: 120px;
					text-align: center;
					font-size: 55px;
					color: #0089FE;
					background: #ccc;
					margin-bottom: 30px;
				}

				.hint {
					margin-top: 10px;
					font-size: 12px;
					color: #ccc;
				}
			}
		}
	}
</style>
