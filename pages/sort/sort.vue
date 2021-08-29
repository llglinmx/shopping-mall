<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<view class="box-header-search paddingLR flex align-center">
				<view class="box-header-search-main flex align-center" @click="tabClickList">
					<uni-icons type="search" size="16" color="#999"></uni-icons>
					<text class="font-24" style="color: #999;margin-left: 15rpx;">请输入需要搜索的商品</text>
				</view>
			</view>
		</view>
		<view class="box-content flex-1 scroll-y">
			<view class="box-content-main flex">
				<view class="box-content-left">
					<menu-list :dataList='leftList' @menuClick='leftClick' />
				</view>
				<view class="box-content-right flex-1">
					<loading v-if="!isLoad" />
					<no-data msg="商家正在努力上新中" v-if="!isData" />
					<data-list :dataList="goodsList" @clickShopping='shoppingIcoClick' v-if="isData" />
				</view>
			</view>
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
				leftList: [],
				arrId: [], //用于存储分类id
				goodsList: [],
				currIndex: 0,
				isData: false, //是否有有数据
				isLoad: false, //是否加载
				dataInfo: {}
			}
		},
		onLoad() {
			this.getMenu()
		},
		methods: {
			// 左侧菜单栏点击
			leftClick(e) {
				if (this.currIndex == e.index) return
				this.currIndex = e.index
				this.arrId = [] //得赋值为空不然会出现错误数据
				this.getRightData(e.id)
				this.isLoad = false
			},

			// 获取左侧菜单栏
			getMenu() {
				this.apiget('shop/goods/category/all', {}).then(res => {
					res.data.map((item, index) => {
						if (item.level == 1) {
							this.leftList.push(item)
						}
					})
					let id = this.leftList[0].id
					this.getRightData(id)
				})
			},
			// 获取右侧商品数据
			getRightData(id) {
				this.apiget('shop/goods/list', {
					categoryId: id
				}).then(res => {
					if (res.code == 0) {
						// 循环push 当前商品的 categoryId , 放到一个数组里
						res.data.forEach(element => {
							this.arrId.push(element.categoryId)
						});
						this.sortTitle(res.data)
					} else if (res.code == 700) {
						this.isLoad = true
						this.isData = false
						// console.log("暂无数据")
					}
				})
			},

			// 获取分类标题
			async sortTitle(data) {
				let arr = [...new Set(this.arrId)]
				let arrlist = []
				let goodArr = []
				let str = {}
				// 判断是否有分类 
				if (arr.length == 0) return

				for (let i = 0; i < arr.length; i++) {
					let res = await this.apiget('/shop/goods/category/info', {
						id: arr[i]
					})
					if (res.code == 0) {
						data.map(e => {
							if (e.categoryId == arr[i]) {
								goodArr.push(e)
								str = {
									name: res.data.info.name,
									data: goodArr
								}
							}
						})
						arrlist.push(str)
						goodArr = []
					}
				}

				this.goodsList = arrlist
				this.isLoad = true
				// 判断是否有数据  无数据暂时无数据背景
				if (this.goodsList.length <= 0) return
				this.isData = true
			},
			// 跳转商品列表页 
			tabClickList() {
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

			.box-header-search {
				height: 88rpx;

				.box-header-search-main {
					width: 480rpx;
					height: 60rpx;
					padding: 0 32rpx;
					box-sizing: border-box;
					border-radius: 40rpx;
					background: #fff;
				}
			}
		}

		.box-content {
			width: 100%;

			.box-content-main {
				height: 100%;

				.box-content-left {
					height: 100%;
					width: 200rpx;
					background: #f7f7f7;
				}

				.box-content-right {}
			}

		}

		.box-footer {}
	}
</style>
