<template>
    <el-steps :active="2" align-center>
        <el-step title="步骤1" description="新建任务"></el-step>
        <el-step title="步骤2" description="配置任务模型"></el-step>
        <el-step title="步骤3" description="进行数据绑定"></el-step>
        <el-step title="步骤4" description="选择算法分析"></el-step>
        <el-step title="步骤5" description="查看分析结果"></el-step>
    </el-steps>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>

</style>
