<template>
	<view class="box flex flex-direction">
		<view class="box-header">
			<status-bar />
		</view>
		<view class="box-content flex-1 scroll-y">

		</view>
		<view class="box-footer">

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.box {
		width: 100%;
		height: 100%;
		background: #F8F8F8;

		.box-header {}

		.box-content {
			width: 100%;
		}

		.box-footer {}
	}
</style>
