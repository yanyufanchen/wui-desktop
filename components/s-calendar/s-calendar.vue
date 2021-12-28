<template>
	<view>
		<div class="time">{{currentTime}}</div>
		<div class="date">{{currentDate}}</div>
		<!-- 月份 -->
		<view class="month">
			<image src="./calendar-jiantou.png" mode="widthFix" @click="lastMonth"></image>
			<view>{{year+'.'+month}}</view>
			<image src="./calendar-jiantou.png" mode="widthFix" @click="nextMonth"></image>
		</view>
		<!-- 周 -->
		<view class="week">
			<view :class="'i '+[index==0|| index==week.length-1?'i1':'']" v-for="(item,index) in week" :key="index">
				{{item}}
			</view>
		</view>
		<!-- 天 -->
		<view class="day">
			<view class="i" v-for="(item,index) in dayList" :key="index">
				<div class="item active" v-if="item==day&&checkDay()">{{item}}</div>
				<div class="item" v-else>{{item}}</div>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				year: '',
				month: '',
				day: '',
				currentTime: '', // 获取当前时间
				currentDate:'',
				timer: "", //定义一个定时器的变量
				week: ['日', '一', '二', '三', '四', '五', '六'],
				dayList: [],
			}
		},
		watch: {
			month: function() {
				this.setDay();
			},
			
		},
		created() {
			this.setNow();
			this.currentTime =this.getcurrentTime()
			this.currentDate =this.getcurrentDate()+`,${this.getWeekDate()}`
			this.timer = setInterval(()=> {
				this.currentTime =this.getcurrentTime()
			}, 1000);
			this.checkDay()
		},
		methods: {
			/**
			 * 设置当前年月日
			 */
			setNow() {
				let date = new Date();
				this.year = date.getFullYear();
				this.month = date.getMonth() + 1;
				this.day = date.getDate();
			},
			/**
			 * 下一个月
			 */
			nextMonth() {
				if (this.month + 1 > 12) {
					this.year = this.year + 1;
					this.month = 1;
				} else {
					this.month = this.month + 1;
				}
				this.checkDay()
			},
			/**
			 * 上一个月
			 */
			lastMonth() {
				if (this.month - 1 < 1) {
					this.year = this.year - 1;
					this.month = 12;
				} else {
					this.month = this.month - 1;
				}
				this.checkDay()
			},
			/**
			 * 设置日历天
			 */
			setDay() {
				let date = new Date(this.year, this.month - 1, 1);
				let date1 = new Date(this.year, this.month, 0);
				//获取当前月第一天是周几，0等于周日
				let oneDay = date.getDay();
				//获取当前月天数
				let monthDay = date1.getDate();
				let dayList = [];
				for (var i = 0; i < oneDay; i++) {
					dayList.push('')
				}
				for (var i = 0; i < monthDay; i++) {
					dayList.push(i + 1)
				}
				this.dayList = dayList;
			},
			// 检测是否是当天
			checkDay(){
				let year=this.year
				let month=String(this.month).length==2?String(this.month):`0${String(this.month)}`
				let day=String(this.day).length==2?String(this.day):`0${String(this.day)}`
				let date=`${year}/${month}/${day}`
				return this.getcurrentDate()==date
			},
			// 获取周
			getWeekDate() {
				var now = new Date();
				var day = now.getDay();
				var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
				var week = weeks[day];
				return week;
			},
			// 获取当前时间
			getcurrentTime() {
				let hours=String(new Date().getHours()).length==2?String(new Date().getHours()):`0${String(new Date().getHours())}`
				let minutes=String(new Date().getMinutes()).length==2?String(new Date().getMinutes()):`0${String(new Date().getMinutes())}`
				let seconds=String(new Date().getSeconds()).length==2?String(new Date().getSeconds()):`0${String(new Date().getSeconds())}`
				return `${hours}:${minutes}:${seconds}`
			},
			// 获取当前日期
			getcurrentDate() {
				let now = new Date();
				let year=now.getFullYear()
				let month=String(new Date().getMonth()+1).length==2?String(new Date().getMonth()+1):`0${String(new Date().getMonth()+1)}`
				let day=String(new Date().getDate()).length==2?String(new Date().getDate()):`0${String(new Date().getDate())}`
				return `${year}/${month}/${day}`
			}
		},
		beforeDestroy() {
		
		    if (this.timer) {
		
		      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
		
		    }
		
		  }
	}
</script>

<style>
	/* 当天 */
	.active {
		box-shadow: inset 0 0 0 0.1rem rgb(255 255 255 / 36%), inset 0 0 0 0.2rem rgb(255 255 255 / 30%);
		background-color: rgba(255, 255, 255, 0.25);
	}
	.time {
		color: #fff;
		font-size: 30px;
		padding: 0 10px;
	}
	.date {
		color: #aaa;
		font-size: 15px;
		padding: 0 10px;
	}
	.month {
		display: flex;
		margin-top: 40rpx;
		justify-content: space-between;
		align-items: center;
		height: 28rpx;
		padding: 0 70rpx;
	}

	.month image {
		width: 26rpx;
	}

	.month image:nth-child(1) {
		transform: rotate(180deg);
	}

	.month view {
		height: 28rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #fff;
		line-height: 28rpx;
		letter-spacing: 2rpx;
	}

	.week {
		display: flex;
		margin-top: 20rpx;
		text-align: center;
	}

	.week .i {
		width: 14.28%;
		font-size: 28rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #fff;
		line-height: 40rpx;
	}

	.week .i1 {
		color: #00CDCD;
	}

	.day {
		display: flex;
		flex-wrap: wrap;
	}

	.day .i {
		width: 14.28%;
		text-align: center;
		margin-top: 40rpx;
		color: #fff;
		font-size: 34rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		/* font-weight: 600; */
		line-height: 68rpx;
		letter-spacing: 2rpx;
	}
</style>
