<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<uni-nav-bar left-icon="arrowleft" :border='false' :title="titleText" @clickLeft="Gback" />
		</view>
		<view class="box-content flex-1 scroll-y flex flex-direction" v-if="!isShow">
			<view class="box-content-nav">
				<tabs-nav ref='tabRef' :tabData="navList" :activeIndex="activeIndex" @tabClick='tabChange' />
			</view>
			<view class="box-content-main flex-1 scroll-y">
				<swiper class="swiper-box" :current="activeIndex" @change="swiperTab">
					<swiper-item class="swiper-box-item" v-for="(item,index) in navList" :key='index'>
						<order-list ref='orderRef' :isStatus='status' :tabIndex="index" @btn='clickBtn'
							:currentIndex="activeIndex" />
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="box-content flex-1 scroll-y flex flex-direction" v-if="isShow">
			<no-login style="height: 100%;" @clickBtn='goLogin' />
		</view>
		<view class="box-footer"></view>
		<uni-popup ref="closePopup" type="dialog">
			<uni-popup-dialog type="warn" content="你确定要取消此订单吗？" title="警告" :duration="2000" @confirm="closeConfirm">
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="deletePopup" type="dialog">
			<uni-popup-dialog type="warn" content="你确定要删除此订单？" title="警告" :duration="2000" @confirm="deleteConfirm">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import mixins from '../../static/js/mixins.js'
	export default {
		mixins: [mixins],
		data() {
			return {
				titleText: '全部订单',
				id: '',
				navList: [{
						id: 3,
						name: '全部订单',
						status: '',
					},
					{
						id: 0,
						name: '待付款',
						status: 0,
					},
					{
						id: 1,
						name: '待发货',
						status: 1,
					},
					{
						id: 2,
						name: '待收货',
						status: 2,
					},
					{
						id: 4,
						name: '待评价',
						status: 3,
					},
				],
				status: '',
				activeIndex: 0, //当前所处下标
				isShow: false,
				goodsId: '',
			}
		},
		onLoad(options) {
			this.id = Number(options.id)
		},
		onShow() {
			let token = uni.getStorageSync("token")
			// 判断是否登录  未登录打开登录弹出层
			if (!token) {
				this.isShow = true
			} else {
				this.switchTab(this.id)
				this.isShow = false
			}
		},
		methods: {
			// 
			switchTab(id) {
				switch (id) {
					case 0: //待付款
						this.activeIndex = 1
						this.status = this.navList[this.activeIndex].status
						break;
					case 1: //待发货
						this.activeIndex = 2
						this.status = this.navList[this.activeIndex].status
						break;
					case 2: //待收货
						this.activeIndex = 3
						this.status = this.navList[this.activeIndex].status
						break;
					case 3: //全部订单
						this.activeIndex = 0
						this.status = this.navList[this.activeIndex].status
						break;
					case 4: //待评价
						this.activeIndex = 4
						this.status = this.navList[this.activeIndex].status
						break;
				}
			},
			// 登录按钮
			goLogin() {
				uni.navigateTo({
					url: '../../pages/login/login'
				})
			},

			clickBtn(e) {
				this.goodsId = e.id
				switch (e.type) {
					case 'pay':
						break;
					case 'close':
						this.$refs.closePopup.open()
						break;
					case 'delete':
						this.$refs.deletePopup.open()
						break;
				}
			},


			// 取消订单确认
			closeConfirm() {
				let vuedata = {
					orderId: this.goodsId,
					token: uni.getStorageSync("token")
				}
				this.apipost('order/close', vuedata).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '订单取消成功',
							icon: 'none'
						})
						this.$refs.orderRef[this.activeIndex].queryList(1, 20)
					}
				})
			},
			// 取消删除确认
			deleteConfirm() {
				let vuedata = {
					orderId: this.goodsId,
					token: uni.getStorageSync("token")
				}
				this.apipost('order/delete', vuedata).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '订单删除成功',
							icon: 'none'
						})
						this.$refs.orderRef[this.activeIndex].queryList(1, 20)
					}
				})
			},



			// 导航栏点击
			tabChange(index) {
				this.activeIndex = index
				this.status = this.navList[this.activeIndex].status
			},
			// swiper切换
			swiperTab(e) {
				this.$refs.tabRef.tabToIndex(e.detail.current)
				this.activeIndex = e.detail.current
				this.status = this.navList[this.activeIndex].status
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

			.box-content-main {
				.swiper-box {
					height: 100%;

					.swiper-box-item {
						height: 100%;
					}
				}
			}
		}

		.box-footer {
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			box-sizing: content-box;
			background: #fff;
		}
	}
</style>
