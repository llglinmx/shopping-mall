<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<uni-nav-bar left-icon="arrowleft" :border='false' title="收货地址" @clickLeft="Gback" />
		</view>
		<view class="box-content flex-1 scroll-y">
			<address-list ref='addressRef' @clickDelete='deleteAddress' />
		</view>
		<view class="box-footer">
			<shopping-button text="添加地址" @click='addressClick' />
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="warn" mode='base' title="警告" content="你是否确定删除此地址" :duration="2000"
				@confirm="confirmDelete"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popupLogin" type="dialog">
			<uni-popup-dialog type="warn" mode='base' title="警告" content="你还未登录,是否前去登录" :duration="2000"
				@confirm="goLogin"></uni-popup-dialog>
		</uni-popup>
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
		onHide() {
			this.$store.commit('upDate',false)
		},
		onUnload() {
			this.$store.commit('upDate',false)
		},
		onShow() {
			if(this.$store.state.isUpdate){
				this.$refs.addressRef.queryList(1,10)
			}
		},
		methods: {
			// 添加地址
			addressClick() {
				let token = uni.getStorageSync("token")
				// 判断是否登录  未登录打开登录弹出层
				if (!token) {
					this.$refs.popupLogin.open()
				} else {
					uni.navigateTo({
						url: '../addAddress/addAddress'
					})
				}
			},

			// 删除地址
			deleteAddress() {
				this.$refs.popup.open()
			},

			// 确认删除
			confirmDelete() {},

			// 去登录
			goLogin() {
				uni.navigateTo({
					url: '../../pages/login/login'
				})
			}
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
		}

		.box-footer {
			padding: 40rpx 32rpx;
			box-sizing: border-box;
		}
	}
</style>
cc
