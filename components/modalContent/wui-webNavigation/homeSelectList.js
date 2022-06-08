module.exports = {
	loadWebside: () => {
		return [{
				id: '1',
				name: '前端开发',
				children: [{
					id: '1-1',
					name: 'Vue',
					children: [{
						id: '1-1-1',
						name: 'Vue官网',
						url:'https://cn.vuejs.org/v2/guide/',
						description:'Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。',
						icon:''
					},{
						id: '1-1-2',
						name: 'baidu',
						url:'https://www.baidu.com',
						description:'111',
						icon:''
					}]
				}, {
					id: '1-2',
					name: 'React',
					children: []
				}, {
					id: '1-3',
					name: 'Uniapp',
					children: []
				}, {
					id: '1-4',
					name: '移动端',
					children: []
				}, {
					id: '1-5',
					name: '动画库',
					children: []
				}, {
					id: '1-6',
					name: '工具库',
					children: []
				}, {
					id: '1-7',
					name: 'UI设计',
					children: []
				}, {
					id: '1-8',
					name: '三维可视化',
					children: []
				}, {
					id: '1-9',
					name: '打包构建',
					children: []
				}]
			},
			{
				id: '2',
				name: '服务端',
				children: []
			},
			{
				id: '3',
				name: '111',
				children: []
			},
			{
				id: '4',
				name: '222',
				children: []
			},
			{
				id: '5',
				name: '软件',
				children: []
			}
		]
	}
}
