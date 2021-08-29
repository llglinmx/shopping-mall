<template>
	<view class="banner">
		<swiper class="swiper" indicator-dots="true" autoplay="true" interval="3000" duration="1000" indicator-active-color="#fff"
		 circular="true">
			<swiper-item v-for="(item , index) in bannerList" :key="index" class="swiper-item">
				<image :src="item.picUrl" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name:'swiper-banner',
		data() {
			return {
				bannerList:[],
			}
		},
		onLoad() {

		},
		mounted() {
			// console.log(this.ImgList)
			this.getBanner()
		},
		methods: {
			getBanner(){
				this.apiget('banner/list',{}).then(res=>{
					if(res.code==0){
						this.bannerList = res.data
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.banner {
		width: 100%;
		height: 100%;
		/* padding:0 20rpx; */
		box-sizing: border-box;
		// border-radius: 20rpx;
		background: #fff;

		.swiper {
			// width: 686rpx;
			// height: 288rpx;
			width: 100%;
			height: 100%;
			margin: auto;
			// border-radius: 20rpx;

			.swiper-item {
				height: 100%;

				image {
					width: 100%;
					height: 100%;
					// border-radius: 20rpx;
				}
			}

		}
	}
</style>
