<template>
    <div >
        <div style="height: 50px" align="center">
             <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item v-for="item in tasks" :command="item.value" >{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-input style="Float: left;height:50px;width: 500px;" float="left" placeholder="请输入关键字"
                      clearable></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="listModules" icon="el-icon-search">搜索
            </el-button>
        </div>
        <div align="center">
         <el-table
            :data="tableData"
            height="600"
            stripe
            border
            style="width: 80%">
            <el-table-column
                prop="node_id"
                label="结点编号"
                width="200">
                <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.node_id }}</el-tag>
                        </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="node_name"
                label="结点名称"
                width="200">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.node_name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="node_value"
                label="结点值"
                width="200">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.node_value }}</span>
                </template>
            </el-table-column>
             <el-table-column
                prop="parent"
                label="父结点"
                width="200">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.parent }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit" type="primary" size="small"
                               @click="openEdit(scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <el-dialog title="修改结点" :visible.sync="dialogAddForm" width="30%">
            <el-form :model="form">
                <el-form-item label="结点名称" :label-width="formLabelWidth">
                    <el-input v-model="form.node_name"  ></el-input>
                </el-form-item>
                <el-form-item label="结点值" :label-width="formLabelWidth">
                    <el-input v-model="form.node_value" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddForm = false">取 消</el-button>
                <el-button type="primary" @click="updateModules">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "IndexConfig",
        data() {
            return {
                form: {
                    node_name: '',
                    node_value: '',
                },
                dialogAddForm: false,
                formLabelWidth:"120px",
                tasks:[],
                tempTask:"",
                tempModuleId:"",
                tableData: [],
                allData:[],
            }
        },
        methods:{
            listTaskid(){
                const self = this;
                self.$axios.post('/api/task/listTask').then((res) => {
                    self.tasks = [];
                    res.data.some(item => {
                        self.tasks.push({
                            text: item.taskName,
                            value: item.id.toString(),
                        });
                    });
                });
            },
            handleCommand(command){
                this.tempTask=command;
                this.listModules();
            },
            listModules(){
                const self = this;
                self.$axios.post('/api/node/listNodes', {taskId: parseInt(self.tempTask)}).then((res) => {
                    self.tableData=[];
                    self.allData=[];
                    res.data.some(item => {
                        self.allData.push({
                            node_id: item.id,
                            node_name: item.name,
                            node_value: item.value,
                            parent: item.parent,
                            degree:item.degree,
                        })
                    });
                }).then(()=>{
                    for(let i=0;i<self.allData.length;i++)
                    {
                       if(self.allData[i].degree>0)
                           self.tableData.push(self.allData[i]);
                    }
                })
            },
            openEdit(index){
                this.dialogAddForm=true;
                this.form.node_name=this.tableData[index].node_name;
                this.form.node_value=this.tableData[index].node_value;
                this.tempModuleId=index;
            },
            updateModules(){
                const self =this;
                self.dialogAddForm=false;
                self.tableData[this.tempModuleId].node_name=this.form.node_name;
                self.tableData[this.tempModuleId].node_value=this.form.node_value;
                self.$http.post('/api/node/updateNodes',{
                    name:self.form.node_name,
                    value:self.form.node_value,
                    id:parseInt(self.tableData[self.tempModuleId].node_id),
                    taskId:parseInt(self.tempTask)
                },{})
            },
        },
         mounted(){
            this.listTaskid();
        },
    }
</script>

<style scoped>

</style>
