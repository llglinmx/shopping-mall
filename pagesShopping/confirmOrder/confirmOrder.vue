<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<uni-nav-bar left-icon="arrowleft" :border='false' title="确认订单" @clickLeft="Gback" />
		</view>
		<view class="box-content flex-1 scroll-y">
			<view class="order-content-address flex align-center" @click="checkAddress">
				<view class="order-address-ico flex align-center">
					<uni-icons type="location-filled" size="18" color="#333"></uni-icons>
				</view>
				<!-- 没有选择地址显示 -->
				<view class="order-address-info flex-1" v-if="!isState">
					<view class="order-info-title font-28">请选择收货地址</view>
				</view>
				<!-- 选择地址显示 -->
				<view class="order-address-info flex-1" v-if="isState">
					<view class="order-info-top flex align-center">
						<view class="order-info-top-name font-28">{{addressInfo.linkMan}}</view>
						<view class="order-info-top-tel font-24">{{addressInfo.mobile}}</view>
					</view>
					<view class="order-info-bottom font-24">
						{{addressInfo.provinceStr}}-{{addressInfo.cityStr}}-{{addressInfo.areaStr}}-{{addressInfo.address}}
					</view>
				</view>
				<view class="order-address-more">
					<uni-icons type="arrowright" size="16" color="#333"></uni-icons>
				</view>
			</view>
			<view class="order-content-wrap flex-1 scroll-y">
				<confirm-list :goodsList="goodsList"></confirm-list>
				<view class="order-content-msg flex-1 paddingLR">
					<view class="order-msg-li flex align-center justify-between">
						<view class="order-msg-li-title">商品总价</view>
						<view class="order-msg-li-text flex justify-flex-end flex-1">￥500.00</view>
					</view>
					<view class="order-msg-li flex align-center justify-between">
						<view class="order-msg-li-title">邮费</view>
						<view class="order-msg-li-text flex-1 flex justify-flex-end">25</view>
					</view>
					<view class="order-msg-li flex align-center justify-between">
						<view class="order-msg-li-title">优惠券</view>
						<view class="order-msg-li-text flex justify-flex-end  flex-1">
							<view class="order-msg-text-pic">
								<text style="color: #999;">无可用优惠券</text>
							</view>
						</view>
						<view class="order-msg-li-more">
							<uni-icons type="arrowright" size="16" color="#333"></uni-icons>
						</view>
					</view>

				</view>
			</view>
		</view>
		<view class="box-footer flex align-center justify-between paddingLR safety-zone">
			<view class="order-footer-info flex align-baseline">
				<view class="order-footer-info-text font-24">
					合计：
				</view>
				<view class="order-footer-info-price font-20">
					￥<text class="font-40">{{totalPrice}}</text>
				</view>
			</view>
			<view class="order-footer-btn flex-center font-24" @click="payBtn">
				立即支付
			</view>
		</view>
	</view>
</template>

<script>
	import mixins from '../../static/js/mixins.js'
	export default {
		mixins: [mixins],
		data() {
			return {
				isState: false, //用于判断是否选择收货地址
				addressInfo: {},
				goodsList: [],
				remarkVal: '', //备注
				couponId: '', //优惠券id
				orderData: ''
			}
		},
		computed: {
			// 商品支付价格
			totalPrice() {
				let price = 0;
				this.goodsList.forEach(item => {
					price += item.number * item.price
				})
				return price.toFixed(2)
			},
		},
		onLoad(options) {
			this.goodsList = JSON.parse(options.data)
			this.getDefaultAddress()
		},
		methods: {
			// 获取默认收货地址
			getDefaultAddress() {
				this.apiget('user/shipping-address/default/v2', {
					token: uni.getStorageSync("token")
				}).then(res => {
					if (res.code == 0) {
						this.addressInfo = res.data.info
						this.isState = true
						let provinceId = res.data.info.provinceId; // 省
						let cityId = res.data.info.cityId; // 市
						let districtId = res.data.info.districtId; // 区、县
					}
				})
			},
			// 选择地址
			checkAddress() {

			},

			// 立即支付按钮
			payBtn() {
				this.createOrder()
			},
			// 创建订单
			createOrder() {
				let str = {};
				let arr = [];
				this.goodsList.map((item) => {
					let propertyChildIds = ''
					if (item.sku && item.sku.length > 0) {
						item.sku.forEach(el => {
							propertyChildIds = propertyChildIds + ',' + el.optionId + ':' + el
								.optionValueId
						})
					}
					str = {
						goodsId: item.goodsId,
						number: item.number,
						propertyChildIds: propertyChildIds,
						logisticsType: 0
					}
					arr.push(str)
				})
				let data = {
					goodsJsonStr: JSON.stringify(arr), //购买的商品、规格尺寸、数量信息的数组
					address: this.addressInfo.address, //收货地址详细地址
					provinceId: this.addressInfo.provinceId, //收货地址省份编码
					cityId: this.addressInfo.cityId, //收货地址城市编码
					districtId: this.addressInfo.districtId, //收货地址区县编码
					couponId: this.couponId, //优惠券编号，多张用逗号相隔
					linkMan: this.addressInfo.linkMan, //收货地址联系人信息
					mobile: this.addressInfo.mobile, //收货地址联系人手机号码
					payOnDelivery: 0, //1为货到付款，其他数字为先支付
					peisongType: "kd", //配送类型，kd 代表快递；zq代表到店自取； keloop 快跑者; pszq 商家配送自取(还需收取快递费)
					remark: this.remarkVal == '' ? ' ' : this.remarkVal, //订单备注信息
					token: uni.getStorageSync("token")
				}
				uni.showLoading({
					title: '订单创建中',
					mask: true
				});
				this.apipost('order/create', data).then(res => {
					if (res.code == 0) {
						uni.hideLoading();
						this.orderData = res.data
						this.deleteShopping()
						let id = res.data.id


						// 调用支付
						// this.requestPay(this.totalPrice, id)

						uni.showToast({
							title: '订单支付成功',
							icon: 'none'
						})
						uni.navigateBack({
							delta: 1
						})

					}
				})
			},

			// 请求支付
			requestPay(price, id) {
				let str = {
					type: 0,
					id: id
				}
				let data = {
					money: price,
					payName: '订单支付',
					nextAction: JSON.stringify(str),
					token: uni.getStorageSync("token")
				}
				this.apipost('pay/wx/wxapp', data).then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						// 调用支付接口
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.package,
							signType: res.data.signType,
							paySign: res.data.paySign,
							success: (ress) => {
								uni.showToast({
									title: '支付成功',
									icon: "none"
								})
								// console.log('支付成功：',ress)
								//跳转支付成功页面
								// uni.redirectTo({
								// 	url: '../../pagesB/pay-success/pay-success?data=' + JSON
								// 		.stringify(this.OrderData) + '&price=' + this
								// 		.DiscountPrice
								// });
								console.log('success:' + JSON.stringify(ress));
							},
							fail: (err) => {
								// console.log('支付失败：',err)

							},
							complete: (crr) => {

							}
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				})

			},


			// 删除购物车数据
			deleteShopping() {
				let key = '';
				this.goodsList.map((item) => {
					key += item.key + ","
				})

				let data = {
					key: key,
					token: uni.getStorageSync("token")
				}
				this.apipost('shopping-cart/remove', data).then(res => {
					if (res.code == 0) {}
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	.box {
		width: 100%;
		height: 100%;
		background: #f7f7f7;

		.box-header {
			background: #fff;
		}

		.box-content {
			width: 100%;

			.order-content-address {
				width: 100%;
				// height:170rpx;
				padding: 32rpx;
				margin-bottom: 16rpx;
				box-sizing: border-box;
				// background: ;
				background: url(../../static/images/add-bg.png) no-repeat #fff;
				background-size: contain;
				background-position: bottom;

				.order-address-ico {
					width: 32rpx;
					height: 34rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.order-address-info {

					margin: 0 29rpx;

					.order-info-title {
						color: #000;
						font-weight: 500rpx;
					}

					.order-info-top {
						color: #000;

						.order-info-top-name {}

						.order-info-top-tel {
							margin-left: 24rpx;
						}
					}

					.order-info-bottom {
						// margin-top: 22rpx;
						color: #000;
					}

				}

				.order-address-more {}
			}

			.order-content-wrap {

				.order-content-msg {

					margin-top: 16rpx;
					font-weight: 500;
					background: #fff;

					.order-msg-li {
						height: 79rpx;
						font-size: 24rpx;
						border-bottom: 1rpx solid #f2f2f2;

						.order-msg-li-title {}

						.order-msg-li-text {
							margin-left: 16rpx;
							flex: 1;
							margin-left: 50rpx;
							font-size: 400;

							text {
								color: #E53948;
								margin-right: 16rpx;
							}

						}

						.order-msg-li-more {}
					}
				}
			}

		}

		.box-footer {
			height: 118rpx;
			background: #fff;

			.order-footer-info {

				.order-footer-info-text {
					color: #333;
					font-weight: 500;
				}

				.order-footer-info-price {
					font-weight: 500;
					color: #E53948;

					text {}
				}
			}

			.order-footer-btn {
				width: 200rpx;
				height: 70rpx;
				background: #324B78;
				box-sizing: border-box;
				border-radius: 40rpx;
				color: #fff;
				font-weight: 400;
			}
		}
	}
</style>
