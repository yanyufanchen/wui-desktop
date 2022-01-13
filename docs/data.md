系统信息
// 查询系统数据
			let systems = {
				color: '#14173a', // 统一颜色
				wallpaper: './static/medias/desktop/3.jpg', // 壁纸
			}
桌面数据			
let desktops = {
				shortcutList: ['wui-my-computer', 'wui-app-store', 'wui-browser'], // 配置我的桌面快捷应用列表
				wallpapers: [], // 壁纸库
				lowerMenu: [], // 左下角菜单 // 关联 排序我的应用列表 可拖拽应用列表
				wuiModals: [{
						id: 0,
						app_id: 'wui-my-computer',
						show_flag: true,
						zIndex: 2,
						data: {}
					},
					{
						id: 1,
						app_id: 'wui-browser',
						show_flag: true,
						zIndex: 1,
						data: {
							list: [{
								id: 1,
								name: '搜狗搜索',
								url: 'https://www.sogou.com/',
								show: true,
							}]
						}
					},
					{
						id: 2,
						app_id: 'wui-app-store',
						show_flag: true,
						zIndex: 3,
						data: {
							
						}
					},
				]
			}
应用商店
let stores = {
				appList: [{
						app_id: 'wui-my-computer',
						title: '我的电脑',
						icon: 'fa-desktop',
						customSize: false,
						backgroundColor: 'rgb(194, 187, 183，0.3)',
						type: 'webapp', // webapp代表桌面app, webpage代表网页应用(统一走封装的公共组件读取url单页面)
					},
					{
						app_id: 'wui-app-store',
						title: '应用商店',
						customSize: false,
						icon: 'fa-shopping-bag',
						backgroundColor: 'rgb(179, 106, 186)',
						type: 'webapp',
					},
					{
						app_id: 'wui-browser',
						title: '浏览器',
						customSize: false,
						icon: 'fa-internet-explorer',
						backgroundColor: 'rgb(58, 85, 194)',
						type: 'webapp',
						default: {
							name: '搜狗搜索',
							url: 'https://www.sogou.com/',
						}
					}, {
						app_id: 'wui-calculator',
						title: '计算器',
						type: 'webapp',
						customSize: true,
						style: {
							width: 340,
							height: 450
						},
						icon: 'fa-calculator',
						backgroundColor: 'rgb(255, 85, 127)',
					}
				], // 所有应用列表
				myappList: [] // 我的应用列表
			}