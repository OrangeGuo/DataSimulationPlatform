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
            <el-button style="Float: left;height:40px;margin-left: 20px" type="primary" @click="AHPweight" v-show="flagButton">归一化
            </el-button>
            <el-button style="Float: left;height:40px;margin-left: 20px" type="primary" @click="Analyse">一键分析
            </el-button>

        </div>
        <div id="wrap">
            <el-table
                :data="tableData"
                @row-dblclick="openDiag"
                height="600"
                stripe
                border
                style="width: 80%;margin-left: 20px">
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
                <template v-for='(col) in plan1'>
                        <el-table-column
                            :prop="col.dataItem"
                            :label="col.dataName"
                            :key="col.dataItem"
                            width="200">
                        </el-table-column>
                </template>
            </el-table>
        </div>
        <el-dialog title="编辑威胁度" :visible.sync="dialogUpdateForm" width="30%">
            <el-form :model="form">
                <el-form-item label="威胁度" :label-width="formLabelWidth">
                    <el-input  v-model="form.threat"></el-input>
                </el-form-item>
                <el-form-item label="太空威胁度" :label-width="formLabelWidth">
                    <el-input v-model="form.spaceThreat"></el-input>
                </el-form-item>
                <el-form-item label="电磁威胁度" :label-width="formLabelWidth">
                    <el-input v-model="form.emThreat"></el-input>
                </el-form-item>
                <el-form-item label="目标威胁度" :label-width="formLabelWidth">
                    <el-input v-model="form.targetThreat"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateForm = false">取 消</el-button>
                <el-button type="primary" @click="showInTable">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑权重" :visible.sync="dialogUpdateForm1" width="30%">
            <el-form :model="form1">
                <el-form-item label="结点名称" :label-width="formLabelWidth">
                    <el-input  v-model="form1.node_name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="权重" :label-width="formLabelWidth">
                    <el-input v-model="form1.weight"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateForm1 = false">取 消</el-button>
                <el-button type="primary" @click="showInTableADC">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "IndexBinding",
        data() {
            return {
                tasks: [],
                datalist: [],
                flagButton:false,
                dialogUpdateForm1:false,
                weight:[],
               Threat:[],
                plan1:[],
                form: {
                    threat: '',
                    spaceThreat: '',
                    emThreat:'',
                    targetThreat:'',
                },
                form1:{
                    node_name:'',
                    weight:'',
                },
                dialogUpdateForm: false,
                tempTask: '',
                tableData: [],
                dropVisible: false,
                inputVisible: false,
                title: "选择任务模型",
                title1: "",
                alogrim: [{
                    text: "灰色层次分析法",
                    value: "1",
                },{
                    text:"ADC",
                    value:"2",
                } ],
                tempModuleId: '',
                formLabelWidth: "120px",
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
                this.title1='选择算法';
                this.inputVisible=false;
                this.flagButton=false;
                for (i = 0; i < this.tasks.length; i++)
                    if (this.tasks[i].value === command)
                        break;
                this.title = this.tasks[i].text;
                this.dropVisible = true;
                this.plan1=[];
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
                            weight: item.weight,
                            threat:0,
                            spaceThreat:0,
                            emThreat:0,
                            targetThreat:0,
                        })
                    });
                }).then(() => {

                })
            },
            openDiag(row) {
                if (this.datalist.length === 0) {
                    this.$message.warning("未选择文件");
                    return;
                }
                this.tempModuleId = row.node_id;
                if(this.title1=='灰色层次分析法'){
                    this.dialogUpdateForm = true;
                    this.form.threat = row.threat;
                    this.form.emThreat = row.emThreat;
                    this.form.spaceThreat=row.spaceThreat;
                    this.form.targetThreat=row.targetThreat;
                }
                else if(this.title1==='ADC'){
                    this.dialogUpdateForm1=true;
                    this.form1.node_name=row.node_name;
                    this.form1.weight=row.weight;
                }
            },
            showInTable() {
                const self = this;
                self.dialogUpdateForm = false;
                for (let i = 0; i < this.datalist.length; i++) {
                    if (this.datalist[i].id === this.tempModuleId) {
                        this.datalist[i].threat = parseFloat(this.form.threat);
                        this.datalist[i].emThreat = parseFloat(this.form.emThreat);
                        this.datalist[i].spaceThreat = parseFloat(this.form.spaceThreat);
                        this.datalist[i].targetThreat = parseFloat(this.form.targetThreat);
                        break;
                    }
                }
                this.assignTableAHP();
            },
            showInTableADC(){
                this.dialogUpdateForm1=false;
                for (let i = 0; i < this.datalist.length; i++) {
                    if (this.datalist[i].id === this.tempModuleId) {
                        this.datalist[i].weight = parseFloat(this.form1.weight);
                        break;
                    }
                }
                for(let i=0;i<this.tableData.length;i++)
                {
                    if (this.tableData[i].node_id === this.tempModuleId) {
                        this.tableData[i].weight = parseFloat(this.form1.weight);
                        break;
                    }
                }
            },
            handleCommand1(command) {
                this.plan1=[];
                let i = 0;
                for (i = 0; i < this.alogrim.length; i++)
                    if (this.alogrim[i].value === command)
                        break;
                this.title1 = this.alogrim[i].text;
                if(this.title1==='灰色层次分析法')
                {
                    this.flagButton=true;
                    this.plan1.push({
                        dataItem:'threat',
                        dataName:'威胁度',
                    },{
                        dataItem:'spaceThreat',
                        dataName:'太空威胁度',
                    },{
                        dataItem:'emThreat',
                        dataName:'电磁威胁度'
                    },{
                        dataItem:'targetThreat',
                        dataName:'目标威胁度',
                    });

                }
                else if(this.title1==='ADC'){
                    this.flagButton=false;
                    this.plan1.push({
                        dataItem:'weight',
                        dataName:'权重',
                    })
                }
                this.inputVisible = true;
            },
            Analyse() {
                //this.showInbar();
                if(this.title1==='灰色层次分析法') {

                    console.log(this.datalist);
                    this.AHP();
                }
                else if(this.title1==='ADC') {
                    this.ADC();
                    this.$message.info(this.datalist[0].value.toFixed(2));
                }
               //this.$router.push('resultShow');
            },
            assignTableAHP(){
                for(let i=0;i<this.tableData.length;i++)
                {
                    for(let j=0;j<this.datalist.length;j++)
                    {
                        if(this.datalist[j].id===this.tableData[i].node_id) {
                            this.tableData[i].threat = this.datalist[j].threat;
                            this.tableData[i].spaceThreat = this.datalist[j].spaceThreat;
                            this.tableData[i].emThreat = this.datalist[j].emThreat;
                            this.tableData[i].targetThreat = this.datalist[j].targetThreat;
                            this.tableData[i].weight = this.datalist[j].weight;
                        }
                    }
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

                            obj.id = v.id;

                            obj.value = v.value;

                            obj.parentID = v.parent;

                            obj.weight = v.weight;

                            obj.name = v.name;
                            obj.threat=v.威胁度;
                            obj.spaceThreat=v.太空威胁度;
                            obj.emThreat=v.电磁威胁度;
                            obj.targetThreat=v.目标威胁度;

                            obj.taskId = _this.tempTask;
                            arr.push(obj)

                        });

                        _this.accountList = [...arr];
                        self.datalist = _this.accountList;

                        if (self.datalist[0].id == null) {
                            console.log("wrong");
                        }

                        let flag = false;
                        for (let i = 0; i < self.tableData.length; i++) {
                            for (let y = 0; y < self.datalist.length; y++) {

                                if (self.tableData[i].node_id === self.datalist[y].id) {

                                    if (self.tableData[i].parent === self.datalist[y].parentID) {
                                        flag = true;

                                    } else {
                                        flag = false;
                                        self.$message.warning("导入数据与模型不匹配");
                                        return;

                                    }
                                }

                            }


                        }

                        if (flag === true) {
                            for (let i = 0; i < self.datalist.length; i++) {
                                for(let j=0;j<self.tableData.length;j++) {
                                    if( self.tableData[j].node_id ===self.datalist[i].id) {
                                        self.tableData[j].node_value = self.datalist[i].value;
                                        if(self.title1==='灰色层次分析法')
                                        {
                                            self.tableData[j].threat=self.datalist[i].threat;
                                            self.tableData[j].emThreat=self.datalist[i].emThreat;
                                            self.tableData[j].spaceThreat=self.datalist[i].spaceThreat;
                                            self.tableData[j].targetThreat=self.datalist[i].targetThreat;

                                        }
                                        else if(self.title1==='ADC'){
                                            self.tableData[j].weight=self.datalist[i].weight;
                                        }
                                    }

                                }
                            }
                            // console.log(self.tableData);
                            self.saveData();
                        }


                    };

                    reader.readAsArrayBuffer(f);

                };

                if (rABS) {

                    reader.readAsArrayBuffer(f);

                } else {

                    reader.readAsBinaryString(f);

                }


            },
             AHPweight()
            {
                let self = this;
                let threat = 0;
                let spaceThreat = 0;
                let emThreat = 0;
                let targetThreat  = 0;
                for(let i = 0; i< self.datalist.length;i++)
                {
                    threat += self.datalist[i].threat;
                    spaceThreat += self.datalist[i].spaceThreat;
                    emThreat += self.datalist[i].emThreat;
                    targetThreat += self.datalist[i].targetThreat;
                }
                for(let i = 0; i< self.datalist.length;i++)
                {
                    self.datalist[i].threat = self.datalist[i].threat/threat;
                    self.datalist[i].spaceThreat = self.datalist[i].spaceThreat/spaceThreat;
                    self.datalist[i].emThreat = self.datalist[i].emThreat/emThreat;
                    self.datalist[i].targetThreat = self.datalist[i].targetThreat/targetThreat;
                }
                for(let i = 0; i< self.datalist.length;i++)
                {
                    let temp = self.datalist[i].threat+self.datalist[i].spaceThreat+self.datalist[i].emThreat+self.datalist[i].targetThreat;
                    self.weight.push({tweight:temp/4});

                }
                this.assignTableAHP();
            },
            AHP() {
                let self = this;

                self.AHPweight();
                for (let i =  self.datalist.length-1; i >0;i--) {
                    for (let y = 0; y < self.datalist.length; y++) {

                        if (self.datalist[y].id === self.datalist[i].parentID) {

                            let temp_value = parseFloat(self.datalist[i].value);
                            let temp_weight = parseFloat(self.weight[i].tweight);
                            let temp = parseFloat(self.datalist[y].value);
                            temp += temp_weight * temp_value;
                            self.datalist[y].value = temp;
                        }
                    }

                }
                console.log(self.datalist);
            },
            ADC(){
                let self = this;
                let result = 0;

                for(let i = 0;i<self.datalist.length;i++ )
                {
                    if(self.datalist[i].parentID === 1)
                    {
                        let j=self.datalist[i].id;
                        for(let k=i;k<self.datalist.length;k++)
                        {
                            if(self.datalist[k].parentID ===j)
                            {
                                self.datalist[i].value += self.datalist[k].value*self.datalist[k].weight;
                            }
                        }
                    }
                }
                result = self.datalist[1].value*self.datalist[2].value*self.datalist[3].value*self.datalist[4].value*(1-self.datalist[1].value);
                self.datalist[0].value = result;
                console.log(result);

            },
            saveData() {
                let self=this;
                self.$http.post('/api/node/updateValue', self.datalist)
            }

        },
        mounted() {
            this.listTaskid();
        },

    }
</script>

<style scoped>
    #wrap {
        display: flex;
    }
</style>
