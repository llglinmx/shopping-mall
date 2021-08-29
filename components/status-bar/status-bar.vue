<template>
	<view class="nav-bar" :style="{height:Hg+'px'}"></view>
</template>

<script>
	export default {
		name: "status-bar",
		data() {
			return {
				Hg:0,
			};
		},
		created() {
			uni.getSystemInfo({
				success: (res) => {
					this.Hg = res.statusBarHeight
				}
			});
		},
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
