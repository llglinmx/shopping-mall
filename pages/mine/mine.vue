<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<view class="header-top font-30 flex-center color-324b78">
				个人中心
			</view>
		</view>
		<view class="box-content flex-1 scroll-y">
			<view class="box-content-info flex align-center">
				<view class="box-content-info-image">
					<image :src="avatarUrl" mode="aspectFill"></image>
				</view>
				<view class="box-content-info-right flex-1 flex flex-direction align-start">
					<view class="box-content-right-btn flex-center font-24" v-if="!isLogin" @click="goLogin">
						登录/注册
					</view>
					<view class="font-36 color-324b78" style="font-weight: 700;" v-if="isLogin">
						{{nickName||'--'}}
					</view>

					<button v-if="isLogin&&!mobile" class="box-content-right-btn" type="primary" size="mini"
						open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
						style="display: flex;align-items:center; justify-content: center;padding: 0;margin: 10rpx 0 0;background: none;color: #324B78;width: 180rpx;height: 40rpx;font-size: 22rpx;">绑定手机号</button>
					<view class="font-28" style="color: #333;margin-top: 10rpx;" v-if="isLogin&&mobile">
						18385917210
					</view>
				</view>
			</view>
			<view class="order-tab  paddingLR">
				<view style="margin: 30rpx 0;">
					<msg-title msg="我的订单" />
				</view>
				<order-tab :options='options' @TabClick='clickNav' />
			</view>
			<view style="margin: 30rpx 0;" class=" paddingLR">
				<msg-title msg="我的服务" />
			</view>
			<view class="box-content-list  paddingLR">
				<view class="box-content-list-li flex align-center justify-between" v-for="(item,index) in list"
					:key='index' @click="tabClickList(item.id)">
					<view class="box-content-list-li-left flex align-center">
						<image :src="item.icon" mode="aspectFill"></image>
						<text class="font-26" style="margin-left: 10rpx;">{{item.title}}</text>
					</view>
					<view class="box-content-list-li-more">
						<uni-icons type="arrowright" size="16" color="#333"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="warn" content="你确定要退出吗？" title="警告" :duration="2000" :before-close="false"
				@confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: [{
						name: "待付款",
						ico: '../../static/images/tobepaid.png',
						num: 0,
						id: 0,
					},
					{
						name: "待发货",
						ico: '../../static/images/deliver.png',
						num: 0,
						id: 1
					},
					{
						name: "待收货",
						ico: '../../static/images/delivery.png',
						num: 0,
						id: 2
					},
					{
						name: "全部订单",
						ico: '../../static/images/order-ico.png',
						num: 0,
						id: 3
					}
				],

				list: [{
						icon: '../../static/images/address-ico.png',
						title: '收货地址',
						id: 1,
					},
					{
						icon: '../../static/images/cust-ico.png',
						title: '客服',
						id: 2,
					},
					{
						icon: '../../static/images/out-ico.png',
						title: '退出',
						id: 3,
					},
				],
				isLogin: false, //是否登录
				avatarUrl: '', //头像
				mobile: '',
				nickName: '', //昵称
			}
		},
		onLoad() {

		},
		onShow() {
			this.avatarUrl = uni.getStorageSync('avatarUrl')
			this.nickName = uni.getStorageSync('nickName')
			let token = uni.getStorageSync("token")
			if (!token) {
				this.isLogin = false
			} else {
				this.isLogin = true
			}
			this.getOrder()
		},
		methods: {
			// 我的订单点击
			clickNav(e) {
				uni.navigateTo({
					url: '../../pagesMine/allOrder/allOrder?id=' + e
				})
			},


			tabClickList(id) {
				switch (id) {
					case 1: //收货地址
						uni.navigateTo({
							url: '../../pagesMine/receivingAddress/receivingAddress'
						})
						break;
					case 3: //退出
						// 判断是否已经退出，已经退出 点击退出按钮弹窗提示
						if (Boolean(uni.getStorageSync("token"))) {
							this.$refs.popup.open() // 打开弹窗
						} else {
							uni.showToast({
								title: "你已经退出登录了",
								icon: "none"
							})
						}
						break;
				}
			},
			// 确定退出登录
			confirm() {
				uni.removeStorageSync("nickName")
				uni.removeStorageSync("avatarUrl")
				uni.removeStorageSync("token")
				uni.removeStorageSync("userId")
				uni.showToast({
					title: "退出成功",
					icon: "none"
				})
				this.isLogin = false
				this.avatarUrl = ''
				this.nickName = ''
			},


			// 获取订单列表  用于显示数量
			getOrder() {
				let data = {
					page: 1,
					pageSize: 100,
					token: uni.getStorageSync("token")
				}
				this.apipost('order/list', data).then(res => {
					if (res.code == 0) {
						let arr1 = [];
						let arr2 = [];
						let arr3 = [];
						// 先请空原来的数量  拿到最新的值
						this.options.forEach(item => {
							item.num = 0
						})
						// 循环拿到对应的状态
						res.data.orderList.forEach(item => {
							// 0 待付款
							switch (item.status) {
								case 0:
									arr1.push(item);
									this.options[0].num = arr1.length;
									break;
								case 1:
									arr2.push(item);
									this.options[1].num = arr2.length;
									break;
								case 2:
									arr3.push(item);
									this.options[2].num = arr3.length;
									break;
								default:
									// this.options.forEach(item => {
									// 	item.num = 0
									// })
									break
							}
						})
					}
				})
			},


			// 去登录页面
			goLogin() {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			// 获取手机号
			getPhoneNumber: function(e) {
				let that = this
				uni.login({
					provider: 'weixin',
					success: (ress) => {
						let data = {
							code: ress.code, //临时登陆凭证
							encryptedData: e.detail.encryptedData, //微信登录接口返回的 加密用户信息	query	true	
							iv: e.detail.iv, //微信登录接口返回的加密偏移数据
							token: uni.getStorageSync("token")
						}
						// 			request({
						// 				url: '/user/wxapp/bindMobile',
						// 				method: 'POST',
						// 				data: data
						// 			}).then(res => {
						// 				if (res.statusCode == 200) {
						// 					if (res.data.code == 0) {
						// 						that.Login()
						// 					} else if (res.data.code == 700) {

						// 					}
						// 				} else {}

						// 			})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.box {
		width: 100%;
		height: 100%;
		background: #fff;

		.box-header {
			background: #f7f7f7;

			.header-top {
				height: 88rpx;
				font-weight: 600;
			}
		}

		.box-content {
			width: 100%;

			.box-content-info {
				padding: 0 60rpx 70rpx;
				box-sizing: border-box;
				height: 300rpx;
				background: #f7f7f7;

				.box-content-info-image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					background: #353232;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.box-content-info-right {
					margin-left: 30rpx;

					.box-content-right-btn {
						width: 180rpx;
						height: 60rpx;
						border-radius: 32rpx;
						border: 1px solid #324B78;
					}
				}
			}

			.order-tab {}

			.box-content-list {
				.box-content-list-li:first-child {
					border-top: 1rpx solid #f2f2f2;
				}

				.box-content-list-li {
					height: 90rpx;
					border-bottom: 1rpx solid #f2f2f2;

					.box-content-list-li-left {
						image {
							width: 32rpx;
							height: 32rpx;
						}
					}
				}
			}
		}

		.box-footer {}
	}
</style>
