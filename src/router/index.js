import Vue from 'vue';
import Router from 'vue-router';

/* 以下为页面组件 */
import Login from '../views/page/Login';	//登录页
import Register from '../views/page/Register';
import TaskManage from '../views/page/TaskManage';
import IndexConfig from '../views/page/IndexConfig';
import SensAnalyse from '../views/page/SensAnalyse';
import BookBorrowed from '../views/page/BookBorrowed'
import Page from '../components/page/Page';	//主页面模板
import Readme from '../views/page/Readme';	//了解系统
import ResetPwd from '../views/page/ResetPwd';//重置密码
import PersonalCenter from '../views/page/PersonalCenter';	//个人中心

//业务组件
//表格组件
import Empty from '../views/page/empty.vue';




//消息通知组件
import Alert from "../views/notice/Alert.vue";
import Message from "../views/notice/Message.vue";
import Notification from "../views/notice/Notification.vue";
import Loading from "../views/notice/Loading.vue";
import Dialog from "../views/notice/Dialog.vue";
import Tip from "../views/notice/Tip.vue";
import Popover from "../views/notice/Popover.vue";


//控制面板组件
import Collapse from "../views/panel/Collapse.vue";
import Card from "../views/panel/Card.vue";









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
                    path: 'bookBorrowed',
                    component: BookBorrowed
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





                {
                    path: 'notice',
                    component: Empty,
                    children: [
                        {
                            path: 'alert',
                            component: Alert
                        },
                        {
                            path: 'message',
                            component: Message
                        }, {
                            path: "notification",
                            component: Notification
                        }, {
                            path: "loading",
                            component: Loading
                        }, {
                            path: "dialog",
                            component: Dialog
                        }, {
                            path: 'tip',
                            component: Tip
                        }, {
                            path: 'popover',
                            component: Popover
                        }
                    ]
                }, {
                    path: 'panel',
                    component: Empty,
                    children: [
                        {
                            path: 'collapse',
                            component: Collapse
                        }, {
                            path: 'card',
                            component: Card
                        }
                    ]
                }
            ]
        }
    ]
})
