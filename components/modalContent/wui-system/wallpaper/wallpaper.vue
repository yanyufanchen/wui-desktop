<template>
	<div class="wallpaper">
		<div class="activeWallpaper">
			<img v-if="type==='system'" :src="systems.wallpapers.find(item=>item.id===systems.wallpaper).url" alt="">
			<img v-else="type==='user'" :src="[...systems.wallpapers,...user.systemData.wallpapers].find(item=>item.id===user.systemData.wallpaper)&&[...systems.wallpapers,...user.systemData.wallpapers].find(item=>item.id===user.systemData.wallpaper).url" alt="">
		</div>
		<div class="addWallpaper">
			<el-input style="width:300px;margin-right:5px" v-model="wallpaperUrl" placeholder="在线添加壁纸"></el-input>
			<el-button @click="addWallpaper">添加</el-button>
		</div>
		<el-row :gutter="10" v-if="type==='system'">
			<div  v-for="(item,index) in [...systems.wallpapers]" :key="item.id">
				<el-col :xs="8" :sm="8" :md="6" :lg="4" :xl="2">
					<div class="wallpaperItem" style="margin-bottom:10px" @click="selectWallpaper(item.id)">
						<img :src="item.url" alt="">
					</div>
				</el-col>
			</div>
		</el-row>
		<el-row :gutter="10" v-else="type==='user'">
			<div  v-for="(item,index) in [...systems.wallpapers,...user.systemData.wallpapers]" :key="item.id">
				<el-col :xs="8" :sm="8" :md="6" :lg="4" :xl="2">
					<div class="wallpaperItem" style="margin-bottom:10px" @click="selectWallpaper(item.id)">
						<img :src="item.url" alt="">
					</div>
				</el-col>
			</div>
		</el-row>
		
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name:'wallpaper',
		props: {
			type: ''
		},
		data() {
			return {
				wallpaperUrl:'',
			}
		},
		computed: {
			...mapState(['user','systems'])
		},
		created() {

		},
		mounted() {

		},
		methods: {
			addWallpaper(){
				this.$emit('addWallpaper',this.wallpaperUrl)
				this.wallpaperUrl=''
			},
			selectWallpaper(index){
				this.$emit('selectWallpaper',index)
			}
		}
	}
</script>

<style lang="less" scoped>
	.wallpaper {
		box-sizing: border-box;
		width: 100%;
		padding-right: 100px;
		.activeWallpaper {
			img {
				width: 336px;
				height: 185px;
			}
		}
		.addWallpaper {
			margin: 5px 0;
		}
		.wallpaperItem {
			box-sizing: border-box;
			width: 100%;
			height: 75px;
			background-color: #333333;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.wallpaperItem:hover {
			border: 3px solid #007AFF;
			cursor: pointer;
		}
	}
</style>
