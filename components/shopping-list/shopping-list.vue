<template>
	<view class="shopping-box">
		<uni-swipe-action>
			<uni-swipe-action-item class="action-item" v-for="(item,index) in list" :key='index'
				:right-options="options" @click="onClick($event, index,item.key)">
				<view class="shopping-box-item flex align-center" @click="checkList(index)">
					<view class="shopping-box-item-left">
						<uni-icons type="circle" size="20" color="#324B78" v-if="!item.isFlag"></uni-icons>
						<uni-icons type="circle-filled" size="20" color="#324B78" v-if="item.isFlag"></uni-icons>
					</view>
					<view class="shopping-box-item-info flex-1 flex align-center">
						<view class="item-info-image flex-center">
							<image :src="item.pic" mode="aspectFill"></image>
						</view>
						<view class="item-info-data flex-1 justify-around flex-direction">
							<view class="item-info-data-title font-26">{{item.name}}</view>
							<view class="item-info-data-msg font-24">
								<view v-if="item.sku">
									<text v-for="(el,i) in item.sku" :key="el.optionId">
										{{el.optionName}}:{{el.optionValueName}}, </text>
								</view>
							</view>
							<view class="item-info-data-bottom flex align-center justify-between">
								<view class="item-info-data-bottom-price" style="color: #ff1f1f;">
									<text class="font-24">￥</text>
									<text class="font-30" style="font-weight: 600">{{item.price}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
	export default {
		name: "shopping-list",
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#c10000'
					}
				}],
				list: []
			};
		},
		props: {
			dataList: {
				type: Array,
				default: () => ({})
			}
		},
		watch: {
			dataList(val) {
				this.list = val
			}
		},
		mounted() {
			this.list = this.dataList
		},
		methods: {
			// 删除按钮
			onClick(e, index, key) {
				this.$emit('del', key)
			},
			// 列表点击
			checkList(index) {
				this.list[index].isFlag = !this.list[index].isFlag

				let list = this.list.filter(res => res.isFlag)
				this.$emit('data', list)

			},
		}
	}
</script>

<style lang="scss" scoped>
	.shopping-box {
		width: 100%;


		.action-item {
			height: 200rpx;

			.shopping-box-item {
				width: 100%;
				padding: 20rpx 32rpx;
				box-sizing: border-box;

				.shopping-box-item-left {
					width: 80rpx;
				}

				.shopping-box-item-info {
					.item-info-image {
						image {
							width: 160rpx;
							height: 160rpx;
						}
					}

					.item-info-data {
						margin-left: 20rpx;

						.item-info-data-title {
							color: #333;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
						}

						.item-info-data-msg {
							margin: 10rpx 0;
							color: #999;
							line-height: 24rpx;
						}
					}
				}
			}
		}
	}
</style>
