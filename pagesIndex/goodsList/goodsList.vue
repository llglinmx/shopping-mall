<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<uni-nav-bar left-icon="arrowleft" :border='false' title="全部商品" @clickLeft="Gback" />
		</view>
		<view class="box-content flex-1 scroll-y flex flex-direction">
			<view class="box-content-main-wrap paddingLR" :style="{height:!isScroll?'140rpx':'70rpx'}">
				<view class="box-content-main-wrap-top flex align-center">
					<view class="main-wrap-ico" @click="tabChange">
						<text class="iconfont" :class="!isTab?'icon-liebiaolist46':'icon-gridfangge'"
							style="font-size: 50rpx;color:#b3b3b3;"></text>
					</view>
					<view class="main-wrap-search flex-1 flex align-center">
						<uni-icons type="search" size="16" color="#c3c3c3"></uni-icons>
						<input type="text" class="flex-1" placeholder-style="color:#c3c3c3" @focus="onFoucs"
							@blur="onBlur" v-model.trim="searchVal" placeholder="请输入需要搜索的商品" confirm-type="done"
							@confirm="searChange" />
					</view>
					<view class="main-wrap-search-text font-24 flex align-center justify-center"
						:style="[{width:isSearch?'88rpx':'0rpx'}]" @click="searChange">
						搜索
					</view>
				</view>
				<view class="box-content-main-wrap-bottom flex align-center">
					<view class="main-wrap-bottom-item flex-1 flex-center" v-for="(item,index) in options" :key='index'
						@click="screenChange(item,index)">
						<view class="font-24" style="line-height: 24rpx;transition: 0.2s;"
							:style="[{color:defaltIndex==index?'#324B78':'#666'},{fontWeight:defaltIndex==index?'bold':'500'}]">
							{{item.name}}
						</view>
						<view class="flex flex-direction flex-center icon-class" style="margin-left: 10rpx;">
							<text class="iconfont icon-zelvxuanzefeiyongzhengsanjiaoxingzhichi"
								style="font-size: 20rpx;line-height: 16rpx;"
								:style="{color:defaltIndex==index&&item.flag&&isCheck?'#324B78':'#999'}"></text>
							<text class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"
								style="font-size: 20rpx;line-height: 16rpx;"
								:style="{color:defaltIndex==index&&!item.flag&&!isCheck?'#324B78':'#999'}"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="box-content-main flex-1">
				<view style="height: 100%;background: rgba(255,255,255,0.8);" v-if="!isLoad">
					<loading />
				</view>
				<z-paging ref="paging" @query="getGoodsList" :list.sync="dataList" :use-custom-refresher="true"
					style="height: 100%;" :fixed='false' emptyViewText='暂无任何商品' @scroll="scrollMain">
					<goods-square :dataList='dataList' @details='goodsDetails' @clickShopping='shoppingIcoClick'
						v-if="!isTab&&isLoad" />
					<goods-list :dataList='dataList' @details='goodsDetails' @clickShopping='shoppingIcoClick'
						v-if="isTab&&isLoad" />
				</z-paging>
			</view>
		</view>
		<uni-popup ref="selectPopup" type="bottom">
			<select-product :dataInfo='dataInfo' @checkActive='checkActive' @close='popupClose' />
		</uni-popup>
	</view>
</template>

<script>
	import mixins from '../../static/js/mixins.js'
	export default {
		mixins: [mixins],
		data() {
			return {
				dataList: [],
				isTab: false, //默认表格排列
				isLoad: false, //是否加载
				isSearch: false, //是否搜索
				searchVal: '', //搜索内容
				scrollTop: 0,
				isScroll: false, //是否有滚动
				options: [{
						id: 0,
						name: '价格',
						flag: false,
						up: 'priceUp', //升
						down: 'priceDown', //降
					},
					{
						id: 1,
						name: '销量',
						flag: false,
						up: 'ordersUp', //升
						down: 'ordersDown', //降
					},
					{
						id: 2,
						name: '发布时间',
						flag: false,
						up: 'addedUp', //升
						down: 'addedDown', //降
					}
				],
				defaltIndex: -1,
				orderBy: '', //筛选类别
				isCheck: false,
				dataInfo: {},
			}
		},
		onLoad() {
			this.isTab = !!uni.getStorageSync("isSwitch")
		},
		methods: {
			// 获取商品列表
			getGoodsList(index, size) {
				let vuedata = {
					page: index,
					pageSize: size,
					nameLike: this.searchVal, //商品名称模糊搜索
					orderBy: this.orderBy,
				}
				if (this.dataList.length < 0) {
					this.isLoad = false
				}
				this.apipost('shop/goods/list/v2', vuedata).then(res => {
					let list = []
					if (res.code == 0) {
						this.isLoad = true
						list = res.data.result
					}
					this.$refs.paging.addData(list);
				})
			},
			// 点击切换排列方式
			tabChange() {
				this.isTab = !this.isTab
				uni.setStorageSync("isSwitch", this.isTab)
			},

			// 跳转商品详情
			goodsDetails(id) {
				uni.navigateTo({
					url: '../../pagesSort/goodsDetails/goodsDetails?id=' + id
				})
			},
			// 获得焦点事件
			onFoucs() {
				this.isSearch = true
			},
			// 失去焦点事件
			onBlur() {
				this.isSearch = false
			},
			// 搜索事件
			searChange() {
				this.getGoodsList(1, 20)
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
				this.$refs.selectPopup.close() // 关闭弹出层方法
			},

			// 滚动事件
			scrollMain(e) {
				if (e.target.scrollTop > 180) {
					this.isScroll = true
				} else {
					this.isScroll = false
				}
			},
			// 筛选点击
			screenChange(item, index) {
				if (this.defaltIndex != index) {
					this.options[index].flag = false
				}
				this.options[index].flag = !this.options[index].flag
				this.isCheck = this.options[index].flag
				this.orderBy = this.options[index].flag ? this.options[index].up : this.options[index].down
				this.defaltIndex = index
				this.getGoodsList(1, 20)
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

			.box-content-main-wrap {
				margin-bottom: 20rpx;
				overflow: hidden;
				transition: 0.3s;

				.box-content-main-wrap-top {
					.main-wrap-ico {}

					.main-wrap-search {
						height: 70rpx;
						margin-left: 20rpx;
						padding: 0 20rpx;
						box-sizing: border-box;
						background: #f7f7f7;
						border-radius: 32rpx;

						input {
							padding-left: 10rpx;
							font-size: 24rpx;
						}
					}

					.main-wrap-search-text {
						overflow: hidden;
						transition: 0.3s;
						color: #333;
					}
				}

				.box-content-main-wrap-bottom {
					.main-wrap-bottom-item {
						height: 70rpx;

						.icon-class {
							text {
								transform: scale(0.8);
							}
						}
					}
				}
			}

			.box-content-main {
				height: 100%;

			}
		}

		.box-footer {}
	}
</style>
