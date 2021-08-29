<template>
	<view class="box-content-wrap-list paddingLR">
		<view class="box-content-wrap-list-item flex align-center" v-for="(item,index) in dataList" :key='index'
			@click.stop="goodsDetails(item.id)">
			<view class="wrap-list-item-image">
				<image :src="item.pic" mode="aspectFill"></image>
			</view>
			<view class="wrap-list-item-info flex-1 flex flex-direction justify-around">
				<view class="wrap-list-item-info-title font-24">
					{{item.name}}
				</view>
				<view class="wrap-list-item-info-msg font-22">
					<text>销量：{{item.numberSells}}</text>
				</view>
				<view class="wrap-list-item-info-bottom flex justify-between align-center">
					<view class="info-bottom-left">
						<text class="font-28" style="font-weight: 600;color: #ff1f1f;">￥{{item.minPrice}}</text>
						<text class="font-24"
							style="color: #999;margin-left: 10rpx;text-decoration:line-through;">￥{{item.originalPrice}}</text>
					</view>
					<view class="info-bottom-ico flex-center" @click.stop="shoppingIcoClick(item.id)">
						<text class="iconfont icon-gouwuche" style="color: #324B78;font-size: 40rpx;"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goods-list",
		data() {
			return {

			};
		},
		props: {
			dataList: {
				type: Array,
				default: () => ({})
			},
		},
		methods: {
			// 详情
			goodsDetails(id) {
				this.$emit('details', id)
			},
			// 购物车点击
			shoppingIcoClick(id) {
				this.$emit('clickShopping', id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-content-wrap-list {
		.box-content-wrap-list-item {
			margin-bottom: 32rpx;

			.wrap-list-item-image {
				image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 6rpx;
				}
			}

			.wrap-list-item-info {
				margin-left: 20rpx;

				.wrap-list-item-info-title {
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.wrap-list-item-info-msg {
					margin: 10rpx 0;
					line-height: 24rpx;
					color: #999;
				}
			}
		}

		.box-content-wrap-list-item:last-child {
			margin-bottom: 0;
		}
	}
</style>
