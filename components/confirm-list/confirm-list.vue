<template>
	<view class="order-content-list">
		<view class="order-list-title">
			商品列表<text>共 {{totalNum}} 件商品</text>
		</view>
		<view class="order-list-li" v-for="(item,index) in list" :key="item.id">
			<view class="order-list-li-img">
				<image :src="item.pic" mode="aspectFill"></image>
			</view>
			<view class="order-list-ii-info flex flex-direction justify-between">
				<view class="order-list-info-title font-24">
					{{item.name}}
				</view>
				<view class="order-list-info-specs">
					<view v-if="item.sku">
						<text v-for="(el,i) in item.sku" :key="el.optionId"> {{el.optionName}}:{{el.optionValueName}},
						</text>
					</view>
					<!-- {{item.property}} -->
				</view>
				<view class="order-list-info-bottom">
					<view class="order-list-info-price">
						￥<text>{{item.price |priceTow}}</text>
					</view>
					<view class="order-list-info-num">
						x {{item.number}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		props: {
			goodsList: {}
		},
		watch: {
			goodsList(val) {
				this.list = val
			}
		},
		// 过滤器
		filters: {
			priceTow(value) {
				return value.toFixed(2)
			}
		},
		mounted() {
			this.list = this.goodsList
		},

		computed: {
			// 计算商品总数量
			totalNum() {
				let num = 0
				this.list.forEach(item => {
					num += item.number
				})
				return num
			},
		},
	}
</script>

<style lang="scss" scoped>
	.order-content-list {
		background: #fff;
		padding: 0 32rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;

		.order-list-title {
			display: flex;
			align-items: center;
			padding: 32rpx 0;
			color: #000;
			font-size: 28rpx;

			text {
				color: #666;
				font-size: 24rpx;
				margin-left: 15rpx;
			}
		}

		.order-list-li {
			display: flex;
			align-items: center;
			height: 160rpx;
			margin-bottom: 40rpx;

			.order-list-li-img {
				width: 160rpx;
				height: 160rpx;
				border-radius: 12rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 12rpx;
				}
			}

			.order-list-ii-info {
				flex: 1;
				height: 100%;
				margin-left: 24rpx;

				.order-list-info-title {
					font-weight: 400;
					color: #000;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.order-list-info-specs {
					font-size: 20rpx;
					color: #999;
				}

				.order-list-info-bottom {
					display: flex;
					justify-content: space-between;

					.order-list-info-price {
						font-size: 20rpx;
						font-weight: 500;
						color: #E53948;

						text {
							font-size: 28rpx;
						}
					}

					.order-list-info-num {
						font-size: 28rpx;
						color: #000;
					}
				}
			}
		}

		.order-list-li:last-child {
			margin-bottom: 0;
		}
	}
</style>
