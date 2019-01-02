<template>
    <div>
        <el-steps :active="active" align-center finish-status="success">
            <el-step title="步骤1" description="新建任务"></el-step>
            <el-step title="步骤2" description="配置任务模型"></el-step>
            <el-step title="步骤3" description="进行数据绑定"></el-step>
            <el-step title="步骤4" description="选择算法分析"></el-step>
            <el-step title="步骤5" description="查看分析结果"></el-step>
        </el-steps>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                active: 0
            };
        },

        methods: {
            next() {
                if (this.active++ > 5) this.active = 0;
            }
        }
    }
</script>

<style scoped>

</style>
