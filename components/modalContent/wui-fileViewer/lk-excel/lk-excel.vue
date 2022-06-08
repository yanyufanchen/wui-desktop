<template>
	<div class="box flex XcenterYtop" :style="{'height':`${height}px`}">
		<!-- excel查看详情 -->
		<div id="table" style="width: 100%">
			<el-tabs v-model="tableActiveId" :key="tableActiveId" tab-position="bottom" style="height: 100%;"  editable >
			  <el-tab-pane
			    :key="item.id"
			    v-for="(item, index) in excelData"
			    :label="item.title"
			    :name="item.id"
			  >
			    <el-table :data="excelData[index].data" style="width: 100%">
			    	<!-- <el-table-column prop="xx" label="xxxx"> -->
			    	</el-table-column>
			    	<el-table-column v-for="(value2, key2, index2) in excelData[index].data[0]" :key="index2" :prop="key2" :label="key2">
			    	</el-table-column>
			    </el-table>
			  </el-tab-pane>
			</el-tabs>
			
			
			
		</div>
	</div>
	</div>
</template>

<script>
	import XLSX from "xlsx/dist/xlsx.core.min.js";
	
	import axios from 'axios'
	export default {
		props: {
			src: '', //文件地址
			height: 0
		},
		data() {
			return {
				tableActiveId:'',
				excelData: [],
				workbook: {},
			};
		},
		created() {
			// console.log(this.tableActiveIndex,'tableActiveIndex')
			// 具体函数调用位置根据情况而定
			this.readExcelFromRemoteFile();
			console.log(XLSX,'XLSX')
		},
		methods: {
			// 在线查看word文件
			async readExcelFromRemoteFile() {
				let res = await this.Web_api.renderFile("arraybuffer", this.src)
				var data = new Uint8Array(res);
				console.log(res, 'data')
				// 工作簿
				var workbook = XLSX.read(data, {
					type: "array"
				});
				var sheetNames = workbook.SheetNames; // 工作表名称集合
				this.workbook = workbook;
				sheetNames.forEach(item=>{
					this.getTable(item);
				})
				this.tableActiveId=this.excelData[0].id
				console.log(this.excelData,'this.excelData')
			},
			getTable(sheetName) {
				console.log(sheetName,'sheetName')
				var worksheet = this.workbook.Sheets[sheetName];
				
				this.excelData.push({
					id:String(Math.floor(Math.random()*1000*1000*1000)),
					title:sheetName,
					data:XLSX.utils.sheet_to_json(worksheet)
				})
			},
		}

	}
</script>

<style lang="scss">
	.box {
		width: 100%;
		height: 100%;


		#table {
			box-sizing: border-box;
			height: 100%;
			overflow-y: auto;
			font-family: "Avenir", Helvetica, Arial, sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			color: #2c3e50;
			margin-top: 60px;
			border: 1px solid #ebebeb;
			padding: 20px;
			width: 100%;
			margin: 20px auto;
			// border-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
			//   0 2px 4px 0 rgba(232, 237, 250, 0.5);
			border-radius: 10px;
			// overflow: scroll;
			height: 100%;

			.tab {
				margin: 0 0 20px 0;
				display: flex;
				flex-direction: row;
			}
		}

	}
</style>
