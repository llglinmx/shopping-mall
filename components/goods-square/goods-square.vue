<template>

	<view class="box-content-main-list paddingLR flex flex-wrap justify-between">
		<view class="box-content-main-list-li" v-for="(item,index) in dataList" :key='index'
			@click.stop="goodsDetails(item.id)">
			<view class="main-list-li-image">
				<image :src="item.pic" mode="aspectFill"></image>
			</view>
			<view class="main-list-li-title font-24">{{item.name}}</view>
			<view class="main-list-li-msg font-22">
				<text style="color:#666">销量：{{item.numberSells}}</text>
			</view>
			<view class="main-list-li-bottom flex align-center justify-between">
				<view class="list-li-bottom-left">
					<text class="font-28" style="font-weight: 600;color: #ff1f1f;">￥{{item.minPrice}}</text>
					<text class="font-24"
						style="color: #999;margin-left: 10rpx;text-decoration:line-through;">￥{{item.originalPrice}}</text>
				</view>
				<view class="list-li-bottom-right flex-center" @click.stop="shoppingIcoClick(item.id)">
					<text class="iconfont icon-gouwuche" style="color: #324B78;font-size: 40rpx;"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goods-square",
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
	.box-content-main-list {
		.box-content-main-list-li {
			margin-bottom: 20rpx;
			width: 320rpx;
			min-height: 400rpx;

			.main-list-li-image {
				image {
					width: 320rpx;
					height: 320rpx;
				}
			}

			.main-list-li-title {
				margin-top: 10rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
				color: #333;
			}

			.main-list-li-msg {
				margin: 10rpx 0;
				line-height: 24rpx;
			}
		}
	}
</style>
