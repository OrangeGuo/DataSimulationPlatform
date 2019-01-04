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
            <el-dropdown @command="handleCommand1">
                <span class="el-dropdown-link">
                    {{title1}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in alogrim" :command="item.value">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <input style="margin-left: 20px" type="file" @change="importf1(this)"
                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <el-button style="Float: left;height:40px;" type="primary" @click="startAnalyse">灵敏度分析
            </el-button>
        </div>
        <div id="wrap">
            <div>
                <el-table
                    :data="tableData"
                    height="300"
                    stripe
                    border
                    @row-dblclick="openDiag"
                    style="width: 650px">
                    <el-table-column
                        prop="node_name"
                        label="结点名称"
                        width="150">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.node_name }}</el-tag>
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="range"
                        label="变化范围"
                        width="150">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.range }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="long"
                        label="步长"
                        width="150">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.long }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-delete" @click="clearItem(scope.$index)" type="danger"
                                       size="small"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <label>方案列表</label>
                <el-table
                    :data="plan"
                    height="450"
                    stripe
                    border
                    v-show="dropVisible"
                    style="width: 650px">
                    <el-table-column
                        prop="id"
                        label="序号"
                        width="64px">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.id }}</el-tag>
                            </div>

                        </template>
                    </el-table-column>
                    <template v-for='(col) in plan1'>
                        <el-table-column
                            :prop="col.dataItem"
                            :label="col.dataName"
                            :key="col.dataItem"
                            width="124px">
                        </el-table-column>
                    </template>
                </el-table>
            </div>
            <div class="chart-show" style="margin-left: 20px">
                <div class="chart-item" v-for="item in source">
                    <div class="chart-item-title" v-cloak>{{ item.name }}</div>
                    <schart :canvasId="item.canvasId" :type="item.canvasId" :data="item.data"
                            width="800" height="600" :options="item.options"></schart>
                </div>
            </div>
        </div>
        <el-dialog title="确定范围" :visible.sync="dialogUpdateForm" width="30%">
            <el-form :model="form">
                <el-form-item label="起始" :label-width="formLabelWidth">
                    <el-input v-model="form.begin" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="结束" :label-width="formLabelWidth">
                    <el-input v-model="form.end"></el-input>
                </el-form-item>
                <el-form-item label="步长" :label-width="formLabelWidth">
                    <el-input v-model="form.step"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateForm = false">取 消</el-button>
                <el-button type="primary" @click="showChange">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Schart from "vue-schart";

    export default {
        data() {
            return {
                title:'选择任务模型',
                title1:'选择算法',
                datalist:[],
                dialogUpdateForm: false,
                dropVisible: false,
                formLabelWidth: '120px',
                form: {
                    begin: '',
                    end: '',
                    step: '',
                },
                tasks: [],
                allData: [],
                 alogrim: [{
                    text: "灰色层次分析法",
                    value: "1",
                },{
                    text:'ADC',
                     value:'2',
                 } ],
                tableData: [],
                plan: [],
                plan1: [],
                nodeIsSelected: [],
                source: [{
                    canvasId: "line",
                    name: "分析结果",
                    data: [{
                        name: '',
                        value: 0,
                    }],
                    options: {
                        title: "灵敏度分析",
                        bgColor: "#fff",
                        titleColor: "#000000",
                        contentColor: "#fff",
                        axisColor: "#000000",
                        fillColor: "#cc0632"
                    }
                }]
            }
        },
        methods: {
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
                            obj.dbValue=v.value;

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
                        for (let i = 0; i < self.allData.length; i++) {
                            for (let y = 0; y < self.datalist.length; y++) {

                                if (self.allData[i].node_id === self.datalist[y].id) {

                                    if (self.allData[i].parent === self.datalist[y].parentID) {
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
                                for(let j=0;j<self.allData.length;j++) {
                                    if( self.allData[j].node_id ===self.datalist[i].id) {
                                        self.allData[j].node_value = self.datalist[i].value;
                                        if(self.title1==='灰色层次分析法')
                                        {
                                            self.allData[j].threat = self.datalist[i].threat;
                                            self.allData[j].spaceThreat = self.datalist[i].spaceThreat;
                                            self.allData[j].emThreat = self.datalist[i].emThreat;
                                            self.allData[j].targetThreat = self.datalist[i].targetThreat;
                                        }
                                        else if(self.title1==='ADC'){
                                            self.allData[j].weight=self.datalist[i].weight;
                                        }
                                    }

                                }
                            }

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
                this.datalist=[];
                this.nodeIsSelected=[];
                this.plan=[];
                this.plan1=[];
                this.source[0].data=[];
                this.allData=[];
                this.tableData=[];
                this.title1='选择算法';
                this.dropVisible=false;
                this.listModules(command);
            },
            handleCommand1(command) {
                let i = 0;
                for (i = 0; i < this.alogrim.length; i++)
                    if (this.alogrim[i].value === command)
                        break;
                this.title1 = this.alogrim[i].text;
            },
            listModules(taskid) {
                const self = this;
                self.$axios.post('/api/node/listNodes', {taskId: parseInt(taskid)}).then((res) => {
                    self.tableData = [];
                    self.allData = [];
                    res.data.some(item => {
                        self.allData.push({
                            node_id: item.id,
                            node_name: item.name,
                            node_value: item.value,
                            dbValue:item.value,
                            parent: item.parent,
                            degree: item.degree,
                            weight: item.weight,
                            threat:'',
                            spaceThreat:'',
                            emThreat:'',
                            targetThreat:'',
                            range: '',
                            long: '',
                        })
                    });
                }).then(() => {
                    for (let i = 0; i < self.allData.length; i++) {
                        if (self.allData[i].degree > 0)
                            self.tableData.push(self.allData[i]);
                    }
                })
            },
            clearItem(index) {
                this.tableData[index].range = "";
                this.tableData[index].long = "";
                this.tableData[index].node_value=this.tableData[index].dbValue;
                for (let i = 0; i < this.nodeIsSelected.length; i++) {
                    if (this.nodeIsSelected[i].node_id === this.tableData[index].node_id)
                        this.nodeIsSelected.splice(i, 1);
                }
            },
            openDiag(row) {
                if(this.datalist.length===0)
                {
                    this.$message.warning('请绑定数据');
                    return;
                }
                this.dialogUpdateForm = true;
                this.form.begin='';
                this.form.end='';
                this.form.step='';
                localStorage.setItem('nodeId', row.node_id);
            },
            checkInput() {
                let point = false;
                for (let i = 0; i < this.form.begin.length; i++) {
                    if (this.form.begin.charAt(i) === '.') {
                        if (!point) point = true;
                        else {
                            this.$message.warning('输入必须为正浮点数');
                            return false;
                        }
                    } else if (this.form.begin.charAt(i) < '0' || this.form.begin.charAt(i) > '9') {
                        this.$message.warning('输入必须为正浮点数');
                        return false;
                    }
                }
                point = false;
                for (let i = 0; i < this.form.end.length; i++) {
                    if (this.form.end.charAt(i) === '.') {
                        if (!point) point = true;
                        else {
                            this.$message.warning('输入必须为正浮点数');
                            return false;
                        }
                    } else if (this.form.end.charAt(i) < '0' || this.form.end.charAt(i) > '9') {
                        this.$message.warning('输入必须为正浮点数');
                        return false;
                    }
                }
                point = false;
                for (let i = 0; i < this.form.step.length; i++) {
                    if (this.form.step.charAt(i) === '.') {
                        if (!point) point = true;
                        else {
                            this.$message.warning('输入必须为正浮点数');
                            return false;
                        }
                    } else if (this.form.step.charAt(i) < '0' || this.form.step.charAt(i) > '9') {
                        this.$message.warning('输入必须为正浮点数');
                        return false;
                    }
                }
                if(parseFloat(this.form.begin)>=parseFloat(this.form.end)){
                    this.$message.warning('输入区间错误');
                    return false;
                }
                return true;
            },
            showChange() {

                if (this.form.begin === '' || this.form.end === '' || this.form.step === '') {
                    this.$message.warning("输入框不能为空");
                    return;
                }
                if(!this.checkInput()){
                    return;
                }
                let id = parseInt(localStorage.getItem("nodeId"));
                let i = 0;
                for (i = 0; i < this.tableData.length; i++)
                    if (this.tableData[i].node_id === id)
                        break;
                this.tableData[i].range = this.form.begin + "-" + this.form.end;
                this.tableData[i].long = this.form.step;
                this.dialogUpdateForm = false;
                const self = this;
                let flag = false;
                let j = 0;
                for (j = 0; j < this.nodeIsSelected.length; j++) {
                    if (this.nodeIsSelected[j].node_id === id) {
                        flag = true;
                        break;
                    }
                }
                if (flag === false) {
                    this.nodeIsSelected.push({
                        node_id: self.tableData[i].node_id,
                        node_name: self.tableData[i].node_name,
                        begin: self.form.begin,
                        end: self.form.end,
                        tempValue: self.form.begin,
                        long: self.form.step
                    });
                } else {
                    this.nodeIsSelected[j].begin = this.form.begin;
                    this.nodeIsSelected[j].end = this.form.end;
                    this.nodeIsSelected[j].long = this.form.step;
                    this.nodeIsSelected[j].tempValue = this.form.begin;
                }

            },
             assignTableAHP(){
                for(let i=0;i<this.allData.length;i++)
                {
                    for(let j=0;j<this.datalist.length;j++)
                    {
                        if(this.datalist[j].id===this.allData[i].node_id) {
                            this.allData[i].threat = this.datalist[j].threat;
                            this.allData[i].spaceThreat = this.datalist[j].spaceThreat;
                            this.allData[i].emThreat = this.datalist[j].emThreat;
                            this.allData[i].targetThreat = this.datalist[j].targetThreat;
                            this.allData[i].weight = this.datalist[j].weight;
                        }
                    }
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
                    self.datalist[i].weight=temp/4;

                }
                this.assignTableAHP();
            },
            calAHP(){
                const self=this;
                if(this.title1==='灰色层次分析法')
                    this.AHPweight();

                for(let i=0;i<this.plan.length;i++)
                {
                    for(let g=0;g<this.datalist.length;g++){
                        this.datalist[g].value=this.datalist[g].dbValue;
                    }

                    for(let j=0;j<this.datalist.length;j++)
                    {
                        this.datalist[j].value=this.plan[i][this.datalist[j].name];
                    }

                    if(this.title1==='灰色层次分析法')
                    {
                       for (let a=this.datalist.length-1; a >0;a--) {
                             for (let y = 0; y < self.datalist.length; y++) {

                                if (self.datalist[y].id === self.datalist[a].parentID) {

                                     let temp_value = parseFloat(self.datalist[a].value);
                                    let temp_weight = parseFloat(self.datalist[a].weight);
                                    let temp = parseFloat(self.datalist[y].value);
                                    temp += temp_weight * temp_value;
                                     self.datalist[y].value = temp.toFixed(5);
                                }
                             }

                        }
                     }
                     else if(this.title1='ADC'){
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
                        result = self.datalist[1].value*self.datalist[2].value*self.datalist[3].value*self.datalist[4].value*(100-self.datalist[1].value);
                        self.datalist[0].value = result.toFixed(2);
                    }

                    for(let x=0;x<this.datalist.length;x++)
                        if(this.datalist[x].parentID===0)
                        {
                            this.plan[i].root=this.datalist[x].value;
                        }
                }
            },
            startAnalyse() {
                if (this.tableData.length === 0) {
                    this.$message.warning("请先选择任务模型");
                    return;
                }
                if (this.nodeIsSelected.length === 0) {
                    this.$message.warning("请先为结点确定一个变换范围(双击对应结点)");
                    return;
                }
                let i = 0;
                let length = this.nodeIsSelected.length;
                this.plan = [];
                let y = 1;
                this.dropVisible = true;
                for (i = 0; i < this.nodeIsSelected.length; i++) {
                    this.nodeIsSelected[i].tempValue = this.nodeIsSelected[i].begin;
                }
                i = 0;
                while (parseFloat(this.nodeIsSelected[length - 1].tempValue) < parseFloat(this.nodeIsSelected[length - 1].end)) {
                    if (parseFloat(this.nodeIsSelected[i].tempValue) < parseFloat(this.nodeIsSelected[i].end)) {
                        i = 0;
                        let obj = {};
                        let tempkey = 'id';
                        obj[tempkey] = y;
                        for (let j = 0; j < this.nodeIsSelected.length; j++) {
                            let key = this.nodeIsSelected[j].node_name;
                            obj[key] = this.nodeIsSelected[j].tempValue;
                            for (let m = 0; m < this.allData.length; m++) {
                                if (this.allData[m].node_id === this.nodeIsSelected[j].node_id) {
                                    this.allData[m].node_value = this.nodeIsSelected[j].tempValue;

                                } else {
                                    let key5 = this.allData[m].node_name;
                                    obj[key5] = this.allData[m].node_value;
                                }
                            }
                        }
                        let key1 = "root";
                        obj[key1] = 0;
                        this.plan.push(obj);
                        y++;
                        let tempValue = parseFloat(this.nodeIsSelected[i].tempValue);
                        let long = parseFloat(this.nodeIsSelected[i].long);
                        this.nodeIsSelected[i].tempValue = tempValue + long;
                    } else {
                        this.nodeIsSelected[i].tempValue = this.nodeIsSelected[i].begin;
                        i++;
                        if (i < length) {
                            this.nodeIsSelected[i].tempValue = parseFloat(this.nodeIsSelected[i].tempValue) + parseFloat(this.nodeIsSelected[i].long);

                        }
                    }
                    if(this.plan.length>=50) {
                        this.$message.warning("方案过多，只显示前50组方案");
                        break;
                    }
                }
                this.calAHP();
                this.plan1 = [];
                for (let x = 0; x < this.tableData.length; x++) {
                    this.plan1.push({
                        dataItem: this.tableData[x].node_name,
                        dataName: this.tableData[x].node_name,
                    })
                }
                this.plan1.push({
                    dataItem: 'root',
                    dataName: 'root',
                })
                this.source[0].data = [];
                for (let g = 0; g < this.plan.length; g++) {
                    this.source[0].data.push({
                        name: this.plan[g].id,
                        value: this.plan[g].root
                    })
                }
            },
        },
        mounted() {
            this.listTaskid();
        },
        components: {
            Schart
        },

    }
</script>
<style>
    #wrap {
        display: flex;
    }
</style>
