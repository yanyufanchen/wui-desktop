<template>
	<div class="borwser">
		<el-tabs v-model="editableTabsValue" type="border-card" :editable="true" @tab-click="selectTab"
			@tab-remove="removeTab" @tab-add="addTab">
			<el-tab-pane v-for="(item, index) in user.myappList.find(app=>app.app_id===options.item.app_id).data.list" :key="item.id" :label="item.name"
				:name="item.name+'_'+item.id">
				<div class="content">
					<iframe ref="iframe" target="_top" :src="item.url" frameborder="0" scrolling='auto' style="width:100%;height:100%;"></iframe>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name:'borwser',
		props: {
			options: {}
		},
		data() {
			return {
				editableTabsValue: '',
			}
		},
		computed: {
			...mapState(['user'])
		},
		created() {
			let list=this.user.myappList.find(app=>app.app_id===this.options.item.app_id).data.list
			this.editableTabsValue =
				`${list.find(item=>item.show).name}_${list.find(item=>item.show).id}`
		},
		mounted() {
			const { iframe } = this.$refs;
			iframe.forEach(item=>{
				item.contentWindow.location.replace(item.src);
			})
			// console.log(this.user.myappList.find(app=>app.app_id===this.options.item.app_id).data.list,'111')
		},
		methods: {
			selectTab(targetName) {
				// 从我的应用取值
				let user = this.Web_api.clone(this.user)
				let active=''
				user.myappList.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						active=user.myappList.find(app=>app.app_id===item.app_id)
						active.data.list.forEach(item2=>item2.show=false)
						active.data.list.forEach(item2=>{
							if(item2.name===targetName.label){
								item2.show=true
							}
						})
					}
				})
				// 写入vuex
				this.$store.commit('updateUser', user);
			},
			addTab(targetName) {
				let user = this.Web_api.clone(this.user)
				let active=''
				user.wuiModals.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						active=user.myappList.find(app=>app.app_id===item.app_id)
						active.data.list.forEach(item2 => item2.show = false)
						active.data.list.push({
							id: active.data.list.length + 1,
							name: '新标签页-搜狗搜索',
							url: 'https://www.sogou.com/',
							show: true,
						})
					}
				})
				this.editableTabsValue = `新标签页-搜狗搜索_${active.data.list.length+1}`;
				// 写入vuex
				this.$store.dispatch('setUserApi', this.user);
			},
			removeTab(targetName) {
				let user = this.Web_api.clone(this.user)
				user.wuiModals.forEach(item => {
					if (item.app_id === this.options.item.app_id) {
						let active=user.myappList.find(app=>app.app_id===item.app_id)
						active.data.list=active.data.list.filter(item2=>`${item2.name}_${item2.id}`!==targetName)
						active.data.list.forEach((item2,index2)=>{
							item2.show=false
							if(index2===active.data.list.length-1){
								item2.show=true
								this.editableTabsValue = `${item2.name}_${item2.id}`;
							}
						})
					}
				})
				// 写入vuex
				this.$store.dispatch('setUserApi', this.user);
			}
		}
	}
</script>

<style lang="less" scoped>
	.borwser {
		height: 100%;
	}

	.content {
		width: 100%;
		height: 100%;
	}
</style>
