<template>
    <div class="wraper">
        <div class="login-wrap">
            <div class="login-wrap-title">大数据仿真平台</div>
            <div
                class="avatar-uploader"
                align="center">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="avatar"></i>
            </div>
            <div class="login-wrap-from" align="center">
                <el-form :model="userInfo" :rules="rules" ref="form" label-width="0px" class="userinfo">
                    <el-form-item prop="username">
                        <el-input v-model="userInfo.username" name="username" placeholder="请输入用户名"
                                  @change="checkUserName"/>
                    </el-form-item>
                    <el-form-item prop="userpwd">
                        <el-input v-model="userInfo.userpwd" name="age" type="password" placeholder="请输入密码"
                                  @keyup.enter.native="login"/>
                        <!-- .native的意思就是当你给一个vue组件绑定事件时候，要加上native！如果是普通的html元素！就不需要-->
                    </el-form-item>


                    <el-button round type="primary" @click="login"> 登 录</el-button>
                    <el-button round type="primary" @click="register"> 注 册</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        data() {

            return {
                imageUrl: '',
                userInfo: {
                    username: "",
                    userpwd: "",
                    image: ""
                },
                rules: {
                    username: [
                        {required: true, message: "请输入用户名", trigger: 'blur'}
                    ],
                    userpwd: [
                        {required: true, message: "请输入密码", trigger: 'blur'}
                    ]
                },
                users: []
            }


        },
        methods: {
            login() {
                let isSuccess = false;
                let self = this;
                for (let i = 0; i < this.users.length; i++) {
                    if (this.userInfo.username === this.users[i].username && this.userInfo.userpwd === this.users[i].password) {
                        isSuccess = true;
                        break;
                    }
                }
                if (isSuccess) {
                    this.$message.success("登录成功!");
                    localStorage.setItem('user-name', self.userInfo.username);
                    localStorage.setItem('user-pwd', self.userInfo.userpwd);
                    this.$router.push('./page');
                } else {
                    this.$message.warning("账号或者密码有误");
                }
            },
            register() {
                this.$router.push('./register')
            },
            checkUserName() {
                let isExist = false;
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].username === this.userInfo.username) {
                        isExist = true;
                        this.userInfo.image = this.users[i].image;
                        break;
                    }
                }
                if (!isExist) {
                    this.$message.warning("用户名不存在");
                    return;
                }
                this.getImg(this.userInfo.image);
            },
            getImg(imageName) {
                let self = this;
                self.$axios.post('/api/image/getImg', {filename: imageName}, {responseType: "blob"}).then((res) => {
                    //let src='data:image/jpg;base64,'+ btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                    //let url=URL.createObjectURL(new Blob([src], {type: "image/jpg"}));
                    self.imageUrl = URL.createObjectURL(res.data);
                    localStorage.setItem('img', self.imageUrl);
                })
            },
            getUsers() {
                const self = this;
                self.$axios.post('/api/user/listUser').then((res) => {
                    self.users = [];
                    res.data.some(item => {
                        self.users.push({
                            username: item.username,
                            password: item.password,
                            image: item.image
                        })
                    });
                });
            }

        },
        mounted() {

            this.getUsers();
            this.getImg('static/img/unamed.jpg');
        }
    }


</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #39d930;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

    }

    .avatar-uploader :hover {
        border-color: #fd6cff;
        position: center;
    }


    .avatar {
        width: 178px;
        height: 178px;
        -moz-border-radius: 50px;
        -webkit-border-radius: 50px;
        border-radius: 89px;
        display: block;
    }

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
