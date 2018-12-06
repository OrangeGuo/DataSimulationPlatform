
import ElementUI from 'element-ui';
import axios from 'axios';// Axios 是一个基于 promise 的 HTTP 库
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
Vue.use(VueResource);
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import 'babel-polyfill';//用于解决ie9和一些低版本的高级浏览器对es6新语法并不支持的问题
import store from './store';
Vue.prototype.$axios = axios;//vue原型挂载属性
Vue.use(ElementUI);
new Vue({
	router,
    store,
	render: h => h(App)
}).$mount('#app');
