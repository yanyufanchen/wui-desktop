<template>
	<div class="desktop flex YcenterXcenter">
		<locking v-if="locking" />
		<div class="content" @click.stop="bindDesktop">
			<desktopIcons  @change="SortChange"></desktopIcons>
			<wuiModal :options="{item,index}" :zIndex="item.zIndex" v-for="(item,index) in desktops.wuiModals" :key="item.id" />
		</div>
		<bottomBar ref="bottomBar" />
		
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
				
			};
		},
		
		computed: {
			...mapState(['user','locking','desktops','stores'])
		},
		components: {
			bottomBar,
			desktopIcons,
			wuiModal,
			locking
		},
		created(){
			this.$BusEvent.$on('initDesktop',()=>{
				this.bindDesktop()
			})
			// 判断锁定
			if(uni.getStorageSync('locking')){
				this.$store.commit('locking', true);
			}
		},
		onLoad() {
			console.log(this.user, '启动')
			// 查询系统数据
			let systems={
				color:'#14173a', // 统一颜色
				wallpaper:'./static/medias/desktop/3.jpg', // 壁纸
			}
			let desktops={
				shortcutList:['wui-my-computer','wui-app-store','wui-browser'], // 配置我的桌面快捷应用列表
				wallpapers:[], // 壁纸库
				lowerMenu:[] ,// 左下角菜单 // 关联 排序我的应用列表 可拖拽应用列表
				wuiModals:[
					{	
						id:0,
						app_id:'wui-my-computer',
						show_flag:true,
						zIndex:2,
						data:{}
					},
					{
						id:1,
						app_id:'wui-browser',
						show_flag:true,
						zIndex:3,
						data:{}
					},
					// {
					// 	id:2,
					// 	app_id:4,
					// 	show_flag:true,
					// 	data:{}
					// }
				]
			}
			let stores={
					appList:[
						{
							app_id: 'wui-my-computer',
							title: '我的电脑',
							icon: 'fa-desktop',
							customSize:false,
							backgroundColor: 'rgb(194, 187, 183，0.3)',
							type:'webapp',
						},
						{
							app_id: 'wui-app-store',
							title: '应用商店',
							customSize:false,
							icon: 'fa-shopping-bag',
							backgroundColor: 'rgb(179, 106, 186)',
							type:'webapp',
						},
						{
							app_id: 'wui-browser',
							title: '浏览器',
							customSize:false,
							icon: 'fa-internet-explorer',
							backgroundColor: 'rgb(58, 85, 194)',
							type:'webpage',
						},{
							app_id: 'wui-calculator',
							title: '计算器',
							type:'webpage',
							customSize:true,
							style:{width:340,height:450},
							icon: 'fa-calculator',
							backgroundColor: 'rgb(255, 85, 127)',
						},{
							app_id: 'wui-browser2',
							title: '浏览器2',
							customSize:false,
							icon: 'fa-internet-explorer',
							backgroundColor: 'rgb(58, 85, 194)',
						},{
							app_id: 'wui-browser3',
							title: '浏览器3',
							customSize:false,
							icon: 'fa-internet-explorer',
							backgroundColor: 'rgb(58, 85, 194)',
						},{
							app_id: 'wui-browser4',
							title: '浏览器4',
							customSize:false,
							icon: 'fa-internet-explorer',
							backgroundColor: 'rgb(58, 85, 194)',
						},{
							app_id: 'wui-browser5',
							title: '浏览器5',
							customSize:false,
							icon: 'fa-internet-explorer',
							backgroundColor: 'rgb(58, 85, 194)',
						},{
							app_id: 'wui-browser6',
							title: '浏览器6',
							customSize:false,
							icon: 'fa-internet-explorer',
							backgroundColor: 'rgb(58, 85, 194)',
						}
					], // 所有应用列表
					myappList:[] // 我的应用列表
				}
			
			// 图标从上到下摆放8个  90高一个
			desktops.shortcutList.forEach((item,index)=>{
				desktops.shortcutList[index]=stores.appList.find(item2=>item2.app_id==item)
				desktops.shortcutList[index].id=index
			})
			
			// 写入vuex
			this.$store.commit('setDesktop', desktops);
			this.$store.commit('setSystem', systems);
			this.$store.commit('setStore', stores);
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
			}
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
				transform: translate(-50%,-50%);
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
