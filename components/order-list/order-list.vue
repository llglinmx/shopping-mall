<template>
	<view class="order">
		<view style="height: 100%" v-if="!isLoad">
			<loading />
		</view>
		<z-paging ref="paging" @query="queryList" :list.sync="dataList" :mounted-auto-call-reload="false"
			:use-custom-refresher="true" style="height: 100%;" emptyViewText='暂无任何数据'>
			<view class="order-box-list" v-if="isLoad">
				<view class="order-box-list-li flex align-center flex-direction paddingLR"
					v-for="(item,index) in dataList" :key='index'>
					<view class="order-box-list-li-top flex align-center justify-between">
						<view class="list-li-top-left flex align-center">
							<view class="font-24 color-324b78">
								{{item.dateAdd}}
							</view>
							<count-down :time="item.dateClose" v-if="item.status==0" style="margin-left: 20rpx;" />
						</view>
						<view class="list-li-top-right font-26">
							<text style="color: #f73737;" v-if="item.status==0">待支付</text>
							<text style="color: #f73737;" v-if="item.status==-1">订单已关闭</text>
							<text style="color: #f73737;" v-if="item.status==1">待发货</text>
						</view>
					</view>
					<view class="order-box-list-li-main">
						<view class="list-li-main-item flex align-center" v-for="(ele,idx) in item.data" :key='ele.id'>
							<view class="list-li-main-item-image">
								<image :src="ele.pic" mode="aspectFill"></image>
							</view>
							<view class="list-li-main-item-info flex-1 flex flex-direction justify-around">
								<view class="list-li-main-item-info-title font-26">
									{{ele.goodsName}}
								</view>
								<view class="list-li-main-item-info-msg font-24">
									<text>{{ele.property}}</text>
								</view>
								<view class="list-li-main-item-info-bottom flex align-center justify-between">
									<view class="item-info-bottom-left">
										<text class="font-28"
											style="color: #f73737;font-weight: 600;">￥{{ele.amountSingle}}</text>
										<!-- <text class="font-24"
											style="color: #999;margin-left: 10rpx;text-decoration:line-through;">￥500.00</text> -->
									</view>
									<view class="item-info-bottom-right font-24">
										x{{ele.number}}
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="order-box-list-li-text flex align-center justify-between">
						<view class="order-box-list-li-text-left font-26">
							共{{item.goodsNumber}}件商品
						</view>
						<view class="order-box-list-li-text-right flex" style="align-items: baseline;">
							<text class="font-24">合计￥</text>
							<text class="font-40">{{item.amountReal}}</text>
						</view>
					</view>
					<view class="order-box-list-li-bottom flex align-center justify-flex-end">
						<view class="btn-border font-24 flex-center" v-if="item.status==0"
							@click="btnClick('close',item.id)">
							取消订单
						</view>
						<view class="btn-all font-24 flex-center" style="margin-left: 20rpx;" hover-class="btn-hover"
							v-if="item.status==0"
							@click="btnClick('pay',item.id,item.amountReal,item.dateAdd,item.orderNumber)">
							去付款
						</view>
						<view class="btn-all font-24 flex-center" style="margin-left: 20rpx;" hover-class="btn-hover"
							v-if="item.status==-1" @click="btnClick('delete',item.id)">
							删除订单
						</view>
						<view class="btn-red font-24 flex-center" style="margin-left: 20rpx;" hover-class="btn-hover"
							v-if="item.status==1" @click="btnClick('refund',item.id,item.amountReal)">
							申请退款
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: "order-list",
		data() {
			return {
				dataList: [],
				isLoad: false,
				firstLoaded: false,
				type: 0,
				status: '',
			};
		},
		props: {
			tabIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			currentIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			isStatus: {
				type: [String, Number],
				default: ''
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					this.type = newVal
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							this.$nextTick(() => {
								this.isLoad = false
								this.$refs.paging.reload();
							})
						}
					}
				},
				immediate: true
			},
			isStatus(val) {
				this.status = val
			},
		},
		mounted() {
			this.status = this.isStatus
		},
		methods: {
			queryList(pageNo, pageSize) {
				if (this.dataList.length == 0) {
					this.isLoad = false
				}
				this.getData(pageNo, pageSize)
			},
			getData(index, size) {
				let vuedata = {
					status: this.status,
					page: index,
					pageSize: size,
					token: uni.getStorageSync("token")
				}
				this.apipost('order/list', vuedata).then(res => {
					let list = []
					this.isLoad = true
					if (res.code == 0) {
						// 数据处理
						res.data.orderList.forEach(item => {
							for (let key in res.data.goodsMap) {
								if (item.id == key) {
									list.push({
										dateAdd: item.dateAdd,
										dateClose: item.dateClose,
										status: item.status,
										amount: item.amount,
										amountReal: item.amountReal,
										goodsNumber: item.goodsNumber,
										orderNumber: item.orderNumber,
										id: item.id,
										data: res.data.goodsMap[key]
									})
								}
							}
						})
					}
					this.$refs.paging.addData(list);
				})
			},
			// 按钮点击
			btnClick(type, id, price, dateAdd, orderNumber) {
				let str = {
					type: type, //当前按钮点击类型
					id: id, //订单id
					price: price, // 支付价格
					dateAdd: dateAdd, // 创建时间
					orderNumber: orderNumber, // 订单编号
				}
				this.$emit('btn', str)
			}

		}
	}
</script>

<style lang="scss" scoped>
	.order {
		height: 100%;
		background: #f8f8f8;

		.order-box-list {

			.order-box-list-li {
				margin-top: 30rpx;
				padding: 0 32rpx;
				box-sizing: border-box;
				background: #fff;
				border-radius: 10rpx;

				.order-box-list-li-top {
					width: 100%;
					height: 80rpx;
				}

				.order-box-list-li-main {
					width: 100%;
					padding: 30rpx 0;
					border-top: 1rpx solid #ededed;
					border-bottom: 1rpx solid #ededed;

					.list-li-main-item {
						margin-bottom: 30rpx;

						.list-li-main-item-image {
							width: 160rpx;
							height: 160rpx;
							background: #eee;
							border-radius: 10rpx;
							overflow: hidden;

							image {
								width: 160rpx;
								height: 160rpx;
							}
						}

						.list-li-main-item-info {
							margin-left: 20rpx;

							.list-li-main-item-info-title {
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								line-clamp: 2;
								-webkit-box-orient: vertical;
							}

							.list-li-main-item-info-msg {
								margin: 10rpx 0;
								line-height: 24rpx;
								color: #999;
							}

							.list-li-main-item-info-bottom {
								.item-info-bottom-left {}

								.item-info-bottom-right {}
							}
						}
					}

					.list-li-main-item:last-child {
						margin-bottom: 0;
					}
				}

				.order-box-list-li-text {
					width: 100%;
					height: 80rpx;

					.order-box-list-li-text-left {
						color: #666;
					}

					.order-box-list-li-text-right {
						font-weight: bold;
						color: #333;
					}
				}

				.order-box-list-li-bottom {
					width: 100%;
					height: 120rpx;
				}

			}
		}
	}

	.btn-all {
		width: 180rpx;
		height: 64rpx;
		background: #324B78;
		color: #fff;
		border-radius: 40rpx;
	}

	.btn-border {
		width: 178rpx;
		height: 62rpx;
		border: 1rpx solid #999;
		color: #999;
		border-radius: 40rpx;
	}

	.btn-red {
		width: 178rpx;
		height: 62rpx;
		color: #E53948;
		border: 1rpx solid #E53948;
		border-radius: 40rpx;
	}

	.btn-hover {
		opacity: 0.7;
	}
</style>
</style>
