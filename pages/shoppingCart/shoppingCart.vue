<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<view class="header-nav flex align-center">
				<uni-nav-bar style="width: 100%;" :border='false' title="购物车" />
			</view>
			<view class="header-top-main flex align-center justify-between paddingLR" v-if="isShow&&dataList.length>0">
				<view class="font-24" style="color: #999;">
					共10件商品
				</view>
				<view class="font-28" style="color: #333;font-weight: 700;" @click="isDel=!isDel">
					<text class="color-ff1f1f" v-if="isDel">完成</text>
					<text v-if="!isDel">编辑</text>
				</view>
			</view>
		</view>
		<view class="box-content flex-1 scroll-y" v-if="isShow">
			<z-paging ref="paging" @query="getData" :list.sync="dataList" :mounted-auto-call-reload="false"
				:use-custom-refresher="true" style="height: 100%;" :hide-empty-view='true'
				:hide-loading-more-when-no-more-by-limit='limitNums' :fixed='false' refresher-threshold='140rpx'>
				<custom-refresher slot="refresher" slot-scope="{refresherStatus}" :status="refresherStatus" />
				<view class="box-content-main flex flex-direction" v-if="dataList.length<=0">
					<view class="box-content-data flex-center flex-direction">
						<view class="box-content-data-image">
							<image :src="imageUrl" mode="aspectFill"></image>
						</view>
						<view class="box-content-data-msg font-26">
							你的购物车暂无任何商品，赶紧去选购吧
						</view>
						<view class="box-content-data-btn font-24 flex-center" @click="goGoodsList">去逛逛</view>
					</view>
					<view class="box-content-recommend flex-1" v-if="recommendList.length!=0">
						<title-msg />
						<goods-square :dataList='recommendList' @details='goodsDetails'
							@clickShopping='shoppingIcoClick' />
					</view>
				</view>
				<view class="box-content-goods-data" v-if="dataList.length>0">
					<shopping-list :dataList="dataList" @data='getCheckData' @del='delShoppingData' :key='keyIndex' />
				</view>
			</z-paging>
		</view>
		<view class="box-content flex-1" v-if="!isShow" style="background: #fff;">
			<no-login style="height: 100%;" @clickBtn='goLogin' />
		</view>
		<view class="box-footer flex align-center justify-between paddingLR" v-if="isShow&&dataList.length>0">
			<view class="box-footer-left flex align-center" @click="checkAll">
				<uni-icons type="circle" size="20" color="#324B78" v-if="!isCheck"></uni-icons>
				<uni-icons type="circle-filled" size="20" color="#324B78" v-if="isCheck"></uni-icons>
				<text class="font-34 color-324b78" style="margin-left: 10rpx;font-weight: 700;">全选</text>
			</view>
			<view class="box-footer-right flex align-center" v-if="!isDel">
				<view class="right-text flex align-baseline" style="margin-right: 30rpx;">
					<text class="font-26">合计：￥</text>
					<text class="font-36 color-ff1f1f" style="font-weight: 700;">{{totalPrice}}</text>
				</view>
				<view class="right-btn font-26 flex-center" hover-class="hover-active" @click="settlement">
					<text>结算</text>
					<text v-if="nums>0">（{{nums}}）</text>
				</view>
			</view>
			<view class="box-footer-right" v-if="isDel">
				<view class="right-btn font-26 flex-center" hover-class="hover-active" @click="alldelete">删除</view>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="warn" mode='base' title="警告" :content="content" :duration="2000"
				@confirm="confirmDelete"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="selectPopup" :maskClick="false" type="bottom">
			<select-product :dataInfo='dataInfo' @checkActive='checkActive' @close='popupClose' />
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				recommendList: [],
				imageUrl: 'data:image/png;base64,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',
				isShow: false,
				limitNums: 5, //小于五条不显示底部提示
				isDel: false, //是否开启编辑删除
				isCheck: false, //是否全选
				nums: 0, //选中数量
				keyIndex: 0,
				keyStr: '', //保存key值
				content: '你是否确定删除此条数据',
				dataInfo: {}
			}
		},
		computed: {
			totalPrice() {
				let price = 0
				let list = this.dataList.filter(item => item.isFlag)
				list.forEach(item => {
					price += item.price
				})
				return price.toFixed(2)
			},
		},
		onLoad() {

		},
		onShow() {
			let token = uni.getStorageSync("token")
			// 判断是否登录  未登录打开登录弹出层
			if (!token) {
				this.isShow = false
			} else {
				this.getData()
				this.isShow = true
			}
		},

		methods: {
			// 获取购物车数据
			getData(index, size) {
				let vuedata = {
					token: uni.getStorageSync("token")
				}
				this.apiget('shopping-cart/info', vuedata).then(res => {
					let list = []
					if (res.code == 0) {
						list = res.data.items
						res.data.items.forEach(ele => {
							Object.assign(ele, {
								isFlag: false
							})
						})
						if (this.dataList.length != 0) {
							this.dataList.forEach(item => {
								list.forEach(ele => {
									if (item.key == ele.key) {
										ele.isFlag = item.isFlag
									}
								})
							})
						}

					} else if (res.code == 700) {
						this.dataList = []
					}
					this.$refs.paging.addData(list);

					if (this.dataList.length <= 0) {
						this.getRecommend()
					}

					// 购物车提示数量
					if (res.data) {
						uni.setTabBarBadge({
							index: 2,
							text: "" + res.data.items.length + "",
							success: (res) => {}
						})
					} else {
						uni.removeTabBarBadge({
							index: 2,
						})
					}




				})
			},

			// 获取推荐商品
			getRecommend() {
				let vuedata = {
					page: 1,
					pageSize: 10,
					RecommendStatus: 1, //推荐状态：不传该参数获取所有商品；0为一般商品；1为推荐商品
				}

				this.apipost('shop/goods/list/v2', vuedata).then(res => {
					if (res.code == 0) {
						this.isLoad = true
						this.recommendList = res.data.result
					}
				})
			},

			// 获取选中数据
			getCheckData(e) {
				this.nums = e.length
				if (this.dataList.length == e.length) {
					this.isCheck = true
				} else {
					this.isCheck = false
				}
			},
			// 全选
			checkAll() {
				this.keyIndex++
				this.isCheck = !this.isCheck
				this.dataList.forEach(item => {
					if (this.isCheck) {
						Object.assign(item, {
							isFlag: true
						})
					} else {
						Object.assign(item, {
							isFlag: false
						})
					}
				})
				this.nums = this.dataList.filter(res => res.isFlag).length
			},

			// 删除购物车数据
			delShoppingData(e) {
				this.keyStr = e
				this.$refs.popup.open()
			},
			// 一键删除所选中的列表
			alldelete() {
				let list = this.dataList.filter(item => item.isFlag)
				let str = ''
				if (list.length != 0) {
					// 循环遍历拿到需要删除的key
					list.forEach(item => {
						str += item.key + ','
					})
					this.keyStr = str.substr(0, str.length - 1)

					this.content = '你是否确定要删除选中的商品'
					this.$refs.popup.open()
				} else {
					uni.showToast({
						title: '请选择需要删除的商品',
						icon: 'none'
					})
				}
			},

			// 确认删除
			confirmDelete() {
				let vuedata = {
					key: this.keyStr,
					token: uni.getStorageSync("token")
				}
				this.apipost('shopping-cart/remove', vuedata).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					this.getData(1, 20)
				})
			},

			// 结算按钮
			settlement() {
				let list = this.dataList.filter(item => item.isFlag)
				if (list.length != 0) {
					uni.navigateTo({
						url: '../../pagesShopping/confirmOrder/confirmOrder?data=' + JSON.stringify(list)
					})
				} else {
					uni.showToast({
						title: '请选择需要结算的商品',
						icon: 'none'
					})
				}
			},

			// 跳转商品详情
			goodsDetails(id) {
				uni.navigateTo({
					url: '../../pagesSort/goodsDetails/goodsDetails?id=' + id
				})
			},
			// 跳转到商城列表
			goGoodsList() {
				uni.navigateTo({
					url: '../../pagesIndex/goodsList/goodsList'
				})
			},

			// 购物车图标点击
			shoppingIcoClick(id) {
				// 
				let vuedata = {
					id: id,
					token: uni.getStorageSync("token")
				}

				this.apiget('shop/goods/detail', vuedata).then(res => {
					if (res.code == 0) {
						this.dataInfo = res.data
						uni.hideTabBar()
						this.$refs.selectPopup.open()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},


			checkActive(item) {
				this.dataInfo = item
			},
			// 关闭弹出层
			popupClose() {
				uni.showTabBar()
				this.$refs.selectPopup.close() // 关闭弹出层方法
				this.getData()
			},
			// 登录按钮
			goLogin() {
				uni.navigateTo({
					url: '../../pages/login/login'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.box {
		width: 100%;
		height: 100%;

		.box-header {
			background: #fff;

			.header-nav {
				width: 100%;
				height: 88rpx;
			}

			.header-top-main {
				height: 60rpx;
			}
		}

		.box-content {
			width: 100%;

			.box-content-goods-data {
				height: 100%;
			}

			.box-content-main {
				height: 100%;
				background: #f7f7f7;

				.box-content-data {
					height: 600rpx;
					background: #fff;

					.box-content-data-image {
						image {
							width: 180rpx;
							height: 180rpx;
						}
					}

					.box-content-data-msg {
						margin: 20rpx;
						color: #999;
					}

					.box-content-data-btn {
						width: 180rpx;
						height: 60rpx;
						border: 1px solid #324B78;
						border-radius: 40rpx;
						color: #324B78;
						font-weight: 600;
					}
				}

				.box-content-recommend {
					margin-top: 20rpx;
					background: #fff;
				}
			}

		}

		.box-footer {
			height: 92rpx;

			.box-footer-right {
				.right-btn {
					min-width: 176rpx;
					height: 64rpx;
					padding: 0 10rpx;
					box-sizing: border-box;
					background: #324B78;
					border-radius: 32rpx;
					color: #fff;
				}

				.hover-active {
					opacity: 0.8;
				}
			}
		}
	}
</style>
