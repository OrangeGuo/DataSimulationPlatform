<template>

    <div>
        <el-button type="primary" @click="listTask" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-plus">新建</el-button>
        <el-table
            :data="tableData"
            height="250"

            style="width: 80%">
            <el-table-column
                prop="taskName"
                label="任务名称"
                width="200%">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>任务名称: {{ scope.row.taskName }}</p>
                        <p>详情: {{ scope.row.detail }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.taskName }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="date"
                label="创建时间"
                width="200%">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
            </el-table-column>

            <el-table-column

                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button icon="el-icon-delete" @click="handleClick(scope.row)" type="danger"
                               size="small"></el-button>
                    <el-button icon="el-icon-edit" type="text" size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新建任务" :visible.sync="dialogFormVisible"  width="30%">
            <el-form :model="form">
                <el-form-item label="任务名称" :label-width="formLabelWidth">
                    <el-input v-model="form.taskName" autocomplete="off" placeholder="不超过10字符"></el-input>
                </el-form-item>
                <el-form-item label="备   注" :label-width="formLabelWidth">
                    <el-input v-model="form.detail" type="textarea" placeholder="不超过50字符"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="newTask">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TaskManage",

        data() {
            return {
                formLabelWidth: '120px',
                form: {
                    taskName: '',
                    detail: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                dialogFormVisible: false,
                tableData: [{
                    date: '2016-05-03',
                    taskName: '王小虎',
                    detail: '上海市普陀区金沙江路 1518 弄'
                },
                    {
                        date: '2016-05-03',
                        taskName: '王小虎',
                        detail: '上海市普陀区金沙江路 1518 弄'
                    }
                ]
            }
        },
        methods: {
            newTask() {
                let taskName = this.form.taskName;
                let detail = this.form.detail;
                this.dialogFormVisible = false;
                this.$http.post('/api/task/addTask', {
                    taskName: taskName,
                    detail: detail
                }, {}).then((response) => {

                })
            },
            listTask() {
                const self = this;
                self.$axios.post('/api/task/listTask').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        self.tableData.push({
                            date:item.date,
                            taskName:item.taskName,
                            detail:item.detail
                        })

                    });

                });
            }
        }
    }
</script>

<style scoped>

</style>
