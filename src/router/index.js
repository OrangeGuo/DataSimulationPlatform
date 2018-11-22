import Vue from 'vue';
import Router from 'vue-router';

/* 以下为页面组件 */
import Login from '../views/page/Login';	//登录页
import Register from '../views/page/Register';
import TaskManage from '../views/page/TaskManage';
import IndexConfig from '../views/page/IndexConfig';
import SensAnalyse from '../views/page/SensAnalyse';
import  HomePage from '../components/HomePage';
import Page from '../components/page/Page';	//主页面模板
import Readme from '../views/page/Readme';	//了解系统
import ResetPwd from '../views/page/ResetPwd';//重置密码
import PersonalCenter from '../views/page/PersonalCenter';	//个人中心

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login' //重定向
        },
        {
            path: '/login',//登录
            //component: resolve => require(['../components/page/Login.vue'],resolve)
            component: Login
        },
        {
            path: '/register',//注册
            component: Register
        },

        {
            path: '/page',//页面主体
            component: Page,
            redirect: '/page/taskManage',
            children: [
                {
                    path: 'taskManage',
                    component: TaskManage
                },
                {
                    path: 'indexConfig',
                    component: IndexConfig
                },
                {
                    path: 'sensAnalyse',
                    component: SensAnalyse
                },
                {
                    path: 'homePage',
                    component: HomePage
                },
                {
                    path: 'readme',
                    component: Readme
                },
                {
                    path: 'resetPwd',
                    component: ResetPwd
                },
                {
                    path: 'personalCenter',
                    component: PersonalCenter
                },

            ]
        }
    ]
})
