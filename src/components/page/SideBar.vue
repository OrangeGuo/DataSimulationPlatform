<template>
	<div class="side-bar" >
		<el-dropdown style="margin-left: 120px;margin-top: 50px" @command="handleCommand">
                <span class="el-dropdown-link" >
                    类别<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">人文</el-dropdown-item>
                    <el-dropdown-item command="2">地理</el-dropdown-item>
                    <el-dropdown-item command="4">小说</el-dropdown-item>
                </el-dropdown-menu>
        </el-dropdown>
	</div>
</template>

<script type="text/javascript">
	export default {
		data () {
			return {

			}
		},

		methods:{
            handleCommand(command) {
                this.$message('click on item ' + command);
             }
		}
	}
</script>

<style scoped>
	.side-bar {
		position:absolute;
		left:0;
		top:70px;
		bottom:0;
		width:250px;
	}
	.side-bar ul{
		height:100%;
	}
    .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
