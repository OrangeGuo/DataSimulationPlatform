<template>

    <div  >
       <div style="height: 50px" >

        <el-input  style="Float: left;height:50px;width: 500px;" float="left" placeholder="请输入关键字" clearable ></el-input>
        <el-button style="Float: left;height:40px;"  type="primary" @click="listTask" icon="el-icon-search">搜索</el-button>
        <el-button style="Float: left;height:40px;" type="primary" @click="dialogAddForm = true" icon="el-icon-plus">新建</el-button>
       </div>
           <el-table
            :data="tableData"
            height="250"
            stripe="true"
            border="true"
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
                width="300">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
            </el-table-column>

            <el-table-column

                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button icon="el-icon-delete" @click="deleteItem(scope.$index)" type="danger"
                               size="small"></el-button>
                    <el-button icon="el-icon-edit" type="primary" size="small"
                               @click="openEdit(scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新建任务" :visible.sync="dialogAddForm" width="30%">
            <el-form :model="form">
                <el-form-item label="任务名称" :label-width="formLabelWidth">
                    <el-input v-model="form.taskName" autocomplete="off" placeholder="不超过10字符"></el-input>
                </el-form-item>
                <el-form-item label="备   注" :label-width="formLabelWidth">
                    <el-input v-model="form.detail" type="textarea" placeholder="不超过50字符"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddForm = false">取 消</el-button>
                <el-button type="primary" @click="newTask">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改任务" :visible.sync="dialogUpdateForm" width="30%">
            <el-form :model="form">
                <el-form-item label="任务名称" :label-width="formLabelWidth">
                    <el-input v-model="form.taskName" autocomplete="off" placeholder="不超过10字符"></el-input>
                </el-form-item>
                <el-form-item label="备   注" :label-width="formLabelWidth">
                    <el-input v-model="form.detail" type="textarea" placeholder="不超过50字符"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateForm = false">取 消</el-button>
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
                dialogAddForm: false,
                dialogUpdateForm: false,
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
                const self = this;
                let taskName = this.form.taskName;
                let detail = this.form.detail;
                let i = 0;
                let flag = true;
                while (i < this.tableData.length) {
                    if (taskName === this.tableData[i].taskName) {
                        this.$message.warning("任务名重复，请重新确认");
                        flag = false;
                        break;
                    }
                    i++;
                }
                if (flag) {
                    this.dialogAddForm = false;
                    this.$http.post('/api/task/addTask', {
                        taskName: taskName,
                        detail: detail
                    }, {}).then((response) => {
                        self.listTask();
                    })
                }
            },
            listTask() {
                const self = this;
                self.$axios.post('/api/task/listTask').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                         let day =item.date;
                         day=day.split("-");

                         let dateyear=day[0];
                         let datemonth=day[1];
                         day=day[2].split("T")
                         let dateday=day[0];
                         day=day[1].split(".");
                         let datehour = day[0];
                         datehour=datehour.split(":");
                         let datemin = datehour[1];
                         let datesec = datehour[2];
                         datehour=datehour[0];
                         datehour = parseInt(datehour);
                         datehour=datehour+8;
                         datehour=String(datehour);

                        self.tableData.push({
                            date: dateyear+'-'+datemonth+'-'+dateday+' '+ datehour+':'+datemin+':'+datesec,
                            taskName: item.taskName,
                            detail: item.detail,
                            id: item.id
                        })

                    });

                });
            },
            deleteItem(index) {

                const self = this;
                self.$http.post('/api/task/deleteTask', {
                    taskName: self.tableData[index].taskName
                }, {}).then((response) => {
                    self.tableData.splice(index, 1);
                })

            },
            openEdit(index) {
                this.dialogUpdateForm = true;
                localStorage.setItem('task_id', index);
                this.form.taskName = this.tableData[index].taskName;
                this.form.detail = this.tableData[index].detail;
            },
            updateItem() {
                let id = localStorage.getItem("task_id");
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.form.taskName === this.tableData[i].taskName) {
                        this.$message.warning("任务名重复，请重新确认");
                        return;
                    }
                }
                this.tableData[id].taskName = this.form.taskName;
                this.tableData[id].detail = this.form.detail;
                this.dialogUpdateForm = false;
                const self = this;

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
