<template>
    <div class="wraper">
        <div class="login-wrap">
            <div class="login-wrap-title">图书管理系统</div>
            <div class="login-wrap-from" align="center">
                <el-form :model="userInfo" :rules="rules" ref="form" label-width="0px" class="userinfo">
                    <el-form-item prop="username">
                        <el-input v-model="userInfo.username" name="username" placeholder="请输入用户名"/>
                    </el-form-item>
                    <el-form-item prop="userpwd">
                        <el-input v-model="userInfo.userpwd" name="age" type="password" placeholder="请输入密码"
                                  @keyup.enter.native="submit('form')"/>
                        <!-- .native的意思就是当你给一个vue组件绑定事件时候，要加上native！如果是普通的html元素！就不需要-->
                    </el-form-item>


                    <el-button round type="primary" @click="login" > 登 录</el-button>
                    <el-button round type="primary" @click="register" > 注 册</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        data() {

            return {

                userInfo: {
                    username: "",
                    userpwd: ""
                },
                rules: {
                    username: [
                        {required: true, message: "请输入用户名", trigger: 'blur'}
                    ],
                    userpwd: [
                        {required: true, message: "请输入密码", trigger: 'blur'}
                    ]
                },
                libuser:[]
            }


        },
        methods: {
            submit(formname) {
                let self = this;
                self.$refs[formname].validate(
                    (valid) => {
                        if (valid) {
                            self.testUser();
                        } else {
                            console.error("登陆失败");
                            return false;
                        }
                    }
                )
            },
            login() {
                const self = this;
                self.$axios.post('/api/user/listUser').then((res) => {
                     self.tableData = [];
                     res.data.some(item => {
                        self.libuser.push({
                                userid:item.userid,
                                username:item.username,
                                password:item.password,
                            }

                        );
                    });
                    let i=0;
                    for(i=0;i<self.libuser.length;i++)
                    {
                        if(self.libuser[i].username===self.userInfo.username&&self.libuser[i].password===self.userInfo.userpwd)
                        {
                            localStorage.setItem('user-name', self.userInfo.username);
                            localStorage.setItem('user-pwd', self.userInfo.userpwd);
                            localStorage.setItem('user-id', self.libuser[i].userid);
                            console.log(self.libuser[i].userid);
                            self.$router.push('./page');
                            break;
                        }

                    }
                    if(i<self.libuser.length)
                        self.$message.success("登录成功!");
                    else
                        self.$message.warning("账号或者密码有误");

                });
            },
            testUser() {
                const self = this;
                if (process.env.NODE_ENV === 'development') {
                    self.url = 'static/data/account.json';
                }

                self.$axios.get(self.url).then((res) => {
                    let rel = res.data.some(item => {
                        return item.name === self.userInfo.username && item.password === self.userInfo.userpwd;
                    });
                    if (rel) {
                        localStorage.setItem('user-name', self.userInfo.username);
                        localStorage.setItem('user-pwd', self.userInfo.userpwd);
                        self.$router.push('./page');
                    } else {
                        self.$message.warning("账号或者密码有误");
                    }
                });
            },
            register() {
                this.$router.push('./register')
            },
            addUser() {
                let username = this.userInfo.username;
                let password = this.userInfo.userpwd;
                let flag = false;
                this.$http.post('/api/user/addUser', {
                    username: username,
                    password: password
                }, {}).then((response) => {

                    let result = response.data;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].username == username && result[i].password == password) {
                            flag = true;
                            break;
                        }
                    }
                })
                if (!flag)
                    this.$message.warning("账户或密码错误");
                else {
                    this.$message.success("登录成功!");
                    this.$router.push('./page')
                }
            }
        }
    }


</script>

<style scoped>
    .wraper {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #324157;
    }

    .login-wrap {
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
    }

    .login-wrap-title {
        font-size: 30px;
        color: #fff;
        margin-bottom: 20px;
        text-align: center;
    }

    .login-wrap-from {
        width: 400px;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
    }

    .login-btn button {
        width: 100%;
        margin-bottom: 20px;
    }

    .login-til {
        font-size: 12px;
        color: #ff3333;
    }
</style>
