<template>
	<view class="order-title-box">
		<view class="order-box-title">
			{{msg}}
		</view>
	</view>
</template>

<script>
	export default{
		data(){return{}},
		props:{
			msg:{
				type:String,
				default:'标题文字'
			}
		}
	}
</script>

<style lang="scss">
	.order-title-box{
		.order-box-title{
			position: relative;
			// height: 80rpx;
			// padding: 20rpx 0;
			color: #000;
			font-weight: 600;
			padding-left: 30rpx;
			// line-height: 80rpx;
			font-size: 32rpx;
		}
		.order-box-title::after{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			margin: auto;
			content: '';
			width: 8rpx;
			height: 34rpx;
			background: #314B77;
			border-radius: 4rpx;
		}
	}
</style>