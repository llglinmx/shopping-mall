<template>
	<view class="button flex-center font-28" :style="{background:background}" hover-class="active" @click="clickBtn">
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		name: "shopping-button",
		data() {
			return {

			};
		},
		props: {
			background: {
				type: String,
				default: '#324B78'
			},
			text: {
				type: String,
				default: '按钮'
			}
		},
		methods: {
			clickBtn() {
				this.$emit('click')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.button {
		height: 88rpx;
		border-radius: 50rpx;
		color: #fff;
	}

	.active {
		opacity: 0.5;
	}
</style>
