import baseconfig from "./baseconfig.js"
const httpClient = {
	request: function(method, url, data) {
		var headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				header: headers,
				data: data,
				method: method,
				dataType: 'json',
				success: function(res) {
					if (res.statusCode == 402) {
						uni.showToast({
							icon: 'none',
							duration: 1000,
							title: '登录过期,请重新登录'
						});

					} else if (res.statusCode == 400) {

					} else {
						//  2000:当前登录token无效 则清除token
						if (res.data.code == 2000) {
							uni.showToast({
								icon: 'none',
								duration: 1000,
								title: '登录过期,请重新登录'
							});
							uni.removeStorageSync("token")
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
						resolve(res.data);
					}
				},
				fail: function(err) {
					// uni.hideLoading()
					reject(err)
				}
			})
		})
	},
	Get: function(url, data) {
		let allurl = this.geturl(url);
		return this.request('GET', allurl, data)
	},
	Post: function(url, data) {
		let allurl = this.geturl(url);
		return this.request('POST', allurl, data)
	},
	Put: function(url, data) {
		let allurl = this.geturl(url);
		return this.request('PUT', allurl, data)
	},

	Delete: function(url, data) {
		let allurl = this.geturl(url);
		return this.request('DELETE', allurl, data)
	},
	geturl: function(url) {
		return baseconfig.server + url
	}
};

module.exports = httpClient
