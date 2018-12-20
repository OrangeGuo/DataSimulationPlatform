<template>
    <div>
        <div style="height: 50px">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item v-for="item in tasks" :command="item.value" >{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand1" style="margin-left: 20px" v-show="dropVisible">
                <span class="el-dropdown-link">
                    {{title1}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item v-for="item in alogrim" :command="item.value" >{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <input style="margin-left: 20px" type="file" @change="importf(this)"
                   v-show="inputVisible"
                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
             <el-button style="Float: left;height:40px;margin-left: 20px" type="primary" @click="Analyse" >一键分析
            </el-button>
        </div>
        <div class="chart-show">
        	<div class="chart-item" v-for="item in source">
        		<div class="chart-item-title" v-cloak>{{ item.name }}</div>
        		<schart :canvasId="item.canvasId" :type="item.canvasId" :data="item.data" width="600" height="600" :options="item.options"></schart>
        	</div>
        </div>
    </div>
</template>

<script>
    import Schart from "vue-schart";
    export default {
        name: "IndexBinding",
        data(){
            return{
               tasks:[],
                dropVisible:false,
                inputVisible:false,
                title:"选择任务模型",
                title1:"选择算法",
                alogrim:[{
                   text:"AHP",
                    value:"1",
                },{
                   text:"ADC",
                    value:"2",
                }],
                source:[{
				    canvasId:"bar",
		            name:"柱状图",
		            data:[{
				        name:"结点一",
                        value:20,
                    },{
				        name:"结点二",
                        value:25,
                    },{
				        name:"结点三",
                        value:31,
                    }],
                    options:{
			            title:"分析结果",
			            bgColor:"#009688",
			            titleColor:"#fff",
			            contentColor:"#cc0632",
			            axisColor:"#FFF",
			            fillColor:"#d9f501"
		            }
                }]
            }
        },

        methods: {
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
                let i=0;
                for(i=0;i<this.tasks.length;i++)
                    if(this.tasks[i].value===command)
                        break;
                this.title=this.tasks[i].text;
                this.dropVisible=true;
            },
            handleCommand1(command){
                let i=0;
                for(i=0;i<this.alogrim.length;i++)
                    if(this.alogrim[i].value===command)
                        break;
                this.title1=this.alogrim[i].text;
                this.inputVisible=true;
            },
            Analyse(){
                this.showInbar();
            },
            showInbar(){
                const self=this;

            },
            importf(obj) {

                let _this = this;

                let inputDOM = this.$refs.inputer;   // 通过DOM取文件数据

                this.file = event.currentTarget.files[0];

                let rABS = false; //是否将文件读取为二进制字符串

                let f = this.file;

                let reader = new FileReader();

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

                        let arr = []

                        outdata.map(v => {

                            let obj = {}

                            obj.account = v.登录账号

                            obj.name = v.姓名

                            obj.department = v.部门

                            obj.secondDepartment = v.二级部门

                            obj.status = v.状态

                            obj.id = v.id

                            arr.push(obj)

                        })

                        _this.accountList = [...arr];

                        console.log(_this.accountList)

             

                    }

                    reader.readAsArrayBuffer(f);

                }

                if (rABS) {

                    reader.readAsArrayBuffer(f);

                } else {

                    reader.readAsBinaryString(f);

                }


            }

        },
        mounted(){
            this.listTaskid();
        },
        components:{
			Schart
		},
    }
</script>

<style scoped>

</style>
