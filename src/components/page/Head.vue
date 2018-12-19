<template>
	<div class="header">

		<div class="welcome">欢迎<span class="username">&nbsp;<slot name="username"></slot>&nbsp;</span>来到大数据仿真系统</div>
		<div class="user-info">
			<el-dropdown trigger="click" @command="handleCommand">
				<div class="head-icon">
					<img :src="thumbImg"/>
					<span class="username"><slot name="_username"></slot></span>
				</div>
				<el-dropdown-menu>
					<el-dropdown-item command="know">了解该系统</el-dropdown-item>
					<el-dropdown-item command="resetPwd">修改密码</el-dropdown-item>
					<el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
					<el-dropdown-item command="exit" divided>退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<div class="menu">
			<el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" @open="handleOpen" @close="handleClose"
			  background-color="#242f42" text-color="#fff" active-text-color="#ffd04b" router>

                <el-menu-item index="/page/TaskManage">
                    任务管理
                </el-menu-item>
                <el-menu-item index="/page/IndexConfig" >
                    指标配置
                </el-menu-item>
                <el-menu-item index="/page/SensAnalyse">
                    灵敏度分析
                </el-menu-item>
                <el-menu-item index="/page/ModuleConfig">
                    模型配置
                </el-menu-item>
                <el-menu-item index="/page/IndexBinding">
                    数据绑定
                </el-menu-item>
			</el-menu>
		</div>
		
	</div>
</template>

<script type="text/javascript">
	export default {
		data () {
			return {
				activeIndex:"/page/layout",
                index:"",
				thumbImg:localStorage.getItem('img'),
			}
		},
		methods:{
			handleCommand (command) {
				if(command == "know"){
					this.$router.push('/page/readme');
				}else if(command == "resetPwd"){
					this.$router.push('/page/resetPwd');
				}else if(command == "exit"){
					localStorage.removeItem("user-name");
					this.$router.push('/');
				}else if(command == "personalCenter"){
					this.$router.push('/page/personalCenter');
				}
			},
			handleSelect (key, keyPath) {

			},
			handleOpen (key, keyPath) {

			},
			handleClose (key, keyPath) {

			}
		},
        mounted() {
            this.thumbImg=localStorage.getItem('img');
            URL.revokeObjectURL(localStorage.getItem('img'));
        }
    }
</script>

<style>
	.header {
        position: relative;
        width: 100%;
        height: 60px;
        font-size: 22px;
        line-height: 60px;
        color:#fff;
        background-color:#242f42;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .header .welcome {
    	position:absolute;
    	left:20%;
    	top:50%;
    	-webit-transform:translate3d(-50%,-50%,0);
    	transform:translate3d(-50%,-50%,0);
    }
    .username{
    	color:#ff3333;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
        cursor:pointer;
    }
    .user-info img{
        width:40px;
        height:40px;
        border-radius: 50%;
        vertical-align:middle;
        margin-right:15px;
    }

    .menu {
    	display: inline-block;
    	float: right;
    	padding-top: 0px;
    	margin-right: 30px;
    }

</style>
