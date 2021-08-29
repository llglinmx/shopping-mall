import App from './App'
import store from './store'

import {
	get,
	post,
	put,
	del,
} from './store/index.js'
Vue.prototype.apiget = get
Vue.prototype.apipost = post
Vue.prototype.apiput = put
Vue.prototype.apidelte = del
Vue.prototype.$store = store
Vue.config.productionTip = false

// #ifndef VUE3
import Vue from 'vue'
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app,
		store
	}
}
// #endif
