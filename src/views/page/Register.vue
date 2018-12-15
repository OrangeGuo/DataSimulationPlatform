<template>
    <div class="wraper">
        <div class="login-wrap">
            <div class="login-wrap-title">用户注册</div>
            <el-upload
                class="avatar-uploader"
                action="/api/user/uploadImg"
                :http-request="upLoad"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="login-wrap-from">
                <el-form :model="userInfo" :rules="rules" ref="form" label-width="0px" class="userinfo">
                    <el-form-item prop="username">
                        <el-input v-model="userInfo.username" placeholder="请输入用户名"/>
                    </el-form-item>
                    <el-form-item prop="userpwd">
                        <el-input v-model="userInfo.userpwd" type="password" placeholder="请输入密码"/>
                    </el-form-item>
                    <el-form-item prop="againpwd">
                        <el-input v-model="userInfo.againpwd" type="password" placeholder="请再次输入密码"
                                  @keyup.enter.native="submit('form')"/>
                        <!-- .native的意思就是当你给一个vue组件绑定事件时候，要加上native！如果是普通的html元素！就不需要-->
                    </el-form-item>

                    <el-button round type="primary" @click="UsernameIsRight" style="display:block;margin:0 auto"> 注册
                    </el-button>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        data() {

            return {
                imageUrl: 'static/img/head-icon.jpg',
                form: new FormData(),
                headers: {'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary3BCFnBuTMzNqB0hH\\r\\n'},
                UsernameFlag: 1,
                UserpwdFlag: 1,
                userInfo: {
                    username: "",
                    userpwd: "",
                    againpwd: ""
                },
                rules: {
                    username: [
                        {required: true, message: "请输入用户名", trigger: 'blur'}
                    ],
                    userpwd: [
                        {required: true, message: "请输入密码", trigger: 'blur'}
                    ],
                    againpwd: [
                        {required: true, message: "请再次输入密码", trigger: 'blur'}
                    ]
                }
            }


        },
        methods: {
            upLoad() {
                let self = this;
                this.$axios.post('/api/user/uploadImg', self.form, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
            },
            handleAvatarSuccess(file) {
                console.log(file);
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(this.imageUrl);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                this.form = new FormData();
                this.form.append('file', file, file.name);
                return isJPG && isLt2M;
            },

            UsernameIsRight() {

                let len = 0;

                let flag = this.UsernameFlag;
                for (let i = 0; i < this.userInfo.username.length; i++) {
                    let c = this.userInfo.username.charCodeAt(i);
                    //单字节加1
                    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                        len++;
                    } else {
                        len += 2;
                        flag = false;
                    }
                }
                if (len > 16 || len < 5)
                    flag = false;

                if (!flag) {
                    this.$message.warning("账号不可含有中文和特殊字符，必须为5-16位");
                    return;
                }
                len = 0;


                flag = this.UserpwdFlag;
                len = 0;
                for (let i = 0; i < this.userInfo.userpwd.length; i++) {
                    let code = this.userInfo.userpwd.charCodeAt(i);
                    if (code < 48 || code > 57 && code < 65 || code > 90 && code < 97 || code > 122) {
                        flag = false;
                    } else {
                        len++;
                    }
                }
                if (len < 5 || len > 16)
                    flag = false;
                if (!flag) {
                    this.$message.warning("密码必须为5-16位，且必须含有数字和字母");
                    return;
                }
                if (this.userInfo.userpwd !== this.userInfo.againpwd) {
                    this.$message.warning("两次密码不一致");
                    return;
                }
                const self = this;
                self.$axios.post('/api/user/listUser').then((res) => {
                    let rel = res.data.some(item => {
                        return item.username === self.userInfo.username;
                    });
                    if (rel) {
                        flag = false;

                    }
                }).then(() => {
                    if (!flag) {
                        self.$message.success("账户已经存在");
                        return;

                    }

                    this.$http.post('/api/user/addUser', {
                        username: self.userInfo.username,
                        password: self.userInfo.userpwd,
                        image: self.imageUrl
                    }, {}).then((response) => {
                        //console.log(response);
                    });
                    this.$message.success("注册成功！");
                    this.$router.push('./login');
                });

            },

            proToDB() {
                const self = this;
                self.$message.warning("注册成功！");
                self.$router.push('./page');
            }

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

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        position: center;
        background-color: #289699;
        line-height: 178px;
        text-align: center;
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

</style>
