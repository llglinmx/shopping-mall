<template>
	<view class="menu-box">
		<view class="menu-left" :style="{'--top':topVar}">
			<view :id="'item'+index" class="menu-item flex-center" :class="activeIndex==index?'menu-item-active':''"
				v-for="(item,index) in dataList" :key='index' @click="clickTab(index,item.id)">
				<text class="font-28">{{item.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "menu-list",
		data() {
			return {
				activeIndex: 0,
				menuList: [],
				topVar: '0px',
				height: 0,
			};
		},
		props: {
			dataList: {
				type: Array,
				default: () => ({})
			}
		},
		mounted() {
			setTimeout(() => {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('#item0').boundingClientRect(data => {
						this.height = data.height
					}).exec();
				})
			}, 1000)
		},
		methods: {
			clickTab(index, id) {
				this.activeIndex = index
				this.topVar = this.height * index + 'px'
				this.$emit('menuClick', {
					index: index,
					id: id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.menu-box {
		overflow-y: scroll;
		height: 100%;

		.menu-left {
			position: relative;
			height: 100%;

			.menu-item {
				position: relative;
				height: 88rpx;
				transition: 0.2s;
				color: #999;
			}

			.menu-item-active {
				background: #fff;
				color: #324B77;
			}

			.menu-item-active::after {
				position: absolute;
				top: 0;
				left: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 8rpx;
				height: 100%;
				content: '';
				// background: #324B77;
			}
		}

		.menu-left::after {
			position: absolute;
			top: var(--top);
			left: 0;
			width: 8rpx;
			height: 88rpx;
			content: '';
			background: #324B77;
			transition: 0.1s;
		}
	}
</style>
