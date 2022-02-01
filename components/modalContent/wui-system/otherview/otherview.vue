<template>
	<div class="otherview">
		<div class="systemMessage" style="width:100%">
			<div class="other_title flex XspaceBYcenter" style="width:95%" 
			>
				<span>反馈建议列表</span>
				<el-button round>添加反馈</el-button>
			</div>
			<div class="otherMessage" style="width:95%">
				<el-collapse >
				  <el-collapse-item v-for="item in feedbacks.filter(item2=>item2.type!=='delete')" :key="item._id">
					  <template slot="title">
					        <span style="padding:0 5px">{{item.title}}</span>
							<el-tag  type="success" v-if="item.type==='issue'">发布</el-tag>	
							<el-tag  type="warning" v-else-if="item.type==='waiting'">待审核</el-tag>
							<div class="btn" v-if="user.status==='管理员'" style="padding-left: 5px;">
								<el-button type="success" icon="el-icon-check" circle
								v-if="item.type==='waiting'" @click="setFeedback('issue',item)"
								></el-button>
								<el-button type="danger" icon="el-icon-delete" circle
								v-if="item.type==='waiting'" @click="setFeedback('delete',item)"
								></el-button>
							</div>
					    </template>
				    <div style="padding-left:5px">
						<p>提交人：{{item.username}}</p>
						<p>内容：{{item.content}}</p>
					</div>
				  </el-collapse-item>
				</el-collapse>
			</div>
		</div>
		<div class="systemMessage" style="width:100%">
			<div class="other_title flex XspaceBYcenter" style="width:95%">
				<span>我的反馈建议</span>
			</div>
			<div class="otherMessage" style="width:95%">
				<el-collapse >
				  <el-collapse-item v-for="item in feedbacks.filter(item2=>item2.userId==user._id)" :key="item._id">
					  <template slot="title">
					        <span style="padding:0 5px">{{item.title}}</span>
							<el-tag  type="success" v-if="item.type==='issue'">发布</el-tag>	
							<el-tag  type="warning" v-else-if="item.type==='waiting'">待审核</el-tag>		
							<el-tag  type="danger" v-else-if="item.type==='delete'">已删除</el-tag>
							
					    </template>
				    <div style="padding-left:5px">
						<p>提交人：{{item.username}}</p>
						<p>内容：{{item.content}}</p>
					</div>
				  </el-collapse-item>
				</el-collapse>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: 'otherview',
		props: {
			options: {}
		},
		data() {
			return {
				feedbacks:[]
			}
		},
		computed: {
			...mapState(['user'])
		},
		async created() {
			this.getFeedbacks()
		},
		mounted() {

		},
		methods: {
			async getFeedbacks(){
				const res = await this.Api.sendUniCloud({
					model: 'getFeedbacks',
					event: {
						token: uni.getStorageSync('token')
					}
				});
				if (!res.status) {
					this.$message.error('查询失败')
					return
				}
				this.feedbacks = res.data
			},
			async setFeedback(type,item){
				const res = await this.Api.sendUniCloud({
					model: 'updateFeedbacks',
					event: {
						token: uni.getStorageSync('token'),
						_id:item._id,
						data:{
							type
						}
					}
				});
				if(!res.status){
					this.$message.error('修改失败')
				}
				this.$message.success('修改成功')
				this.getFeedbacks()
			}
		},
	}
</script>

<style lang="less" scoped>
	.other_title {
		font-size: 14px;
		line-height: 50px;
		font-weight: 550;
	}
	
</style>
