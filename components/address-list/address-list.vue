<template>
	<view class="main-box">
		<view style="height: 100%;background: rgba(255,255,255,0.8);" v-if="!isLoad">
			<loading />
		</view>
		<z-paging ref="paging" @query="queryList" :list.sync="dataList" :use-custom-refresher="true"
			style="height: 100%;" :fixed='false' emptyViewText='暂无收货地址' :hide-loading-more-when-no-more-by-limit='limitNums' refresher-threshold='140rpx'>
			<custom-refresher slot="refresher" slot-scope="{refresherStatus}" :status="refresherStatus" />
			<view class="address-list paddingLR" v-if="isLoad">
				<view class="address-list-li paddingLR" v-for="(item,index) in dataList" :key='index'>
					<view class="address-list-li-main flex align-center justify-between">
						<view class="address-list-li-info flex flex-direction justify-between">
							<view class="list-li-info-top flex align-center">
								<text class="font-26" style="color:#888686">{{item.linkMan}} {{item.mobile}}</text>
							</view>
							<view class="list-li-info-center font-28" style="margin-top:10rpx;color: #333;">
								{{item.provinceStr}}{{item.cityStr}}{{item.areaStr}}{{item.address}}
							</view>
						</view>
						<view class="address-list-li-edit">

						</view>
					</view>
					<view class="address-list-li-bottom flex align-center justify-between">
						<view class="list-li-bottom-left"></view>
						<view class="list-li-bottom-right font-24" style="color: #b50000;"
							@click="deleteAddress(item.id)">
							删除
						</view>
					</view>

				</view>
			</view>
		</z-paging>
	</view>

</template>

<script>
	export default {
		name: "address-list",
		data() {
			return {
				dataList: [],
				isLoad: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ef2c35'
					}
				}],
				limitNums:5,//小于五条不显示底部提示
			};
		},
		methods: {
			queryList(pageNo, pageSize) {
				if (this.dataList.length == 0) {
					this.isLoad = false
				}
				this.apiget('user/shipping-address/list', {
					"token": uni.getStorageSync("token"),
				}).then(res => {
					this.isLoad = true
					let list = res.data
					this.$refs.paging.addData(list);
				})
			},
			// :mounted-auto-call-reload="false"
			deleteAddress(id) {
				this.$emit('clickDelete', id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-box {
		height: 100%;

		.address-list {
			.address-list-li {
				width: 100%;
				min-height: 140rpx;
				margin-top: 20rpx;
				box-shadow: 0rpx 4px 24rpx #dedede;
				border-radius: 10rpx;

				.address-list-li-main {
					padding: 20rpx 0;
					box-sizing: border-box;
					border-bottom: 1rpx solid #ededed;

					.address-list-li-info {
						.list-li-info-top {}

						.list-li-info-center {
							font-weight: 600;
						}

					}
				}

				.address-list-li-bottom {
					height: 70rpx;
				}

			}
		}
	}
</style>
