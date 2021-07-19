<template>
	<div class="uni-calendar-item__weeks-box" :class="{
		'uni-calendar-item--disable':weeks.disable,
		'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
		'uni-calendar-item--checked':(calendar.fullDate === weeks.fullDate && !weeks.isDay) ,
		'uni-calendar-item--before-checked':weeks.beforeMultiple,
		'uni-calendar-item--multiple': weeks.multiple,
		'uni-calendar-item--after-checked':weeks.afterMultiple,
		}"
	 @click="choiceDate(weeks)">
		<div class="uni-calendar-item__weeks-box-item">
			<span v-if="selected&&weeks.extraInfo" class="uni-calendar-item__weeks-box-circle"></span>
			<span class="uni-calendar-item__weeks-box-span" :class="{
				'uni-calendar-item--isDay-span': weeks.isDay,
				'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
				'uni-calendar-item--before-checked':weeks.beforeMultiple,
				'uni-calendar-item--multiple': weeks.multiple,
				'uni-calendar-item--after-checked':weeks.afterMultiple,
				'uni-calendar-item--disable':weeks.disable,
				}">{{weeks.date}}</span>
			<span v-if="!lunar&&!weeks.extraInfo && weeks.isDay" class="uni-calendar-item__weeks-lunar-span" :class="{
				'uni-calendar-item--isDay-span':weeks.isDay,
				'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
				'uni-calendar-item--before-checked':weeks.beforeMultiple,
				'uni-calendar-item--multiple': weeks.multiple,
				'uni-calendar-item--after-checked':weeks.afterMultiple,
				}">今天</span>
			<span v-if="lunar&&!weeks.extraInfo" class="uni-calendar-item__weeks-lunar-span" :class="{
				'uni-calendar-item--isDay-span':weeks.isDay,
				'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
				'uni-calendar-item--before-checked':weeks.beforeMultiple,
				'uni-calendar-item--multiple': weeks.multiple,
				'uni-calendar-item--after-checked':weeks.afterMultiple,
				'uni-calendar-item--disable':weeks.disable,
				}">{{weeks.isDay?'今天': (weeks.lunar.IDayCn === '初一'?weeks.lunar.IMonthCn:weeks.lunar.IDayCn)}}</span>
			<span v-if="weeks.extraInfo&&weeks.extraInfo.info" class="uni-calendar-item__weeks-lunar-span" :class="{
				'uni-calendar-item--extra':weeks.extraInfo.info,
				'uni-calendar-item--isDay-span':weeks.isDay,
				'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
				'uni-calendar-item--before-checked':weeks.beforeMultiple,
				'uni-calendar-item--multiple': weeks.multiple,
				'uni-calendar-item--after-checked':weeks.afterMultiple,
				'uni-calendar-item--disable':weeks.disable,
				}">{{weeks.extraInfo.info}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			weeks: {
				type: Object,
				default () {
					return {}
				}
			},
			calendar: {
				type: Object,
				default: () => {
					return {}
				}
			},
			selected: {
				type: Array,
				default: () => {
					return []
				}
			},
			lunar: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			choiceDate(weeks) {
				this.$emit('change', weeks)
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
	$uni-font-size-sm:12px;
	$uni-font-size-base:16px;
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
	.uni-calendar-item__weeks-box {
		// flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		cursor: pointer;
	}

	.uni-calendar-item__weeks-box-span {
		font-size: $uni-font-size-base;
		color: $uni-span-color;
	}

	.uni-calendar-item__weeks-lunar-span {
		font-size: $uni-font-size-sm;
		color: $uni-span-color;
	}

	.uni-calendar-item__weeks-box-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100rpx;
		height: 100rpx;
	}

	.uni-calendar-item__weeks-box-circle {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 8px;
		height: 8px;
		border-radius: 8px;
		background-color: $uni-color-error;
	}

	.uni-calendar-item--disable {
		background-color: rgba(249, 249, 249, $uni-opacity-disabled);
		color: $uni-span-color-disable;
	}

	.uni-calendar-item--isDay-span {
		color: $uni-color-primary;
	}

	.uni-calendar-item--isDay {
		background-color: $uni-color-primary;
		opacity: 0.8;
		color: #fff;
	}

	.uni-calendar-item--extra {
		color: $uni-color-error;
		opacity: 0.8;
	}

	.uni-calendar-item--checked {
		background-color: $uni-color-primary;
		color: #fff;
		opacity: 0.8;
	}

	.uni-calendar-item--multiple {
		background-color: $uni-color-primary;
		color: #fff;
		opacity: 0.8;
	}
	.uni-calendar-item--before-checked {
		background-color: #ff5a5f;
		color: #fff;
	}
	.uni-calendar-item--after-checked {
		background-color: #ff5a5f;
		color: #fff;
	}
</style>
