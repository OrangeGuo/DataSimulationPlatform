<template>
	<div class="pwd-wrap">
		<el-form :label-position="position" :model="form" status-icon :rules="rules" ref="form" label-width="200px">
		  <el-form-item label="请输入原密码：" prop="oldPass">
		    <el-input type="password" v-model="form.oldPass" auto-complete="off"></el-input>
		  </el-form-item>
		   <el-form-item label="请输入新密码：" prop="pass">
		    <el-input type="password" v-model="form.pass" :disabled="disabled" auto-complete="off"></el-input>
		  </el-form-item>
		  <el-form-item label="确认新密码：" prop="checkPass">
		    <el-input type="password" v-model="form.checkPass" :disabled="disabled" auto-complete="off"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('form')">提交</el-button>
		    <el-button @click="resetForm('form')">重置</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		data () {
			var self = this;
			return {
				form:{
					oldPass:"",
					pass:"",
					checkPass:""
				},
				rules:{
					oldPass:[
						{required:true,message:"请输入原密码",trigger:"blur"},
						{validator:self.checkOldPwd,message:"原密码输入有误",trigger:"blur"}
					],
					pass:[
						{required:true,message:"请填写密码",trigger:"blur"},
						{validator:self.validatePass,trigger:"blur"}
					],
					checkPass:[
						{required:true,message:"请填写密码",trigger:"blur"},
						{validator:self.checkPass,trigger:"blur"}
					]
				},
				position:"top",
				disabled:true,
				counter:0
			}
		},
		watch:{
			counter (val) {
				if(val>5){
					this.$message.error("对不起，您输入错误次数已达到上限！");
				}
			}
		},
		methods:{
			checkOldPwd (rule,value,cb) {
				const pwd = localStorage.getItem("user-pwd");
				if(pwd != this.form.oldPass){
					this.counter ++;
					this.disabled = true;
					cb(new Error("原密码输入有误！请重新输入"));
				}else{
					this.disabled = false;
					cb();
				}
			},
			validatePass (rule,value,cb) {
				let self = this;
				if(self.form.checkPass){
					self.$refs.form.validateField("checkPass");
				}else{
					cb();
				}
			},
			checkPass (rule,value,cb) {
				let self = this;
				if(self.form.pass != value){
					cb(new Error("两次输入密码不一致!"));
				}else{
					cb();
				}
			},
			submitForm (name) {
			     let len = 0;
                let flag = true;
                for (let i = 0; i < this.form.pass.length; i++) {
                    let code = this.form.pass.charCodeAt(i);
                    if (code < 48 || code > 57 && code < 65 || code > 90 && code < 97 || code > 122) {
                        flag = false;
                    }
                    else {
                        len++;
                    }
                }
                if (len < 5 || len > 16)
                    flag = false;
                if (!flag) {
                    this.$message.warning("密码必须为5-16位，且必须含有数字或字母");
                    return;
                }
                let  self=this;
                this.$http.post('/api/user/updatePass', {
                        username: localStorage.getItem("user-name"),
                        password: self.form.pass
                    }, {}).then((response) => {
                        //console.log(response);
                    }).then(() => {
                    this.$message.success("修改成功！");
                    localStorage.setItem('user-pwd', self.form.pass);
                   });
			},
			resetForm (name) {
				this.$refs[name].resetFields();
			}
		}
	}
</script>
<style scoped>
	
</style>
