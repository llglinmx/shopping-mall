<template>
	<view class="nav-bar"></view>
</template>

<script>
	export default {
		name: "status-bar",
		data() {
			return {

			};
		},
		mounted() {
			// uni.getSystemInfo({
			// 	success: (res) => {
			// 		console.log(res.statusBarHeight)
			// 	}
			// });
		},
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
