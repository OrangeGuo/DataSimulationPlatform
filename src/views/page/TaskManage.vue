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
                    <el-button icon="el-icon-delete" @click="deleteItem(scope.$index)" type="danger"
                               size="small"></el-button>
                    <el-button icon="el-icon-edit" type="text" size="small" @click="openEdit(scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新建任务" :visible.sync="dialogFormVisible" width="30%">
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
        <el-dialog title="修改任务内容" :visible.sync="dialogUpdateForm" width="30%">
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
                <el-button type="primary" @click="updateItem">确 定</el-button>
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
                dialogUpdateForm: false,
                tableData: [
                    {
                        date: '2016-05-03',
                        taskName: '王小虎',
                        detail: '上海市普陀区金沙江路 1518 弄',
                        id:''
                    }
                ]
            }
        },
        methods: {
            newTask() {
                const self =this;
                let taskName = this.form.taskName;
                let detail = this.form.detail;
                this.dialogFormVisible = false;
                this.$http.post('/api/task/addTask', {
                    taskName: taskName,
                    detail: detail
                }, {}).then((response) => {
                    self.listTask();
                })
            },
            listTask() {
                const self = this;
                self.$axios.post('/api/task/listTask').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        self.tableData.push({
                            date: item.date,
                            taskName: item.taskName,
                            detail: item.detail,
                            id:item.id
                        })

                    });

                });
            },
            deleteItem(index){

                const self=this;
                self.$http.post('/api/task/deleteTask', {
                    taskName: self.tableData[index].taskName
                }, {}).then((response) => {
                    self.tableData.splice(index,1);
                })

            },
            openEdit(index){
                this.dialogUpdateForm=true;
                localStorage.setItem('task_id', index);
                this.form.taskName=this.tableData[index].taskName;
                this.form.detail=this.tableData[index].detail;
            },
            updateItem(){
                let id =localStorage.getItem("task_id");
                this.tableData[id].taskName=this.form.taskName;
                this.tableData[id].detail=this.form.detail;
                this.dialogUpdateForm = false;
                const  self=this;

                 self.$http.post('/api/task/updateTask', {
                     taskName: self.tableData[id].taskName,
                     detail: self.tableData[id].detail,
                     id: parseInt(self.tableData[id].id)
                }, {}).then((response) => {
                    self.listTask();
                })
            }
        },
        mounted() {
            this.listTask();
        },

    }
</script>

<style scoped>

</style>
