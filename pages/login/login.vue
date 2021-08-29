<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<uni-nav-bar left-icon="arrowleft" :border='false' title="登录" @clickLeft="Gback" />
		</view>
		<view class="box-content flex-1 scroll-y">
			<view class="login-top font-44 flex-center">欢迎来到XX商城</view>
			<view class="login-logo">

			</view>

			<view class="login-text-box">
				<view class="login-text-title">
					登录后可继续操作
				</view>
				<view class="login-tetx-msg">
					登录将获得您的公开信息（昵称、头像等）
				</view>
			</view>
			<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN"
				@getuserinfo="wxGetUserInfo">授权登录</button>
		</view>
		<view class="box-footer">

		</view>
	</view>
</template>

<script>
	import mixins from '../../static/js/mixins.js'
	export default {
		mixins: [mixins],
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			// 获取用户信息
			wxGetUserInfo() {
				uni.showLoading({
					title: '登录中...',
					mask: true
				});
				// 获取用户信息
				uni.getUserInfo({
					provider: 'weixin',
					success: (res) => {
						uni.setStorageSync("nickName", res.userInfo.nickName)
						uni.setStorageSync("avatarUrl", res.userInfo.avatarUrl)

						this.loginChange(res.userInfo)

					},
					fail: (fail) => {
						console.log("fail:", fail)
					}
				});
			},
			// 登录方法
			loginChange(UserInfo) {
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: (loginRes) => {
									this.apipost('user/wxapp/login', {
										code: loginRes.code,
										// type: 2,
										autoReg: true, // 没有注册是否自动注册
									}).then(ress => {
										// 隐藏加载页效果
										uni.hideLoading();
										if (ress.code == 10000) {
											console.log(res)
											// this.register(loginRes.code)
										} else if (ress.code == 0) {
											uni.setStorageSync("token", ress.data
												.token) // token

											uni.setStorageSync("userId", ress.data
												.uid) // 用户编号

											uni.showToast({
												title: "登录成功",
												icon: "none"
											})
											this.$store.commit('upDate', true)
											setTimeout(() => {
												uni.navigateBack({
													delta: 1
												})
											}, 500)

										} else {
											uni.showToast({
												title: ress.msg,
												icon: 'none'
											})
										}

									})
								}
							});
						}
					}
				});
			},
			// 注册
			register(code) {
				this.apipost('user/wxapp/register/simple', {}).then(res => {
					if (res.data.code == 0) {

					} else {

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

		.box-header {}

		.box-content {
			width: 100%;

			.login-top {
				height: 253rpx;
			}

			.login-logo {
				width: 144rpx;
				height: 144rpx;
				margin: 160rpx auto 0;
				background: #324B78;
				border-radius: 24rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.login-text-box {
				margin-top: 113rpx;
				text-align: center;

				.login-text-title {
					font-size: 32rpx;
					color: #000;
				}

				.login-tetx-msg {
					margin-top: 22rpx;
					color: #999;
					font-size: 28rpx;
				}
			}

			button {
				width: 688rpx;
				height: 80rpx;
				margin-top: 119rpx;
				background: #08C160;
				border: none;
				font-size: 30rpx;
				color: #f7f7f7;
			}
		}

		.box-footer {}
	}
</style>
