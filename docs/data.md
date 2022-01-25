系统信息
// 查询系统数据
			let systems = {
				color: '#14173a', // 统一颜色
				wallpaper: 1, // 壁纸序号
				wallpapers: [], // 壁纸
			}
桌面数据			
let user = {
				shortcutList: ['wui-my-computer', 'wui-app-store', 'wui-browser'], // 配置我的桌面快捷应用列表
				wallpapers: [], // 壁纸库
				lowerMenu: [], // 左下角菜单 // 关联 排序我的应用列表 可拖拽应用列表
				myappList: [
					app_id:"wui-my-computer",
					data:{}, // 我的应用数据存储
					id:1,
					installtime:"Fri Jan 07 2022 17:50:00 GMT+0800 (中国标准时间)"

				] // 我的应用列表
				wuiModals: [
					{
						id: 0,
						app_id: 'wui-my-computer',
						show_flag: true,
						zIndex: 2,
						data: {} // 弹窗配置参数
					}
				],
				systemData :{ // 用户自定义设置
					color: '#14173a', // 统一颜色
					wallpaper: 1, // 壁纸序号
					wallpapers: [], // 壁纸
				}
			}
应用商店
let stores = [{
						app_id: 'wui-my-computer',
						title: '我的电脑',
						icon: 'fa-desktop',
						customSize: false, // false代表不自定义大小  如果为true,需要通过style来配置宽高
						backgroundColor: 'rgb(194, 187, 183，0.3)',
						type: 'systemApp', // systemApp代表系统应用, webApp代表自定义应用 ，webPage代表网页应用
					},
					{
						app_id: 'wui-calculator',
						title: '计算器',
						type: 'webApp',
						customSize: true,
						style: {
							width: 340,
							height: 450
						},
						icon: 'fa-calculator',
						backgroundColor: 'rgb(255, 85, 127)',
					}
				], // 所有应用列表