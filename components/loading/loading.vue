<template>
	<view class="loading">
		<view class="loader-inner ball-clip-rotate-multiple">
			<view></view>
			<view></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "loading",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../static/css/loaders.min.css";

	.loading {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
