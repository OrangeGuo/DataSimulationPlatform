<template>
    <el-table
        :data="tableData3"
        height="250"
        border
        style="width: 100%">
        <el-table-column
            prop="taskName"
            label="任务名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="date"
            label="创建时间"
            width="180">
        </el-table-column>
        <el-table-column
            prop="detail"
            label="备注">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "TaskManage"
    }
</script>

<style scoped>

</style>
