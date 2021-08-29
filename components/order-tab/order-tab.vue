<template>
	<view class="order-tab-box">
		<view class="order-tab-bottom">
			<view class="order-tab-list" v-for="(item,index) in options" :key="item.id" @click="TabClick(item.id)">
				<view class="order-tab-list-ico">
					<text v-if="item.num!=0">{{item.num}}</text>
					<image :src="item.ico" mode=""></image>
				</view>
				<view class="order-tab-list-title">
					{{item.name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		props: {
			options: {
				type: Array
			}
		},
		components: {

		},
		methods: {
			TabClick(id) {
				this.$emit('TabClick', id)
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.order-tab-box {
		width: 100%;
		// border: 1px solid #eee;
		background: #fff;


		.order-tab-bottom {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 20rpx;
			box-shadow: 0px 0px 5px 2px #f3f3f3;

			// flex-direction: row;
			.order-tab-list {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				flex: 1;
				height: 160rpx;
				// padding: 40rpx 0 ;
				font-weight: 400;

				.order-tab-list-ico {
					position: relative;
					// width: 48rpx;
					height: 48rpx;

					text {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						min-width: 29rpx;
						height: 29rpx;
						padding: 5rpx;
						border-radius: 56rpx;
						background: #E53948;
						font-size: 20rpx;
						color: #fff;
						z-index: 1;
					}


					image {
						width: 48rpx;
						height: 48rpx;
					}
				}

				.order-tab-list-title {
					font-size: 24rpx;
					margin-top: 10rpx;
					color: #000
				}
			}
		}

	}
</style>
