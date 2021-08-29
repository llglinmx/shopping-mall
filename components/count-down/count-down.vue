<template>
	<view class="down font-24 color-ff1f1f">
		{{timeData}}
	</view>
</template>

<script>
	export default {
		name: "count-down",
		data() {
			return {
				timeData: ''
			};
		},
		props: {
			time: {
				type: String,
				default: ''
			}
		},
		mounted() {
			this.getTimeList(this.time)
			let timer = setInterval(() => {
				this.getTimeList(this.time)
			}, 1000)
		},
		methods: {
			// 换算日期时间
			getTimeList(endTime) {
				let nowdate = new Date().getTime() //获取当前时间毫秒数
				let time = endTime.replace(new RegExp("-", "gm"), "/") //ios不能识别日期格式中的 "-" ； .productExpiredTime是接口返回的名称
				let enddate = new Date(time).getTime() //处理好格式之后获取结束时间的毫秒数
				let totaltime = enddate - nowdate //获取时间差
				this.totaltime(totaltime) //这是下面封装的方法，将毫秒数处理成"xx时xx分xx秒"
			},

			totaltime(a) { //计算单个剩余时间
				let totaltime = a
				let that = this
				var h, m, s, d

				function test(num) {
					if (num < 10) {
						num = "0" + num
					}
					return num
				}
				if (totaltime > 0) {
					d = Math.floor(totaltime / 1000 / 60 / 60 / 24) * 24
					h = Math.floor(totaltime / 1000 / 60 / 60 % 24)
					m = Math.floor(totaltime / 1000 / 60 % 60)
					s = Math.floor(totaltime / 1000 % 60)
					//获取时分秒
					h = d + h
					h = test(h)
					m = test(m)
					s = test(s)
					// this.timeData = `${m}分钟之后自动取消订单` // 每个时间的显示格式
					this.timeData = "距离订单关闭还有:" + `${h}:${m}:${s}` // 每个时间的显示格式
					// this.timeData = "距离订单关闭还有:" + `${m}分 : ${s}秒` // 每个时间的显示格式
				} else {
					// this.timeData = `00 : 00 : 00`
					this.timeData = ``
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.down {}
</style>
