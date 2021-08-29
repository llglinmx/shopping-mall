import httpClient from '../static/js/ajax.js'

export function get(url, params) {
	return httpClient.Get(url, params)
};
export function post(url, params) {
	return httpClient.Post(url, params)
};
export function put(url, params) {
	return httpClient.Put(url, params)
};
export function del(url, params) {
	return httpClient.Delete(url, params)
};

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		isUpdate: false, //用于是否修改或更新
	},
	mutations: {
		//用于判断是否添加/修改 等同于发送监听
		upDate(state, bool) {
			state.isUpdate = bool
		},
		
	},
	actions: {}
})
export default store
