<template>
	<div class="userlist">
		<el-button @click="()=>{
			adduserVisible=true
			userType='add'
		}" style="margin-bottom:10px">添加用户</el-button>
		<div class="userTabs">
			<span style="display: inline-block;text-decoration: underline;padding: 10px;cursor: pointer;"
				:style="{'color':userTabType==item.type?user.systemData.color:'#aaa'}"
				@click="()=>{userTabType=item.type;userfrom.userType=item.type;getUserlist()}"
				v-for="item in [{name:'使用',type:'use'},{name:'审核',type:'waiting'},{name:'禁用',type:'stop'}]">{{item.name}}</span>
		</div>
		<el-table :data="userlist" border style="width: 100%">
			<el-table-column fixed prop="creattime" label="创建日期">
				<template slot-scope="scope">
					<span>{{Time.formatTime(scope.row.creattime,'Y-M-D')}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="username" label="账号" width="150">
			</el-table-column>
			<el-table-column prop="status" label="身份" width="100">
			</el-table-column>
			<el-table-column prop="type" label="状态" width="80">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.type==='use'">使用</el-tag>
					<el-tag type="warning" v-else-if="scope.row.type==='waiting'">审核</el-tag>
					<el-tag type="danger" v-else-if="scope.row.type==='stop'">禁用</el-tag>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="150">
				<template slot-scope="scope">
					<el-button @click="editUser(scope.row)" type="text" size="small">编辑</el-button>
					<el-button type="text" size="small" v-if="scope.row.status!=='管理员'" @click="deleteUser(scope.row)">
						删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog :title="userType==='add'?'添加用户':'编辑用户'" :visible.sync="adduserVisible" width="40%" :show-close="false">
			<el-form :model="userfrom" :rules="userRules" ref="userfrom" label-width="100px" >
				<el-form-item label="用户名" prop="username">
					<el-input style="width:100%;margin-bottom:5px" :disabled="userType==='add'?false:true" v-model="userfrom.username" placeholder="请输入用户名">
					</el-input>
				</el-form-item>
				<el-form-item label="密码" prop="newPassword">
					<el-input style="width:100%;margin-bottom:5px" type="password" v-model="userfrom.password"
						placeholder="请输入新密码">
					</el-input>
				</el-form-item>
				<el-form-item label="状态" prop="userType">
					<el-radio-group v-model="userfrom.userType">
						<el-radio label="use">使用</el-radio>
						<el-radio label="waiting">审核</el-radio>
						<el-radio label="stop">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="()=>{
				adduserVisible = false
				userfrom.username=''
				userfrom.password=''
				userfrom.userType='use'
			}">取 消</el-button>
				<el-button type="primary" @click="userApi">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: 'userlist',
		props: {
			options: {}
		},
		data() {
			return {
				userTabType: 'use',
				userlist: [],
				userfrom: {
					username: '',
					password: '',
					userType: 'use'
				},
				userType: 'add',
				adduserVisible: false,
				userRules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 12,
							message: '长度在 5 到 12 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '长度在 6 到 12 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		computed: {
			...mapState(['user'])
		},
		async created() {
			// 查询用户列表
			this.getUserlist()
		},
		mounted() {

		},
		methods: {
			// 查询用户列表
			async getUserlist() {
				const res = await this.Api.sendUniCloud({
					model: 'getAccountList',
					event: {
						type: this.userTabType,
						token: uni.getStorageSync('token')
					}
				});
				if (!res.status) {
					this.$message.error('查询失败')
					return
				}
				this.userlist = res.data
			},
			userApi() {
				this.$refs['userfrom'].validate(async (valid) => {
					if (!valid) {
						console.log('error submit!!');
						return false;
					}
					if (this.userType === 'add') {
						const res = await this.Api.sendUniCloud({
							model: 'addAccount',
							event: {
								token: uni.getStorageSync('token'),
								data: {
									username: this.userfrom.username,
									password: this.userfrom.password,
									type: this.userfrom.userType, // use 使用 waiting 审核 stop 禁用
									comment: "无"
								}
							}
						});
						if (!res.status) {
							this.$message.error('新增失败')
						}
						this.$message.success('新增成功')
						this.getUserlist()
						this.adduserVisible = false
					}
					if (this.userType === 'edit') {
						const res = await this.Api.sendUniCloud({
							model: 'updateUser',
							event: {
								token: uni.getStorageSync('token'),
								_id: this.userfrom._id,
								data: {
									username: this.userfrom.username,
									password: this.userfrom.password,
									type: this.userfrom.userType,
								}
							}
						});
						if (!res.status) {
							this.$message.error('修改失败')
						}
						this.$message.success('修改成功')
						this.getUserlist()
						this.adduserVisible = false
					}
				});


			},
			editUser(data) {
				this.userType = 'edit'
				
				this.adduserVisible = true
				this.userfrom = {
					_id: data._id,
					userType:data.type,
					username: data.username,
					password: data.password,
				}
			},
			deleteUser(row) {
				console.log(row, 111)
				this.$confirm('此操作将永久删除该用户吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await this.Api.sendUniCloud({
						model: 'removeAccount',
						event: {
							token: uni.getStorageSync('token'),
							_id: row._id,
						}
					});
					if (!res.status) {
						this.$message.error('删除失败')
					}
					this.$message.success('删除成功')
					this.getUserlist()
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			}
		}
	}
</script>

<style lang="less" scoped>
	.userlist {
		box-sizing: border-box;
		padding-right: 50px;
		width: 100%;
	}
</style>
