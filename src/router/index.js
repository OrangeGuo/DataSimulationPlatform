import Vue from 'vue';
import Router from 'vue-router';

/* 以下为页面组件 */
import Login from '../views/page/Login';	//登录页
import Register from '../views/page/Register';
import BookList from '../views/page/BookList';

import BookBorrowed from '../views/page/BookBorrowed'
import BookManage from '../views/page/BookManage'
import UserManage from '../views/page/UserManage'
import Page from '../components/page/Page';	//主页面模板
import Readme from '../views/page/Readme';	//了解系统
import ResetPwd from '../views/page/ResetPwd';//重置密码
import PersonalCenter from '../views/page/PersonalCenter';	//个人中心

//业务组件
//表格组件


















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
            redirect: '/page/bookList',
            children: [
                {
                    path: 'bookManage',
                    component: BookManage
                },
                {
                    path: 'userManage',
                    component: UserManage
                },
                {
                    path: 'bookList',
                    component: BookList
                },
                {
                    path: 'bookBorrowed',
                    component: BookBorrowed
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
