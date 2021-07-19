<template>
	<div class="uni-calendar">
		<div v-if="!insert&&show" class="uni-calendar__mask" :class="{'uni-calendar--mask-show':aniMaskShow}" @click="clean"></div>
		<div v-if="insert || show" class="uni-calendar__content" :class="{'uni-calendar--fixed':!insert,'uni-calendar--ani-show':aniMaskShow}">
			<div v-if="!insert" class="uni-calendar__header uni-calendar--fixed-top">
				<div class="uni-calendar__header-btn-box" @click="close">
					<span class="uni-calendar__header-span uni-calendar--fixed-width">取消</span>
				</div>
				<div class="uni-calendar__header-btn-box" @click="confirm">
					<span class="uni-calendar__header-span uni-calendar--fixed-width">确定</span>
				</div>
			</div>
			<div class="uni-calendar__header">
				<div class="uni-calendar__header-btn-box" @click.stop="pre">
					<div class="uni-calendar__header-btn uni-calendar--left"></div>
				</div>
<!-- 				<picker mode="date" :value="date" fields="month" @change="bindDateChange">
					<span class="uni-calendar__header-span">{{ (nowDate.year||'') +'年'+( nowDate.month||'') +'月'}}</span>
				</picker> -->
				<span class="uni-calendar__header-span">{{ (nowDate.year||'') +'年'+( nowDate.month||'') +'月'}}</span>
				<div class="uni-calendar__header-btn-box" @click.stop="next">
					<div class="uni-calendar__header-btn uni-calendar--right"></div>
				</div>
				<span class="uni-calendar__backtoday" @click="backtoday">回到今天</span>
			</div>

			
			
			<div class="uni-calendar__box">
				<div v-if="showMonth" class="uni-calendar__box-bg">
					<span class="uni-calendar__box-bg-span">{{nowDate.month}}</span>
				</div>
				<div class="uni-calendar__weeks">
					<div class="uni-calendar__weeks-day">
						<span class="uni-calendar__weeks-day-span">{{type==0?"日":"周日"}}</span>
					</div>
					<div class="uni-calendar__weeks-day">
						<span class="uni-calendar__weeks-day-span">{{type==0?"一":"周一"}}</span>
					</div>
					<div class="uni-calendar__weeks-day">
						<span class="uni-calendar__weeks-day-span">{{type==0?"二":"周二"}}</span>
					</div>
					<div class="uni-calendar__weeks-day">
						<span class="uni-calendar__weeks-day-span">{{type==0?"三":"周三"}}</span>
					</div>
					<div class="uni-calendar__weeks-day">
						<span class="uni-calendar__weeks-day-span">{{type==0?"四":"周四"}}</span>
					</div>
					<div class="uni-calendar__weeks-day">
						<span class="uni-calendar__weeks-day-span">{{type==0?"五":"周五"}}</span>
					</div>
					<div class="uni-calendar__weeks-day">
						<span class="uni-calendar__weeks-day-span">{{type==0?"六":"周六"}}</span>
					</div>
				</div>
				<div class="uni-calendar__weeks" v-for="(item,weekIndex) in weeks" :key="weekIndex">
					<div class="uni-calendar__weeks-item" v-for="(weeks,weeksIndex) in item" :key="weeksIndex">
						<calendar-item class="uni-calendar-item--hook" :weeks="weeks" :calendar="calendar" :selected="selected" :lunar="lunar" @change="choiceDate"></calendar-item>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Calendar from './util.js';
	import calendarItem from './uni-calendar-item.vue'
	/**
	 * Calendar 日历
	 * @description 日历组件可以查看日期，选择任意范围内的日期，打点操作。常用场景如：酒店日期预订、火车机票选择购买日期、上下班打卡等
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=56
	 * @property {String} date 自定义当前时间，默认为今天
	 * @property {Boolean} lunar 显示农历
	 * @property {String} startDate 日期选择范围-开始日期
	 * @property {String} endDate 日期选择范围-结束日期
	 * @property {Boolean} range 范围选择
	 * @property {Boolean} insert = [true|false] 插入模式,默认为false
	 * 	@value true 弹窗模式
	 * 	@value false 插入模式
	 * @property {Boolean} clearDate = [true|false] 弹窗模式是否清空上次选择内容
	 * @property {Array} selected 打点，期待格式[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]
	 * @property {Boolean} showMonth 是否选择月份为背景
	 * @event {Function} change 日期改变，`insert :ture` 时生效
	 * @event {Function} confirm 确认选择`insert :false` 时生效
	 * @event {Function} monthSwitch 切换月份时触发
	 * @example <uni-calendar :insert="true":lunar="true" :start-date="'2019-3-2'":end-date="'2019-5-20'"@change="change" />
	 */
	export default {
		components: {
			calendarItem
		},
		props: {
			date: {
				type: String,
				default: ''
			},
			selected: {
				type: Array,
				default () {
					return []
				}
			},
			lunar: {
				type: Boolean,
				default: false
			},
			startDate: {
				type: String,
				default: ''
			},
			endDate: {
				type: String,
				default: ''
			},
			range: {
				type: Boolean,
				default: false
			},
			insert: {
				type: Boolean,
				default: true
			},
			showMonth: {
				type: Boolean,
				default: true
			},
			clearDate: {
				type: Boolean,
				default: true
			},
			type : Number
		},
		data() {
			return {
				show: false,
				weeks: [],
				calendar: {},
				nowDate: '',
				aniMaskShow: false
			}
		},
		watch: {
			date(newVal) {
				// this.cale.setDate(newVal)
				this.init(newVal)
			},
			startDate(val){
				this.cale.resetSatrtDate(val)
			},
			endDate(val){
				this.cale.resetEndDate(val)
			},
			selected(newVal) {
				this.cale.setSelectInfo(this.nowDate.fullDate, newVal)
				this.weeks = this.cale.weeks
			}
		},
		created() {
			// 获取日历方法实例
			this.cale = new Calendar({
				// date: new Date(),
				selected: this.selected,
				startDate: this.startDate,
				endDate: this.endDate,
				range: this.range,
			})
			// 选中某一天
			// this.cale.setDate(this.date)
			this.init(this.date)
			// this.setDay
		},
		methods: {
			// 取消穿透
			clean() {},
			bindDateChange(e) {
				const value = e.detail.value + '-1'
				console.log(this.cale.getDate(value));
				this.init(value)
			},
			/**
			 * 初始化日期显示
			 * @param {Object} date
			 */
			init(date) {
				this.cale.setDate(date)
				this.weeks = this.cale.weeks
				this.nowDate = this.calendar = this.cale.getInfo(date)
			},
			/**
			 * 打开日历弹窗
			 */
			open() {
				// 弹窗模式并且清理数据
				if (this.clearDate && !this.insert) {
					this.cale.cleanMultipleStatus()
					// this.cale.setDate(this.date)
					this.init(this.date)
				}
				this.show = true
				this.$nextTick(() => {
					setTimeout(() => {
						this.aniMaskShow = true
					}, 50)
				})
			},
			/**
			 * 关闭日历弹窗
			 */
			close() {
				this.aniMaskShow = false
				this.$nextTick(() => {
					setTimeout(() => {
						this.show = false
						this.$emit('close')
					}, 300)
				})
			},
			/**
			 * 确认按钮
			 */
			confirm() {
				this.setEmit('confirm')
				this.close()
			},
			/**
			 * 变化触发
			 */
			change() {
				if (!this.insert) return
				this.setEmit('change')
			},
			/**
			 * 选择月份触发
			 */
			monthSwitch() {
				let {
					year,
					month
				} = this.nowDate
				this.$emit('monthSwitch', {
					year,
					month: Number(month)
				})
			},
			/**
			 * 派发事件
			 * @param {Object} name
			 */
			setEmit(name) {
				let {
					year,
					month,
					date,
					fullDate,
					lunar,
					extraInfo
				} = this.calendar
				this.$emit(name, {
					range: this.cale.multipleStatus,
					year,
					month,
					date,
					fulldate: fullDate,
					lunar,
					extraInfo: extraInfo || {}
				})
			},
			/**
			 * 选择天触发
			 * @param {Object} weeks
			 */
			choiceDate(weeks) {
				if (weeks.disable) return
				this.calendar = weeks
				// 设置多选
				this.cale.setMultiple(this.calendar.fullDate)
				this.weeks = this.cale.weeks
				this.change()
			},
			/**
			 * 回到今天
			 */
			backtoday() {
				console.log(this.cale.getDate(new Date()).fullDate);
				let date = this.cale.getDate(new Date()).fullDate
				// this.cale.setDate(date)
				this.init(date)
				this.change()
				this.$emit("backtoday")
			},
			/**
			 * 上个月
			 */
			pre() {
				const preDate = this.cale.getDate(this.nowDate.fullDate, -1, 'month').fullDate
				this.setDate(preDate)
				this.monthSwitch()
				this.$emit('pre',preDate)
			},
			/**
			 * 下个月
			 */
			next() {
				const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, 'month').fullDate
				this.setDate(nextDate)
				this.monthSwitch()
				this.$emit('next',nextDate)
			},
			/**
			 * 设置日期
			 * @param {Object} date
			 */
			setDate(date) {
				this.cale.setDate(date)
				this.weeks = this.cale.weeks
				this.nowDate = this.cale.getInfo(date)
			}
		}
	}
</script>

<style lang="scss" scoped>     
	/* 行为相关颜色 */
	$uni-color-primary: #007aff;
	$uni-color-success: #4cd964;
	$uni-color-warning: #f0ad4e;
	$uni-color-error: #dd524d;
	
	/* 文字基本颜色 */
	$uni-span-color:#333;//基本色
	$uni-span-color-inverse:#fff;//反色
	$uni-span-color-grey:#999;//辅助灰色，如加载更多的提示信息
	$uni-span-color-placeholder: #808080;
	$uni-span-color-disable:#c0c0c0;
	
	/* 背景颜色 */
	$uni-bg-color:#ffffff;
	$uni-bg-color-grey:#f8f8f8;
	$uni-bg-color-hover:#f1f1f1;//点击状态颜色
	$uni-bg-color-mask:rgba(0, 0, 0, 0.4);//遮罩颜色
	
	/* 边框颜色 */
	$uni-border-color:#c8c7cc;
	
	/* 尺寸变量 */
	
	/* 文字尺寸 */
	$uni-font-size-sm:24rpx;
	$uni-font-size-base:28rpx;
	$uni-font-size-lg:32rpx;
	
	/* 图片尺寸 */
	$uni-img-size-sm:40rpx;
	$uni-img-size-base:52rpx;
	$uni-img-size-lg:80rpx;
	
	/* Border Radius */
	$uni-border-radius-sm: 4rpx;
	$uni-border-radius-base: 6rpx;
	$uni-border-radius-lg: 12rpx;
	$uni-border-radius-circle: 50%;
	
	/* 水平间距 */
	$uni-spacing-row-sm: 10px;
	$uni-spacing-row-base: 20rpx;
	$uni-spacing-row-lg: 30rpx;
	
	/* 垂直间距 */
	$uni-spacing-col-sm: 8rpx;
	$uni-spacing-col-base: 16rpx;
	$uni-spacing-col-lg: 24rpx;
	
	/* 透明度 */
	$uni-opacity-disabled: 0.3; // 组件禁用态的透明度
	
	/* 文章场景相关 */
	$uni-color-title: #2C405A; // 文章标题颜色
	$uni-font-size-title:40rpx;
	$uni-color-subtitle: #555555; // 二级标题颜色
	$uni-font-size-subtitle:36rpx;
	$uni-color-paragraph: #3F536E; // 文章段落颜色
	$uni-font-size-paragraph:30rpx;
	.uni-calendar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-calendar__mask {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-color: $uni-bg-color-mask;
		transition-property: opacity;
		transition-duration: 0.3s;
		opacity: 0;
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--mask-show {
		opacity: 1
	}

	.uni-calendar--fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		transition-property: transform;
		transition-duration: 0.3s;
		transform: translateY(460px);
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--ani-show {
		transform: translateY(0);
	}

	.uni-calendar__content {
		background-color: #fff;
	}

	.uni-calendar__header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50px;
		border-bottom-color: $uni-border-color;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}
	.myHead{
		justify-content: space-between !important;
	}

	.uni-calendar--fixed-top {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		border-top-color: $uni-border-color;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-calendar--fixed-width {
		width: 50px;
		// padding: 0 15px;
	}

	.uni-calendar__backtoday {
		position: absolute;
		right: 0;
		top: 25rpx;
		padding: 0 5px;
		padding-left: 10px;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
		color: $uni-span-color;
		background-color: $uni-bg-color-hover;
		cursor: pointer;
	}

	.uni-calendar__header-span {
		text-align: center;
		width: 100px;
		font-size: $uni-font-size-base;
		color: $uni-span-color;
	}

	.uni-calendar__header-btn-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		cursor: pointer;
	}

	.uni-calendar__header-btn {
		width: 10px;
		height: 10px;
		border-left-color: $uni-span-color-placeholder;
		border-left-style: solid;
		border-left-width: 2px;
		border-top-color: $uni-color-subtitle;
		border-top-style: solid;
		border-top-width: 2px;
		cursor: pointer;
	}

	.uni-calendar--left {
		transform: rotate(-45deg);
	}

	.uni-calendar--right {
		transform: rotate(135deg);
	}


	.uni-calendar__weeks {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;  
	}

	.uni-calendar__weeks-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.uni-calendar__weeks-day {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 45px;
		border-bottom-color: #F5F5F5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	.uni-calendar__weeks-day-span {
		font-size: 14px;
	}

	.uni-calendar__box {
		position: relative;
	}

	.uni-calendar__box-bg {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.uni-calendar__box-bg-span {
		font-size: 200px;
		font-weight: bold;
		color: $uni-span-color-grey;
		opacity: 0.1;
		text-align: center;
		/* #ifndef APP-NVUE */
		line-height: 1;
		/* #endif */
	}
</style>
