<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<view class="box-header-top flex align-center paddingLR">
				<view class="box-header-top-title font-40 color-324b78">
					主页
				</view>
				<view class="box-header-search-main flex align-center" @click="tabClickList">
					<uni-icons type="search" size="16" color="#999"></uni-icons>
					<text class="font-24" style="color: #999;margin-left: 15rpx;">请输入需要搜索的商品</text>
				</view>
			</view>
		</view>
		<view class="box-content flex-1 scroll-y">
			<z-paging ref="paging" @query="getRecommend" :list.sync="dataList" :mounted-auto-call-reload="false"
				:use-custom-refresher="true" style="height: 100%;" :hide-empty-view='true' :loading-more-enabled='false'
				:fixed='false' refresher-threshold='140rpx'>
				<custom-refresher slot="refresher" slot-scope="{refresherStatus}" :status="refresherStatus" />
				<view class="flex flex-direction">
					<view class="box-content-banner paddingLR">
						<swiper-banner />
					</view>
					<view class="box-content-recommend">
						<title-msg />
						<goods-square :dataList='dataList' @details='goodsDetails' @clickShopping='shoppingIcoClick' />
					</view>
				</view>
			</z-paging>
		</view>
		<view class="loading-index" :class="isLoad?'hidden-loading':''">
			<loading />
		</view>
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
				isLoad: false,
				dataInfo:{},
			}
		},
		onLoad() {
			this.getRecommend()
		},
		methods: {
			// 跳转商品列表页 
			tabClickList() {
				uni.navigateTo({
					url: '../../pagesIndex/goodsList/goodsList'
				})
			},
			// 获取推荐商品
			getRecommend(index, size) {
				let vuedata = {
					page: 1,
					pageSize: 20,
					orderBy: 'ordersUp', //销量升序
					RecommendStatus: 1, //推荐状态：不传该参数获取所有商品；0为一般商品；1为推荐商品
				}

				this.apipost('shop/goods/list/v2', vuedata).then(res => {
					let list = []
						this.isLoad = true
					if (res.code == 0) {
						list = res.data.result
						this.$refs.paging.addData(list);
					}
				})
			},
			// 跳转商品详情
			goodsDetails(id) {
				uni.navigateTo({
					url: '../../pagesSort/goodsDetails/goodsDetails?id=' + id
				})
			},
			// 购物车图标点击
			shoppingIcoClick(id) {
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
			.box-header-top {
				height: 88rpx;

				.box-header-top-title {
					font-weight: 700;
				}

				.box-header-search-main {
					margin-left: 30rpx;
					width: 400rpx;
					height: 60rpx;
					padding: 0 32rpx;
					box-sizing: border-box;
					border-radius: 40rpx;
					background: #f7f7f7;
				}
			}
		}

		.box-content {
			width: 100%;

			.box-content-banner {
				height: 300rpx;
			}
		}

		.loading-index {
				width: 100%;
				height: 100%;
				position: fixed;
				z-index: 999;
				background: rgba(255, 255, 255, 0.9);
				transition: 0.2s;
			}
		
			.hidden-loading {
				opacity: 0;
				z-index: -1;
			}
	}
</style>
