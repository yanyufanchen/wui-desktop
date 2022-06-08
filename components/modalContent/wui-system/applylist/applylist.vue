<template>
	<div class="applylist">
		<el-button @click="()=>{
			modalVisible=true
			Type='add'
			initCodemirror()
		}" style="margin-bottom:10px">添加应用</el-button>
		<el-table :data="stores" border style="width: 100%" height="400">
			<el-table-column prop="title" label="名称" width="100">
			</el-table-column>
			<el-table-column prop="type" label="类型" width="100">
			</el-table-column>
			<el-table-column prop="backgroundColor" label="背景色" width="65">
				<template slot-scope="scope">
					<div class="color" :style="{'background':scope.row.backgroundColor}"
						style="width:30px;height:30px;"></div>
				</template>
			</el-table-column>
			<el-table-column prop="icon" label="图标" width="50">
				<template slot-scope="scope">
					<i :class="scope.row.icon"></i>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="描述">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="editApply(scope.row)" type="text" size="small">编辑</el-button>
					<el-button type="text" size="small" @click="deleteApply(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-drawer :title="Type==='add'?'添加应用':'编辑应用'" size="40%" :visible.sync="modalVisible" direction="rtl"
			@close="closeDrawer">
			<el-form :model="applyform" :rules="Rules" ref="applyform" label-width="100px" style="height: calc(100% - 50px);overflow-y: auto;">
				<el-form-item label="名称" prop="title">
					<el-input style="width:95%;" v-model="applyform.title" placeholder="请输入应用名称">
					</el-input>
				</el-form-item>
				<el-form-item label="app_id" prop="title">
					<el-input style="width:95%;" v-model="applyform.app_id" :disabled="Type==='add'?false:true" placeholder="请输入应用app_id">
					</el-input>
				</el-form-item>
				<el-form-item label="应用类型" prop="type">
					<el-select v-model="applyform.type" placeholder="请输入应用类型" style="width:95%;">
						<el-option label="系统应用" value="systemApp"></el-option>
						<el-option label="自定义应用" value="webApp"></el-option>
						<el-option label="WEB网页应用" value="webPage"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="自定义尺寸" prop="customSize">
					<el-switch v-model="applyform.customSize" active-color="#13ce66" inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
				<el-form-item label="自定义样式" prop="style" v-show="applyform.customSize">
					<div class="codemirrorBox" style="width:95%;">
						<codemirror className="code-mirror" ref="customSizeCode" v-model="applyform.style" :options="cmOptions"></codemirror>
					</div>
				</el-form-item>
				<el-form-item label="默认数据" prop="default">
					<div class="codemirrorBox" style="width:95%;">
						<codemirror className="code-mirror" ref="defaultCode" v-model="applyform.default" :options="cmOptions"></codemirror>
					</div>
				</el-form-item>
				<el-form-item label="图标" prop="icon">
					<el-input type="input" style="width:95%;" v-model="applyform.icon" :suffix-icon="applyform.icon">
					</el-input>
				</el-form-item>
				<el-form-item label="背景色" prop="backgroundColor">
					<el-color-picker v-model="applyform.backgroundColor"></el-color-picker>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input type="textarea" style="width:95%;" v-model="applyform.description">
					</el-input>
				</el-form-item>
			</el-form>
			<div class="el-footer flex XrightYcenter" style="margin-top:5px;">
				<el-button type="danger" @click="closeDrawer">取消</el-button>
				 <el-button type="primary" @click="applyApi">确定</el-button>
			</div>
		</el-drawer>

	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		codemirror
	} from 'vue-codemirror';
	import 'codemirror/lib/codemirror.css'
	import 'codemirror/theme/base16-dark.css'
	export default {
		name: 'applylist',
		props: {
			options: {}
		},
		data() {
			return {
				applyform: null,
				Type: 'add',
				modalVisible: false,
				Rules: {
					title: [{
						required: true,
						message: '请输入应用名称',
						trigger: 'blur'
					}],
					app_id: [{
						required: true,
						message: '请输入应用唯一id: wui-my-computer',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择应用类型',
						trigger: 'change'
					}],
					customSize: [{
						required: true,
						message: '是否自定义尺寸',
						trigger: 'change'
					}],
					style: [{
						required: true,
						message: '自定义尺寸的样式: {width,height}',
						trigger: 'blur'
					}],
					default: [{
						required: true,
						message: '自定义该应用默认数据: {}',
						trigger: 'blur'
					}],
					icon: [{
						required: true,
						message: '自定义该应用图标: Font Awesome',
						trigger: 'blur'
					}],
					backgroundColor: [{
						required: true,
						message: '请选择应用背景色',
						trigger: 'change'
					}],
					description: [{
						required: true,
						message: '请输入应用描述',
						trigger: 'blur'
					}],
				},
				cmOptions: {
					mode: 'application/json',
					// gutters: ['CodeMirror-lint-markers'],
					lint: true,
					theme: 'base16-dark',
					lineNumbers: true,
				}
			}
		},
		components: {
			codemirror
		},
		computed: {
			...mapState(['stores'])
		},
		async created() {
			this.initApplyform()
		},
		mounted() {

		},
		methods: {
			initApplyform(){
				this.applyform = {
					title: '',
					app_id: '',
					type: '',
					customSize: true,
					style: JSON.stringify({}, null, "\t"),
					default: JSON.stringify({}, null, "\t"),
					icon: '',
					backgroundColor: '#6D6A68',
					description: ''
				}
			},
			initCodemirror() {
				this.$nextTick(() => {
					//调用需要执行的方法
					let customSizeCode = this.$refs.customSizeCode.codemirror;
					let defaultCode = this.$refs.defaultCode.codemirror;
					// // 设置codemirror高度为600
					customSizeCode.setSize('auto', 'auto');
					defaultCode.setSize('auto', 'auto');
				})
			},

			closeDrawer() {
				// console.log('关闭抽屉')
				this.initApplyform()
				this.$refs['applyform'].clearValidate()
			},
			applyApi() {
				this.$refs['applyform'].validate(async (valid) => {
					if (!valid) {
						console.log('error submit!!');
						return false;
					}
					// console.log(this.Type,'this.Type')
					// console.log(this.applyform,'this.applyform')
					
					if (this.Type === 'add') {
						const res = await this.Api.sendUniCloud({
							model: 'addSystemStores',
							event: {
								token: uni.getStorageSync('token'),
								data: {
									title: this.applyform.title,
									app_id:this.applyform.app_id,
									type: this.applyform.type,
									customSize: this.applyform.customSize,
									style: JSON.parse(this.applyform.style, null, "\t"),
									default: JSON.parse(this.applyform.default, null, "\t"),
									icon: this.applyform.icon,
									backgroundColor: this.applyform.backgroundColor,
									description: this.applyform.description
								}
							}
						});
						if (!res.status) {
							this.$message.error('新增失败')
						}
						this.$message.success('新增成功')
						this.$store.dispatch('getStoreApi')
						this.modalVisible = false
					}
					if (this.Type === 'edit') {
						const res = await this.Api.sendUniCloud({
							model: 'updateSystemStores',
							event: {
								token: uni.getStorageSync('token'),
								_id:this.applyform._id,
								data: {
									title: this.applyform.title,
									app_id:this.applyform.app_id,
									type: this.applyform.type,
									customSize: this.applyform.customSize,
									style: JSON.parse(this.applyform.style, null, "\t"),
									default: JSON.parse(this.applyform.default, null, "\t"),
									icon: this.applyform.icon,
									backgroundColor: this.applyform.backgroundColor,
									description: this.applyform.description
								}
							}
						});
						if (!res.status) {
							this.$message.error('修改失败')
						}
						this.$message.success('修改成功')
						this.$store.dispatch('getStoreApi')
						this.modalVisible = false
					}
				});


			},
			editApply(data) {
				this.Type = 'edit'
				this.modalVisible = true
				this.applyform = {
					_id:data._id,
					title: data.title,
					app_id: data.app_id,
					type: data.type,
					customSize: data.customSize,
					style: JSON.stringify(data.style, null, "\t"),
					default: JSON.stringify(data.default, null, "\t"),
					icon: data.icon,
					backgroundColor: data.backgroundColor,
					description: data.description,
				}
			},
			async deleteApply(data){
				this.$confirm('确定要删除该应用吗?', '退出', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await this.Api.sendUniCloud({
						model: 'deleteSystemStores',
						event: {
							token: uni.getStorageSync('token'),
							_id: data._id
						}
					});
					if (!res.status) {
						this.$message.error('删除失败')
					}
					this.$message.success('删除成功')
					this.$store.dispatch('getStoreApi')					
				}).catch(() => {});								
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

	.el-drawer__wrapper {
		bottom: 40px;
	}
	
</style>
