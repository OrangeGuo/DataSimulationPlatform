<template>

    <div>
        <div style="height: 50px;margin-left: 250px">

            <el-input style="Float: left;height:50px;width: 500px;" float="left" placeholder="请输入关键字"
                      clearable v-model="input"></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="searchTask" icon="el-icon-search">搜索
            </el-button>
            <el-button style="Float: left;height:40px;" type="primary" @click="dialogAddForm = true"
                       icon="el-icon-plus">新建
            </el-button>
        </div>
        <div style="margin-left: 250px">
            <el-table
                :data="tableData"
                height="600"

                stripe
                border
                style="width: 80%"
                highlight-current-row
                @row-dblclick="openModule"
            >
                <el-table-column
                    prop="taskName"
                    label="任务名称"
                    width="200%">
                    <template slot-scope="scope">


                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.taskName }}</el-tag>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="创建时间"
                    width="300"
                >
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="detail"
                    label="备   注"
                    width="300">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.detail }}</span>
                    </template>
                </el-table-column>
                <el-table-column

                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-delete" @click="deleteItemDia(scope.$index)" type="danger"
                                   size="small"></el-button>
                        <el-button icon="el-icon-edit" type="primary" size="small"
                                   @click="openEdit(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
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
        <el-dialog title="删除任务" :visible.sync="dialogDeleteForm" width="30%">
            <el-form :model="form">
                <el-form-item label="任务名称" :label-width="formLabelWidth">
                    <el-input v-model="form.taskName" autocomplete="off" placeholder="不超过10字符"></el-input>
                </el-form-item>
                <el-form-item label="备   注" :label-width="formLabelWidth">
                    <el-input v-model="form.detail" type="textarea" placeholder="不超过50字符"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogDeleteForm = false">取 消</el-button>
                <el-button type="primary" @click="deleteItem">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TaskManage",
        data() {
            return {
                input: '',
                allData: [],
                flag: 0,
                id: 1,
                defaultProps: {
                    children: "children",
                    label: "label",
                    value: "value",
                    disabled: "noUse"
                },
                filterText: "",
                prop: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
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
                dialogDeleteForm: false,
                tableData: []
            }
        },
        methods: {
            openModule(row) {
                localStorage.setItem('task-id', row.id);
                localStorage.setItem('task-name', row.taskName);
                this.$router.push('./ModuleConfig')
            },
            searchTask() {
                this.tableData = [];
                for (let i = 0; i < this.allData.length; i++) {
                    if (this.allData[i].taskName.indexOf(this.input) !== -1)
                        this.tableData.push(this.allData[i]);
                }
            },
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
                let temp = self.tableData.length;
                if (temp === 0)
                    temp = temp + 1;
                else
                    temp = self.tableData[self.tableData.length - 1].id + 1;
                if (flag) {
                    this.dialogAddForm = false;
                    this.$axios.post('/api/task/addTask', {
                        taskName: taskName,
                        detail: detail,
                        id: temp
                    }, {}).then((response) => {
                        self.$message.info("新建任务成功");
                        self.listTask();
                    })
                }
            },
            listTask() {
                const self = this;
                self.$axios.post('/api/task/listTask').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        let day = item.date;
                        day = day.split("-");
                        let dateYear = day[0];
                        let dateMonth = day[1];
                        day = day[2].split("T");
                        let dateDay = day[0];
                        self.tableData.push({
                            date: dateYear + '-' + dateMonth + '-' + dateDay,
                            taskName: item.taskName,
                            detail: item.detail,
                            id: item.id
                        });
                    });
                }).then(() => {
                    self.allData = self.tableData;
                });
            },
            deleteItemDia(index) {
                this.dialogDeleteForm = true;
                localStorage.setItem('task_id', index);
                this.form.taskName = this.tableData[index].taskName;
                this.form.detail = this.tableData[index].detail;
            },
            deleteItem() {
                let index = localStorage.getItem("task_id");
                const self = this;
                self.$axios.post('/api/task/deleteTask', {
                    taskName: self.tableData[index].taskName
                }, {}).then((response) => {
                    let taskId = self.tableData[index].id;
                    self.tableData.splice(index, 1);
                    self.$message.info("删除成功");
                    self.$axios.post('/api/node/deleteNodes', {taskId: taskId}, {});
                    self.$axios.post('/api/edge/deleteEdges', {taskId: taskId}, {});
                });
                this.dialogDeleteForm = false;
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
                        if (parseInt(id) !== i) this.$message.warning("任务名重复，请重新确认");
                        return;
                    }
                }
                this.tableData[id].taskName = this.form.taskName;
                this.tableData[id].detail = this.form.detail;
                this.dialogUpdateForm = false;
                const self = this;

                self.$axios.post('/api/task/updateTask', {
                    taskName: self.tableData[id].taskName,
                    detail: self.tableData[id].detail,
                    id: parseInt(self.tableData[id].id)
                }, {}).then((response) => {
                    self.$message.info("修改成功");
                    self.listTask();
                })
            },
        },
        mounted() {
            this.listTask();
        },


    }
</script>

<style scoped>

</style>
