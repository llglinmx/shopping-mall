<template>

	<view class="list paddingLR">
		<view class="list-li" v-for="(item,index) in dataList" :key='index'>
			<view class="list-li-title font-32 flex-center">
				<text class="text-title">{{item.name}}</text>
			</view>
			<view class="list-li-main">
				<view class="list-li-main-item flex align-center" v-for="(ele,idx) in item.data" :key='ele.id'
					@click="goodsDetails(ele.id)">
					<view class="list-li-main-item-image flex-center">
						<image :src="ele.pic" mode=""></image>
					</view>
					<view class="list-li-main-item-info flex-1 flex flex-direction justify-around">
						<view class="list-li-main-item-info-top font-24">{{ele.name}}</view>
						<view class="list-li-main-item-info-center font-24">销量：200</view>
						<view class="list-li-main-item-info-bottom flex align-center justify-between">
							<view class="info-bottom-pirce font-32">
								<text>￥{{ele.minPrice}}</text>
							</view>
							<view class="info-bottom-ico" @click.stop="shoppingIcoClick(ele.id)">
								<text class="iconfont icon-gouwuche" style="color: #324B78;font-size: 40rpx;"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "data-list",
		data() {
			return {

			};
		},
		props: {
			dataList: {
				type: Array,
				default: () => ({})
			}
		},
		mounted() {

		},
		methods: {
			// 进入商品详情页面
			goodsDetails(id) {
				uni.navigateTo({
					url: '../../pagesSort/goodsDetails/goodsDetails?id=' + id
				})
			},
			// 购物车点击
			shoppingIcoClick(id) {
				this.$emit('clickShopping', id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {

		.list-li {
			.list-li-title {
				margin: 30rpx 0;
				font-weight: 500;

				.text-title {
					position: relative;
				}

				.text-title::after,
				.text-title::before {
					position: absolute;
					top: 0;
					bottom: 0;
					margin: auto;
					content: '';
					width: 60rpx;
					height: 1px;
					background: #000;
				}

				.text-title::after {
					right: -70rpx
				}

				.text-title::before {
					left: -70rpx
				}
			}

			.list-li-main {
				.list-li-main-item {
					margin-bottom: 20rpx;

					.list-li-main-item-image {

						image {
							width: 160rpx;
							height: 160rpx;
							border-radius: 10rpx;
						}
					}

					.list-li-main-item-info {
						margin-left: 20rpx;
						height: 160rpx;

						.list-li-main-item-info-top {
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
							color: #000;
						}

						.list-li-main-item-info-center {
							color: #666;
						}

						.list-li-main-item-info-bottom {
							.info-bottom-pirce {
								color: #ff1414;
								font-weight: 600;
							}

							.info-bottom-ico {
								image {
									width: 42rpx;
									height: 42rpx;
								}
							}
						}
					}
				}

				.list-li-main-item:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
</style>
