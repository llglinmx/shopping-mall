<template>
	<view class="select-product paddingLR flex flex-direction">
		<view class="select-product-header flex align-center">
			<view class="select-product-header-image flex-center">
				<image :src="imgUrl" mode="aspectFill"></image>
			</view>
			<view class="select-product-header-info flex-1 flex flex-direction justify-around">
				<view class="header-info-price flex align-baseline color-ff1f1f">
					<text class="font-26">￥</text>
					<text class="font-40" style="font-weight: 700;">{{goodsPrice}}</text>
				</view>
				<view class="header-info-stock font-24" style="color: #999;">
					<text>库存</text>
					<text>{{storesNums}}</text>
				</view>
				<view class="header-info-msg font-24 color-333">
					{{goodsTitle}}
				</view>
			</view>
			<view class="header-close flex-center" @click="closePopup">
				<uni-icons type="closeempty" size="22" color="#333"></uni-icons>
			</view>
		</view>
		<view class="select-product-content flex-1 scroll-y flex justify-center flex-direction">
			<view class="popup-goods-content flex-1 scroll-y"
				v-if="dataInfo&&dataInfo.properties&&dataInfo.properties.length!=0">
				<view class="popup-goods-li" v-for="(item,index) in dataInfo.properties" :key="item.id">
					<view class="popup-content-title font-28">
						{{item.name}}
					</view>
					<view class="popup-content-box flex flex-wrap">
						<view class="popup-content-box-li flex-center" :class="el.active?'active':''"
							v-for="(el,idx) in item.childsCurGoods" :key="el.id" @click="checkList(index,idx)">
							{{el.name}}
						</view>
					</view>
				</view>
			</view>
			<view class="purchase-nums flex align-center justify-between">
				<view class="font-26 color-333">
					购买数量
				</view>
			</view>
		</view>
		<view class="select-product-footer font-24 flex safety-zone" v-if="type=='icon'">
			<view class="select-product-footer-item flex-center flex-1" hover-class="hover-active"
				@click="btnClick('shopping')">加入购物车</view>
			<view class="select-product-footer-item flex-center flex-1" hover-class="hover-active"
				@click="btnClick('purchase')">立即购买</view>
		</view>
		<view class="select-product-footer font-24 flex safety-zone" v-if="type=='shopping'">
			<view class="select-product-footer-btn flex-center flex-1" hover-class="hover-active"
				@click="btnClick('shopping')">加入购物车</view>
		</view>
		<view class="select-product-footer font-24 flex safety-zone" v-if="type=='purchase'">
			<view class="select-product-footer-btn flex-center flex-1" hover-class="hover-active"
				@click="btnClick('purchase')">立即购买</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "select-product",
		data() {
			return {
				imgUrl: '',
				goodsTitle: '暂无选择', //标题
				goodsPrice: '', //价格
				storesNums: 0, //库存数量
				isCheck: false,
				objData: {},
				pirchaseNums: 1,
			};
		},
		props: {
			dataInfo: {
				type: Object,
				default: () => ({})
			},
			type: {
				type: String,
				default: 'icon',
				// icon 表示点击图标弹起来  shopping 表示点击加入购物车按钮进来  purchase表示点击购买按钮  
			}
		},
		watch: {
			dataInfo(val) {
				this.objData = val
				this.imgUrl = this.objData.basicInfo.pic // 设置初始图片
				this.goodsPrice = this.objData["basicInfo"]["minPrice"] // 设置初始价格

				this.storesNums = this.objData["basicInfo"]["stores"] // 库存数量
				this.goodsTitle = "暂未选择"
				// 判断是否没有规格
				if (!this.objData.properties) {
					this.isStores = true
					this.goodsTitle = this.objData['basicInfo']['name'] // 单规格直接拿到商品名称
				}
			}
		},
		mounted() {
			this.objData = this.dataInfo
			// 设置初始内容
			this.goodsPrice = this.objData["basicInfo"]["minPrice"] // 设置初始价格
			this.stores = this.objData["basicInfo"]["stores"] // 库存数量
			this.goodsTitle = "暂未选择"
			this.imgUrl = this.objData.basicInfo.pic

		},
		methods: {
			checkList(index, idx) {
				const property = this.objData.properties[index]
				const child = property.childsCurGoods[idx]

				this.objData.properties[index].childsCurGoods.forEach(child => {
					child.active = false
				})

				this.objData.properties[index].childsCurGoods[idx].active = true

				let propertyChildIds = "";
				let propertyChildNames = ""; //
				let popertyTitle = ''; //已选商品
				let str = {};
				let isImg = '' // 用来获取当前点击时那种规格 然后显示对应的图片

				this.objData.properties.map(p => {
					p.childsCurGoods.map(c => {
						if (c.active) {
							propertyChildIds = propertyChildIds + p.id + ":" + c.id + ",";
							propertyChildNames = propertyChildNames + p.name + ":" + c.name + "  ";
							popertyTitle = popertyTitle + c.name + ' / ' // 已选商品标题
							isImg = c.id

							// 循环图片列表 ,选中对应的图片
							this.objData.subPics.map(item => {
								if (item.optionValueId == c.id) {
									this.imgUrl = item.pic
								}
							})

						}
					})
				})

				let data = {
					goodsId: this.objData.basicInfo.id,
					propertyChildIds: propertyChildIds,
					token: uni.getStorageSync("token")
				}
				this.getPrice(data) // 获取价格及库存数量
				// 更新组件内部值
				this.$emit("checkActive", this.objData)
			},
			// 获取价格
			getPrice(data) {
				this.apipost('shop/goods/price', data).then(res => {
					if (res.code == 0) {
						this.goodsTitle = '已选：' + res.data.propertyChildNames // 已选商品
						this.goodsPrice = res.data.price // 价格
						this.storesNums = res.data.stores // 库存数量
						this.isCheck = true // 用来判断是否选择了规格数量
					} else if (res.code = 405) {
						this.goodsTitle = res.msg
					}
				})
			},

			btnClick(type) {
				let optionsArr = {}
				if (this.objData.properties) {
					const skuLength = this.objData.properties.length // 有几组SKU
					let sku = []
					this.objData.properties.forEach(p => {
						const o = p.childsCurGoods.find(ele => {
							return ele.active
						})
						if (!o) {
							return
						}
						sku.push({
							optionId: o.propertyId,
							optionValueId: o.id
						})
					})

					if (sku.length != skuLength) {
						uni.showToast({
							title: '请选择规格',
							icon: 'none'
						})
						return
					}
					optionsArr = {
						sku: sku,
						id: this.objData.basicInfo.id,
						number: this.pirchaseNums
					}
				} else {
					optionsArr = {
						id: this.objData.basicInfo.id,
						number: this.pirchaseNums,
						sku: []
					}
				}


				switch (type) {
					case 'shopping': //加入购物车

						this.shoppingAdd(optionsArr)
						break;
					case 'purchase': //购买
						break;
				}
			},

			// 购物车添加商品
			shoppingAdd(e) {
				let vuedata = {
					goodsId: e.id,
					number: e.number,
					sku: JSON.stringify(e.sku),
					token: uni.getStorageSync("token")
				}

				this.apipost('shopping-cart/add', vuedata).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '购物车添加成功',
							icon: 'none'
						})
						this.closePopup()
						this.getData()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'nones'
						})
					}
				})
			},
			closePopup() {
				this.$emit('close')
			},

			// 获取购物车数据
			getData(index, size) {
				let vuedata = {
					token: uni.getStorageSync("token")
				}
				this.apiget('shopping-cart/info', vuedata).then(res => {
					let list = []
					if (res.code == 0) {
						uni.setTabBarBadge({
							index: 2,
							text: "" + res.data.items.length + "",
							success: (res) => {}
						})
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.select-product {
		width: 100%;
		min-height: 500rpx;
		background: #fff;
		border-radius: 10rpx 10rpx 0 0;

		.select-product-header {
			position: relative;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #ededed;
			box-sizing: border-box;

			.select-product-header-image {
				image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 10rpx;
				}
			}

			.select-product-header-info {
				height: 140rpx;
				margin-left: 20rpx;

				.header-info-msg {
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.header-close {
				position: absolute;
				right: 0;
				top: 0;
				width: 50rpx;
				height: 80rpx;
			}
		}

		.select-product-content {
			.popup-goods-content {
				flex: 1;
				overflow-y: scroll;

				.popup-goods-li {
					.popup-content-title {
						padding: 30rpx 0;
						font-weight: 500;
						color: #000;
					}

					.popup-content-box {

						.popup-content-box-li {
							max-width: 427rpx;
							min-width: 120rpx;
							height: 50rpx;
							padding: 0 25rpx;
							box-sizing: border-box;
							margin: 0 20rpx 20rpx;
							border: 1px solid #eee;
							background: #eee;
							border-radius: 50rpx;
							font-size: 28rpx;
							color: #999;
						}

						.active {
							color: #324B78 !important;
							border: 1px solid #324B78 !important;
							background: #dce5f5;
						}
					}
				}
			}

			.purchase-nums {
				width: 100%;
				height: 80rpx;
			}
		}

		.select-product-footer {
			margin-top: 20rpx;
			box-sizing: border-box;

			.select-product-footer-btn {
				height: 78rpx;
				color: #fff;
				background: #324B78;
				border-radius: 40rpx;
				margin: 20rpx 0;
			}

			.select-product-footer-item {
				margin: 20rpx 0;
				height: 78rpx;
				color: #fff;
			}

			.select-product-footer-item:nth-child(1) {
				background: #526D9E;
				border-radius: 40rpx 0 0 40rpx;
			}

			.select-product-footer-item:nth-child(2) {
				background: #324B78;
				border-radius: 0 40rpx 40rpx 0;
			}
		}
	}
</style>
