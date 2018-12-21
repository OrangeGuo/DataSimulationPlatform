<template>
    <div>
        <div style="height: 50px">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in tasks" :command="item.value">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand1" style="margin-left: 20px" v-show="dropVisible">
                <span class="el-dropdown-link">
                    {{title1}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in alogrim" :command="item.value">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <input style="margin-left: 20px" type="file" @change="importf1(this)"
                   v-show="inputVisible"
                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <el-button style="Float: left;height:40px;margin-left: 20px" type="primary" @click="Analyse">一键分析
            </el-button>
        </div>
        <div id="wrap">
            <div class="chart-show">
                <div class="chart-item" v-for="item in source">
                    <div class="chart-item-title" v-cloak>{{ item.name }}</div>
                    <schart :canvasId="item.canvasId" :type="item.canvasId" :data="item.data" width="600" height="600"
                            :options="item.options"></schart>
                </div>
            </div>
            <el-table
                :data="tableData"
                @row-dblclick="openDiag"
                height="600"
                stripe
                border
                style="width: 80%;margin-left: 20px">
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
            </el-table>
        </div>
        <el-dialog title="修改对应结点" :visible.sync="dialogUpdateForm" width="30%">
            <el-form :model="form">
                <el-form-item label="结点名" :label-width="formLabelWidth">
                    <el-input v-model="form.node_name"></el-input>
                </el-form-item>
                <el-form-item label="结点值" :label-width="formLabelWidth">
                    <el-input v-model="form.node_value"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateForm = false">取 消</el-button>
                <el-button type="primary" @click="showInTable">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Schart from "vue-schart";

    export default {
        name: "IndexBinding",
        data() {
            return {
                tasks: [],
                datalist: [],

                form: {
                    node_name: '',
                    node_value: '',
                },
                dialogUpdateForm: false,
                tempTask: '',
                tableData: [],
                dropVisible: false,
                inputVisible: false,
                title: "选择任务模型",
                title1: "选择算法",
                alogrim: [{
                    text: "AHP",
                    value: "1",
                }, {
                    text: "ADC",
                    value: "2",
                }],
                tempModuleId: '',
                formLabelWidth: "120px",
                source: [{
                    canvasId: "bar",
                    name: "柱状图",
                    data: [{
                        name: "结点一",
                        value: 20,
                    }, {
                        name: "结点二",
                        value: 25,
                    }, {
                        name: "结点三",
                        value: 31,
                    }],
                    options: {
                        title: "分析结果",
                        bgColor: "#009688",
                        titleColor: "#fff",
                        contentColor: "#cc0632",
                        axisColor: "#FFF",
                        fillColor: "#d9f501"
                    }
                }]
            }
        },

        methods: {
            listTaskid() {
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
            handleCommand(command) {
                let i = 0;
                for (i = 0; i < this.tasks.length; i++)
                    if (this.tasks[i].value === command)
                        break;
                this.title = this.tasks[i].text;
                this.dropVisible = true;
                this.tempTask = command;
                this.listNode();
            },
            listNode() {
                const self = this;
                self.$axios.post('/api/node/listNodes', {taskId: parseInt(self.tempTask)}).then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        self.tableData.push({
                            node_id: item.id,
                            node_name: item.name,
                            node_value: item.value,
                            parent: item.parent,
                            degree: item.degree,
                        })
                    });
                }).then(() => {

                })
            },
            openDiag(row) {
                this.dialogUpdateForm = true;
                this.form.node_name = row.node_name;
                this.form.node_value = row.node_value;
                this.tempModuleId = row.node_id;
            },
            showInTable() {
                const self = this;
                self.dialogUpdateForm = false;
                self.$http.post('/api/node/updateNodes', {
                    name: self.form.node_name,
                    value: self.form.node_value,
                    id: parseInt(self.tempModuleId),
                    taskId: parseInt(self.tempTask)
                }, {}).then(() => {
                    self.listNode();
                })
            },
            handleCommand1(command) {
                let i = 0;
                for (i = 0; i < this.alogrim.length; i++)
                    if (this.alogrim[i].value === command)
                        break;
                this.title1 = this.alogrim[i].text;
                this.inputVisible = true;
            },
            Analyse() {
                this.showInbar();
            },
            showInbar() {
                const self = this;
                self.AHP();

                this.source[0].data = [];
                for (let i = 0; i < self.datalist.length; i++) {
                    this.source[0].data.push({
                        name: self.datalist[i].name,
                        value: self.datalist[i].value,
                    });
                }
            },
            importf1(obj) {

                let _this = this;

                let inputDOM = this.$refs.inputer;   // 通过DOM取文件数据

                this.file = event.currentTarget.files[0];

                let rABS = false; //是否将文件读取为二进制字符串

                let f = this.file;

                let reader = new FileReader();

                const self = this;
                //if (!FileReader.prototype.readAsBinaryString) {

                FileReader.prototype.readAsBinaryString = function (f) {

                    let binary = "";

                    let rABS = false; //是否将文件读取为二进制字符串

                    let pt = this;

                    let wb; //读取完成的数据

                    let outdata;

                    let reader = new FileReader();

                    reader.onload = function (e) {

                        let bytes = new Uint8Array(reader.result);

                        let length = bytes.byteLength;

                        for (let i = 0; i < length; i++) {

                            binary += String.fromCharCode(bytes[i]);

                        }

                        let XLSX = require('xlsx');

                        if (rABS) {

                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化

                                type: 'base64'

                            });

                        } else {

                            wb = XLSX.read(binary, {

                                type: 'binary'

                            });

                        }

                        // outdata就是你想要的东西 excel导入的数据

                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

                        // excel 数据再处理

                        let arr = [];

                        outdata.map(v => {

                            let obj = {};

                            obj.myID = v.id;

                            obj.value = v.value;

                            obj.parentID = v.parent;

                            obj.weight = v.weight;

                            obj.name = v.name;

                            arr.push(obj)

                        });

                        _this.accountList = [...arr];
                        self.datalist = _this.accountList;

                        if (self.datalist[0].myID == null) {
                            console.log("wrong");
                        }

                        let flag = false;
                        for (let i = 0; i < self.tableData.length; i++) {
                            for (let y = 0; y < self.datalist.length; y++) {

                                if (self.tableData[i].node_id === self.datalist[y].myID) {

                                    if (self.tableData[i].parent === self.datalist[y].parentID) {
                                        flag = true;

                                    }
                                    else {
                                        flag = false;
                                        console.log("wrong");
                                    }
                                }

                            }


                        }
                        if (flag === true) {
                            for (let i = 0; i < self.datalist.length; i++) {
                                self.tableData[i].node_value = self.datalist[i].value;
                                self.tableData[i].node_name = self.datalist[i].name;
                            }
                        }


                    }

                    reader.readAsArrayBuffer(f);

                }

                if (rABS) {

                    reader.readAsArrayBuffer(f);

                } else {

                    reader.readAsBinaryString(f);

                }


            },
            AHP() {
                let self = this;


                for (let i = 1; i < self.datalist.length; i++) {
                    for (let y = 0; y < self.datalist.length; y++) {

                        if (self.datalist[y].myID === self.datalist[i].parentID) {

                            let temp_value = parseFloat(self.datalist[i].value);
                            let temp_weight = parseFloat(self.datalist[i].weight);
                            let temp = parseFloat(self.datalist[y].value);
                            temp += temp_weight * temp_value;
                            self.datalist[y].value = temp;
                        }
                    }

                }
                console.log(self.datalist);
            }

        },
        mounted() {
            this.listTaskid();
        },
        components: {
            Schart
        },
    }
</script>

<style scoped>
    #wrap {
        display: flex;
    }
</style>
