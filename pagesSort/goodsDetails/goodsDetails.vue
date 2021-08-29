<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<uni-nav-bar left-icon="arrowleft" :border='false' title="商品详情" @clickLeft="Gback" />
		</view>
		<view class="box-content flex-1 scroll-y">
			<scroll-view :scroll-y="true" :scroll-top="scTop" @scroll='scrollChange'>
				<!-- <view class="box-content-top" :style="[{paddingTop:barHeight+'px'},{background:isShow?'#fff':''}]">
					<view class="flex align-center paddingLR" v-if="!isShow" style="height: 88rpx;">
						<view class="box-content-top-back flex-center" @click="Gback">
							<uni-icons type="arrowleft" size="16" color="#fff"></uni-icons>
						</view>
					</view>
					<view class="flex align-center" style="width: 100%;background: #fff;" v-if="isShow">
						<uni-nav-bar style="width: 100%;" left-icon="arrowleft" :border='false' title="商品详情"
							@clickLeft="Gback" />
					</view>
				</view> -->
				<view class="box-content-banner">
					<swiper class="swiper-box" :autoplay="true" :interval="3000" :duration="500" :circular='true'
						@change="change">
						<swiper-item class="swiper-box-item" v-for="(item,index) in bannerList" :key="index"
							@click="previewImg(index)">
							<view class="swiper-item">
								<image :src="item.pic" mode="aspectFill"></image>
							</view>
						</swiper-item>
					</swiper>
					<view class="box-banner-msg font-24 flex-center">
						<text>{{current}}/{{bannerList.length}}</text>
					</view>
				</view>
				<view class="details-content-info">
					<view class="details-info-top flex align-baseline font-28">
						<view class="details-top-price">
							<!-- ￥<text>{{popInfo["basicInfo"]["minPrice"]}}</text> -->
							￥<text class="font-52"
								v-if="dataInfo&&dataInfo.basicInfo&&dataInfo.basicInfo.minPrice">{{dataInfo['basicInfo']['minPrice']}}</text>
						</view>
						<view class="details-top-cost-price">
							￥<text
								v-if="dataInfo&&dataInfo.basicInfo&&dataInfo.basicInfo.originalPrice">{{dataInfo["basicInfo"]["originalPrice"]}}</text>
						</view>
					</view>
					<view class="details-info-bottom font-28 flex">
						<view class="details-bottom-title flex-1">
							<text
								v-if="dataInfo&&dataInfo.basicInfo&&dataInfo.basicInfo.name">{{dataInfo["basicInfo"]["name"]}}</text>
						</view>
						<view class="details-bottom-share">
							<button open-type="share">

							</button>
						</view>
					</view>
				</view>

				<view class="details-content-info-evaluate paddingLR" v-if="evaluateData.length!=0">
					<view class="details-evaluate-top flex justify-between" @click="moreEvaluate">
						<view class="details-evaluate-top-title font-28">
							宝贝评价
						</view>
						<view class="details-evaluate-top-more flex align-center">
							<text class="font-24">查看更多</text>
							<uni-icons type="arrowright" size="16" color="#333"></uni-icons>
						</view>
					</view>
					<view class="details-evaluate-li" :class="{'details-evaluate-li-active':!item.reputationPics}"
						v-for="(item,index) in evaluateData" :key='index'>
						<view class="details-evaluate-center">
							<view class="details-evaluate-center-info flex align-center">
								<image :src="item.user.avatarUrl" mode="aspectFill"></image>
								<text>{{item.user.nick}}</text>
							</view>
							<view class="details-evaluate-center-text">{{item.goods.goodReputationRemark}}</view>
						</view>
						<view class="details-evaluate-center-bottom">
							<view class="details-evaluate-img-list flex scroll-y">
								<view class="details-evaluate-img" v-for="(v,j) in item.reputationPics"
									@click="previewImg(j,item.reputationPics)" :key='index'>
									<image :src="v.pic" mode="aspectFill"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="details-content-info-evaluate paddingLR" v-if="evaluateData.length==0">
					<view class="font-28 paddingTB">
						暂无评价
					</view>
				</view>
				<view class="details-content-goods flex-center">
					<view class="details-content-goods-title font-32 color-324b78">
						商品详情
					</view>
				</view>
				<rich-text :nodes="dataInfo.content" class="details-goods-img-list"></rich-text>
			</scroll-view>
		</view>
		<view class="box-footer safety-zone" v-if="isFlag">
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>

		<uni-popup ref="selectPopup" :maskClick="false" type="bottom">
			<select-product :type="selectType" :dataInfo='dataInfo' @checkActive='checkActive' @close='popupClose' />
		</uni-popup>
	</view>
</template>

<script>
	import mixins from '../../static/js/mixins.js'
	export default {
		mixins: [mixins],
		data() {
			return {
				bannerList: [],
				current: 1, //当前图片下标
				barHeight: 0,
				isShow: false, //切换顶部样式
				id: '',
				options: [{
					icon: 'headphones',
					text: '客服'
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#526D9E',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#324B78',
						color: '#fff'
					}
				],
				dataInfo: {},
				selectType: '',
				evaluateData: [], // 评价列表
				scrollTop: 0,
				OpacityNum: 0,
				scTop: 0,
				isFlag: true, //是否显示底部菜单栏
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetails(options.id)
			uni.getSystemInfo({
				success: (res) => {
					this.barHeight = res.statusBarHeight
				}
			});
		},
		methods: {
			getDetails(id) {
				let vuedata = {
					id: id,
					token: uni.getStorageSync("token")
				}

				this.apiget('shop/goods/detail', vuedata).then(res => {
					if (res.code == 0) {
						this.bannerList = res.data.pics
						this.dataInfo = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					this.evaluateList()
				})
			},
			// 监听当前轮播图下标
			change(e) {
				this.current = e.detail.current + 1
			},

			// 客服购物车
			onClick(e) {
				console.log(e)
			},
			// 加入购物车 立即购买按钮
			buttonClick(e) {
				this.isFlag = false
				switch (e.index) {
					case 0: //加入购物车
						this.selectType = 'shopping'
						this.$refs.selectPopup.open()
						break;
					case 1: //立即购买按钮
						this.selectType = 'purchase'
						this.$refs.selectPopup.open()
						break;
				}

			},

			// 获取评价列表
			evaluateList() {
				let vuedata = {
					goodsId: this.id,
					page: 1,
					pageSize: 2,
					token: uni.getStorageSync("token")
				}
				this.apipost('shop/goods/reputation', vuedata).then(res => {
					if (res.code == 0) {
						this.evaluateData = res.data
					}
				})
			},
			// 更多评价
			moreEvaluate() {

			},
			scrollChange(e) {
				console.log(e)
			},

			checkActive(item) {
				this.dataInfo = item
			},
			// 关闭弹出层
			popupClose() {
				setTimeout(() => {
					this.isFlag = true
				}, 200)
				this.$refs.selectPopup.close() // 关闭弹出层方法
			},

		},
		// 监听页面滚动
		onPageScroll(e) {
			if (this.scollTop > e.scrollTop) {
				// 向下滚动
				if (e.scrollTop <= 0) {
					this.OpacityNum = 0
				} else {
					this.OpacityNum -= 0.01
				}
			} else {
				// 向上滚动
				if (e.scrollTop >= 290) {
					this.OpacityNum = 1
				} else {
					this.OpacityNum += 0.01
				}

			}
			this.scollTop = e.scrollTop
			console.log(this.scollTop)
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
			position: relative;
			width: 100%;

			.box-content-top {
				position: fixed;
				top: 0;
				z-index: 1;
				width: 100%;



				.box-content-top-back {
					width: 50rpx;
					height: 50rpx;
					background: rgba(0, 0, 0, 0.5);
					border-radius: 50%;

				}
			}

			.box-content-banner {
				position: relative;
				height: 750rpx;

				.swiper-box {
					height: 100%;

					.swiper-box-item {
						height: 100%;

						.swiper-item {
							height: 750rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

				.box-banner-msg {
					position: absolute;
					right: 30rpx;
					bottom: 30rpx;
					width: 90rpx;
					height: 40rpx;
					background: rgba(0, 0, 0, 0.5);
					border-radius: 30rpx;
					color: #fff;
				}
			}

			.details-content-info {
				width: 100%;
				padding: 40rpx 32rpx;
				box-sizing: border-box;
				background: #fff;

				.details-info-top {


					.details-top-price {
						color: #E53947;

						text {
							font-weight: bold;
						}
					}

					.details-top-cost-price {
						margin-left: 20rpx;
						color: #999;
						text-decoration: line-through
					}
				}

				.details-info-bottom {
					margin-top: 38rpx;
					color: #000;

					.details-bottom-title {
						line-height: 34rpx;
					}

					.details-bottom-share {
						width: 30rpx;
						height: 30rpx;
						margin-left: 68rpx;

						button {
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							background: none;
							border: none;
							padding: 0;
							// position: static;
							line-height: normal;

							image {
								width: 23rpx;
								height: 28rpx;
							}
						}

						button::after {
							border: none !important;
						}

					}
				}
			}

			.details-content-info-evaluate {
				margin: 20rpx 0;
				background: #fff;

				.details-evaluate-top {
					padding: 32rpx 0 0;
					font-weight: 400;

					.details-evaluate-top-title {}

					.details-evaluate-top-more {


						text {
							color: #324B78;
						}

						image {
							width: 22rpx;
							height: 12rpx;
							margin-left: 16rpx;
							transform: rotate(-90deg);
						}
					}
				}

				.details-evaluate-li {
					border-bottom: 1rpx solid #f2f2f2;
					padding-bottom: 40rpx;
					margin-top: 32rpx;

					.details-evaluate-center {
						.details-evaluate-center-info {
							width: 100%;

							image {
								width: 48rpx;
								height: 48rpx;
								border-radius: 50%;
							}

							text {
								margin-left: 24rpx;
								font-size: 24rpx;
								color: #666;
								font-weight: 400;
							}
						}

						.details-evaluate-center-text {
							font-size: 24rpx;
							padding: 24rpx 0 32rpx;
							box-sizing: border-box;
						}
					}

					.details-evaluate-center-bottom {
						.details-evaluate-img-list {


							.details-evaluate-img {
								margin-right: 20rpx;
								width: 180rpx;
								height: 220rpx;

								image {
									width: 100%;
									height: 100%;
									border-radius: 8rpx;
								}
							}

							.details-evaluate-img:last-child {
								margin-right: 0;
							}
						}
					}
				}

				.details-evaluate-li:last-child {
					border-bottom: 0;
				}

				.details-evaluate-li-active {
					padding-bottom: 0 !important;
				}
			}

			.details-content-goods {
				height: 92rpx;
				background: #fff;

				.details-content-goods-title {
					position: relative;
					font-weight: 700;
				}

				.details-content-goods-title::after,
				.details-content-goods-title::before {
					position: absolute;
					top: 0;
					bottom: 0;
					margin: auto;
					content: '';
					width: 80rpx;
					height: 1rpx;
					background: #314B77;
				}

				.details-content-goods-title::after {
					right: -106rpx;
				}

				.details-content-goods-title::before {
					left: -106rpx;
				}
			}

		}

		.box-footer {
			background: #fff;
		}
	}
</style>
