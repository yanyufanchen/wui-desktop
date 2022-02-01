<template>
	<div class="about">
		<el-button type="primary" icon="el-icon-edit" circle @click="edit" v-if="user.status==='管理员'"></el-button>
		<el-button type="success" icon="el-icon-check" v-if="editFlag" circle @click="enter"></el-button>
		<div class="systemMessage" v-for="item in aboutList" :key="item.id">
			<div class="about_title" v-if="!editFlag">{{item.name}}</div>
			<div class="about_title" v-else>
				<el-input v-model="item.name" style="width:200px" placeholder="请输入内容"></el-input>
			</div>
			<div class="about_mesage flex XleftYright" v-for="item2 in item.list" :key="item2.id">
				<div class="message_left" v-if="!editFlag">{{item2.name}}</div>
				<div class="message_left" v-else>
					<el-input v-model="item2.name" style="width:200px" placeholder="请输入内容"></el-input>
				</div>
				<div class="message_right" v-if="!editFlag">{{item2.value}}</div>
				<div class="message_right" v-else>
					<el-input v-model="item2.value" style="width:200px" placeholder="请输入内容"></el-input>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: 'about',
		props: {
			options: {}
		},
		data() {
			return {
				editFlag:false,
				aboutList:[]
			}
		},
		computed: {
			...mapState(['systems','user'])
		},
		async created() {
			this.aboutList=this.Web_api.clone(this.systems.aboutList)
		},
		mounted() {

		},
		methods: {
			edit(){
				this.editFlag=!this.editFlag
			},
			enter(){
				let systems = this.Web_api.clone(this.systems)
				systems.aboutList=this.aboutList
				this.$store.dispatch('setSystemApi', systems);
			}
		}
	}
</script>

<style lang="less" scoped>
	.about_title {
		font-size: 14px;
		line-height: 50px;
		font-weight: 550;
	}
	.about_mesage {
		line-height: 30px;
		.message_left {
			width:200px;
		}
		.message_right {
			
		}
	}
</style>
