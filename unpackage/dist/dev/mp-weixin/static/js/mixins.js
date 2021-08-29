const mixins = {
	data() {
		return {

		}
	},
	created() {

	},
	methods: {
		// 预览图片多张
		previewImg(imageList, index) {
			let imgsArray = [];

			if (Array.isArray(imageList)) {
				imgsArray = imageList
			} else {
				imgsArray.push(imageList)
			}

			uni.previewImage({
				current: index,
				urls: imgsArray,
				// loop: true
			});
		},
		// 返回
		Gback() {
			uni.navigateBack({
				delta: 1
			})
		},
	}
}
export default mixins;
