<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
			<uni-nav-bar left-icon="arrowleft" :border='false' :title="type=='add'?'添加地址':'编辑地址'" @clickLeft="Gback" />
		</view>
		<view class="box-content flex-1 scroll-y paddingLR">
			<view class="box-content-list">
				<view class="box-content-list-li flex align-center">
					<view class="box-content-list-li-title font-24">
						联系人：
					</view>
					<view class="box-content-list-li-info flex-1">
						<input type="text" class="list-input" placeholder="请输入联系人" maxlength="8" />
					</view>
					<view class="box-content-list-li-ico">

					</view>
				</view>
				<view class="box-content-list-li flex align-center">
					<view class="box-content-list-li-title font-24">
						手机号：
					</view>
					<view class="box-content-list-li-info flex-1">
						<input type="number" class="list-input" placeholder="请输入联系人手机号" maxlength="11" />
					</view>
					<view class="box-content-list-li-ico">

					</view>
				</view>
				<view class="box-content-list-li flex align-center">
					<view class="box-content-list-li-title font-24">
						所在地区：
					</view>
					<view class="box-content-list-li-info flex-1 flex align-center">
						<text class="font-24" style="color: #808080;">选择地区</text>
					</view>
					<view class="box-content-list-li-ico">
						<uni-icons type="arrowright" size="16" color="#333"></uni-icons>
					</view>
				</view>
				<view class="box-content-list-li flex align-center">
					<view class="box-content-list-li-title font-24">
						详细地址：
					</view>
					<view class="box-content-list-li-info flex-1">
						<input type="text" class="list-input" placeholder="请输入详细地址" />
					</view>
					<view class="box-content-list-li-ico">

					</view>
				</view>
				<view class="box-content-list-li flex align-center">
					<view class="box-content-list-li-title font-24">
						是否默认地址：
					</view>
					<view class="box-content-list-li-info flex-1">
						<text class="font-24"></text>
					</view>
					<view class="box-content-list-li-ico">
						<switch @change="switchChange" style="transform: scale(0.6);" color='#324B78' />
					</view>
				</view>

			</view>
			<view class="box-content-btn">
				<shopping-button :text="type=='add'?'确认添加':'确认修改'" @click='confirmBtn' />
			</view>
		</view>
	</view>
</template>

<script>
	import mixins from '../../static/js/mixins.js'
	export default {
		mixins: [mixins],
		data() {
			return {
				type: 'add', //用于判断是添加地址还是编辑地址
			}
		},
		onLoad(options) {

		},
		
		methods: {
			// 按钮
			confirmBtn() {
				let vuedata = {
					address: '',

				}
				switch (this.type) {
					case 'add': //添加
						return false
						this.apipost('user/shipping-address/add', vuedata).then(res => {
							if (res.code == 0) {
								uni.showToast({
									title: '添加成功',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})
						break;
					case 'edit': //修改
						break;
				}
			},
			switchChange(e) {
				console.log('switch1 发生 change 事件，携带值为', e.target.value)
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

			.box-content-list {
				.box-content-list-li {
					padding: 30rpx 0;
					box-sizing: border-box;
					border-bottom: 1rpx solid #ededed;
					color: #333;

					.box-content-list-li-title {}

					.box-content-list-li-info {
						margin: 0 10rpx;

						.list-input {
							width: 100%;
							font-size: 24rpx;
						}
					}

					.box-content-list-li-ico {}
				}
			}

			.box-content-btn {
				margin-top: 100rpx;
			}
		}

		.box-footer {}
	}
</style>
