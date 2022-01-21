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
	<div class="gradient loading" v-loading="loading"  background="none" element-loading-text="桌面加载中……" v-else>
		<img src="../../static/image/loading.jpg" style="width:100%;height:100%;" alt="">
		<div class="init">
			<div >
				<span v-if="initStates.getUser==='warn'">获取用户数据中……</span>
				<span v-else-if="initStates.getUser==='success'">获取用户数据完毕</span>
				<span v-if="initStates.getUser==='warn'">获取用户数据失败</span>
			</div>
			<div >
				<span v-if="initStates.getSystem==='warn'">获取系统设置中……</span>
				<span v-else-if="initStates.getSystem==='success'">获取系统设置完毕</span>
				<span v-if="initStates.getSystem==='warn'">获取系统设置失败</span>
			</div>
		</div>
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
				show:false,
				loading: true,
				initStates:{
					getStore:'warn',
					getUser:'warn',
					getSystem:'warn'
				}, // 加载状态
			};
		},

		computed: {
			...mapState(['user', 'locking', 'desktops', 'stores','initStates'])
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
			let checkApi1=await this.$store.dispatch('getStoreApi')
			console.log(checkApi1,'查询商店应用')
			this.initStates.getStore=checkApi1?'success':'error'
			// 查询用户信息
			let checkApi2=await this.$store.dispatch('getUserApi')
			console.log(checkApi2,'查询用户信息')
			this.initStates.getUser=checkApi2?'success':'error'
			// 查询系统设置
			let checkApi3=await this.$store.dispatch('getSystemApi')
			console.log(checkApi3,'查询系统设置')
			this.initStates.getSystem=checkApi3?'success':'error'
			// 请求完成后显示桌面
			if(!checkApi1||!checkApi2||!checkApi3){
				this.show=false
				return
			}
			return
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
	.loading {
		width: 100%;
		height: 100vh;
		.init {
			position: absolute;
			width: 300px;
			height: 100px;
			// z-index: 1000;
			background-color: #ccc;
		}
		
	}
	.gradient{
	    // background-image: -moz-linear-gradient(top, #8fa1ff, #3757fa)!important; /* Firefox */
	    // background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #2a5d9e), color-stop(1, #4f8fc5))!important; /* Saf4+, Chrome */
	    // filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#c6ff00', endColorstr='#538300', GradientType='0')!important; /* IE*/
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
