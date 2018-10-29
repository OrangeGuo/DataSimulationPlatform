<template>
    <div>
        <div style="height: 50px">

            <el-input style="Float: left;height:50px;width: 500px;" float="left" placeholder="请输入关键字"
                      clearable></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="listModules" icon="el-icon-search">搜索
            </el-button>
            <el-button style="Float: left;height:40px;" type="primary" @click="dialogAddForm = true"
                       icon="el-icon-plus">新建
            </el-button>
        </div>
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
                    <el-button icon="el-icon-delete" @click="deleteItem(scope.$index)" type="danger"
                               size="small"></el-button>
                    <el-button icon="el-icon-edit" type="primary" size="small"
                               @click="openEdit(scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新建结点" :visible.sync="dialogAddForm" width="30%">
            <el-form :model="form">
                <el-form-item label="结点编号" :label-width="formLabelWidth">
                    <el-input v-model="form.node_id" autocomplete="off" placeholder="不超过10字符"></el-input>
                </el-form-item>
                <el-form-item label="结点名称" :label-width="formLabelWidth">
                    <el-input v-model="form.node_name" type="textarea" placeholder="不超过50字符"></el-input>
                </el-form-item>
                <el-form-item label="结点值" :label-width="formLabelWidth">
                    <el-input v-model="form.node_value" type="textarea" placeholder="不超过50字符"></el-input>
                </el-form-item>
                <el-form-item label="父结点编号" :label-width="formLabelWidth">
                    <el-input v-model="form.parent" type="textarea" placeholder="不超过50字符"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddForm = false">取 消</el-button>
                <el-button type="primary" @click="newModules">确 定</el-button>
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
                    node_id: '',
                    node_name: '',
                    node_value: '',
                    parent: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                dialogAddForm: false,
                formLabelWidth:"120px",
                tableData: [
                    {
                        node_id: 1,
                        node_name: 'asd',
                        node_value: 10,
                        parent: null,
                    }
                ]
            }
        },
        methods:{
            listModules(){
                const self = this;
                self.$axios.post('/api/modules//listModules', {
                    task_id: 1
                },{}).then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        self.tableData.push({
                            node_id: item.node_id,
                            node_name: item.node_name,
                            node_value: item.node_value,
                            parent: item.parent,
                        })

                    });

                });
            },
            newModules(){
                const self=this;
                let node_id= parseInt(this.form.node_id);
                let node_name = this.form.node_name;
                let node_value=parseInt(this.form.node_value);
                console.log(node_value);
                let parent=parseInt(this.form.parent);
                let i = 0;
                let flag = true;
                while (i < this.tableData.length) {
                    if (node_id === this.tableData[i].node_id) {
                        this.$message.warning("任务名重复，请重新确认");
                        flag = false;
                        break;
                    }
                    i++;
                }
                if (flag) {
                    this.dialogAddForm = false;
                    this.$http.post('/api/modules/addModules', {
                        node_id: node_id,
                        node_name: node_name,
                        node_value:node_value,
                        parent:parent,
                        task_id:1
                    }, {}).then((response) => {
                        self.listModules();
                    })
                }
            },

        },
         mounted() {
            this.listModules();

        },
    }
</script>

<style scoped>

</style>
