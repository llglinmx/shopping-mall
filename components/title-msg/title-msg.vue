<template>
	<view class="discount-title flex-center">
		<view class="discount-title-wrap flex align-center">
			<view class="discount-title-bg-text font-28">
				推荐
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "title-msg",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.discount-title {
		padding: 40rpx 0;

		.discount-title-wrap {
			position: relative;
			width: 100rpx;
			height: 40rpx;
			font-weight: 500;
			font-style: oblique;


			.discount-title-bg-text {
				width: 88rpx;
				height: 40rpx;
				margin-left: 5rpx;
				line-height: 40rpx;
				text-align: center;
				color: #fff;
				background: url(../../static/images/11.png) no-repeat;
				background-size: contain;
			}

			&.discount-title-wrap::after {
				position: absolute;
				top: 0;
				left: -120rpx;
				bottom: 0;
				margin: auto;
				content: '';
				width: 100rpx;
				height: 3rpx;
				background: #324B78;
			}

			&.discount-title-wrap::before {
				position: absolute;
				top: 0;
				right: -120rpx;
				bottom: 0;
				margin: auto;
				content: '';
				width: 100rpx;
				height: 3rpx;
				background: #324B78;
			}
		}
	}
</style>
