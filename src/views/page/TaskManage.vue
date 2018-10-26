<template>

    <div>
        <div style="height: 50px">

            <el-input style="Float: left;height:50px;width: 500px;" float="left" placeholder="请输入关键字"
                      clearable></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="newModule" icon="el-icon-search">搜索
            </el-button>
            <el-button style="Float: left;height:40px;" type="primary" @click="dialogAddForm = true"
                       icon="el-icon-plus">新建
            </el-button>
        </div>
        <el-table
            :data="tableData"
            height="250"
            stripe
            border
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
        <div class="data-show" style="width: 650px;">
            <h3>常规操作</h3>

            <el-tree :data="treeList" ref="tree" :props="defaultProps"
                     :node-key="config.nodeKey" :indent="config.indent"
                     :highlight-current="config.highlight" :accordion="config.accordion"
                     :expand-on-click-node="config.clickExpand"
                     :default-checked-keys="config.checkedKeys" :default-expanded-keys="config.expandedKeys"
                     :default-expand-all="config.expandAll"
                     :empty-text="config.emptyTxt" :render-content="renderContent"
                     @node-click="handleClick" @check-change="handleCheckChange"></el-tree>
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
    </div>
</template>

<script>
    export default {
        name: "TaskManage",


        data() {


            return {
                id: 1,
                treeList: [  {
                "label": "root",
                "value":"1",
                "children": []
                }],
                defaultProps: {
                    children: "children",
                    label: "label",
                    value: "value",
                    disabled: "noUse"
                },
                config: {
                    emptyTxt: "没有更多啦~~",
                    indent: 20,//相邻级节点间的水平缩进，单位为像素
                    showCheckbox: true,//是否显示复选框
                    nodeKey: "value",//依据哪个节点来判断选中和展开,其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。
                    clickExpand: false,//点击后是否展开下级
                    checkedKeys: ['211'],//默认选中的项的字段值
                    expandedKeys: ['21'],//判断哪些项是展开的
                    expandAll: false,//是否默认展开所有
                    highlight: true,//选中后是否高亮显示当前行
                    accordion: true//是否开启手风琴
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
            append(data) {
                this.id++;
                let newList = {"label": "node_" + this.id, value: "" + this.id, children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newList);
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.value === data.value);
                if(data.value!=="1")children.splice(index, 1);
            },
            handleClick(data) {
                if (data.children && data.children.length > 0) {
                    return;
                }
                this.$message("我选中了：" + data.label + ",代号为:" + data.value)
            },
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
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
                if (flag) {
                    this.dialogAddForm = false;
                    this.$http.post('/api/task/addTask', {
                        taskName: taskName,
                        detail: detail
                    }, {}).then((response) => {
                        self.listTask();
                        self.newModule();
                    })
                }
            },
            newModule(){
                let nodes=[];
                let list=[];
                list.push(this.treeList[0]);
                while(list.length>0){
                    nodes.push({
                        node_name:list[0].label,
                        node_id:list[0].value,
                        value:0,
                        parent:0,
                        task_id:0
                    });
                    for (let i = 0; i < list[0].children.length; i++) {
                        list.push(list[0].children[i]);
                    }
                    list.splice(0,1);
                }
                this.$http.post('/api/modules/addModules',nodes, {}).then((response) => {

                    })
            },
			renderContent (h, { node, data, store }) {
				return (
		          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
		            <span>
		              <span>{node.label}</span>
		            </span>
		            <span>
		              <el-button style="font-size: 12px;" type='primary' size='small' on-click={ () => this.append(data) }>添加</el-button>
		              <el-button style="font-size: 12px;" type='danger' size='small' on-click={ () => this.remove(node, data) }>删除</el-button>
		            </span>
		          </span>);
			},
            listTask() {
                const self = this;
                self.$axios.post('/api/task/listTask').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        let day = item.date;
                        day = day.split("-");

                        let dateyear = day[0];
                        let datemonth = day[1];
                        day = day[2].split("T")
                        let dateday = day[0];
                        day = day[1].split(".");
                        let datehour = day[0];
                        datehour = datehour.split(":");
                        let datemin = datehour[1];
                        let datesec = datehour[2];
                        datehour = datehour[0];
                        datehour = parseInt(datehour);
                        datehour = datehour + 8;
                        datehour = String(datehour);

                        self.tableData.push({
                            date: dateyear + '-' + datemonth + '-' + dateday + ' ' + datehour + ':' + datemin + ':' + datesec,
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
