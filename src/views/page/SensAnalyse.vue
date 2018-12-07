<template>
   <div>
        <div style="height: 50px">
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
       <div id="wrap">
         <el-table
            :data="tableData"
            height="600"
            stripe
            border
            @row-dblclick="openDiag"
            style="width: 40%">
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
         </el-table>
       <div class="chart-show">
        	<div class="chart-item" v-for="item in source">
        		<div class="chart-item-title" v-cloak>{{ item.name }}</div>
        		<schart :canvasId="item.canvasId" :type="item.canvasId" :data="item.data" width="600" height="600" :options="item.options"></schart>
        	</div>
        </div>
       </div>
       <el-dialog title="确定范围" :visible.sync="dialogUpdateForm" width="30%">
            <el-form :model="form">
                <el-form-item label="起始" :label-width="formLabelWidth">
                    <el-input v-model="form.begin" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="结束" :label-width="formLabelWidth">
                    <el-input v-model="form.end"  ></el-input>
                </el-form-item>
                <el-form-item label="步长" :label-width="formLabelWidth">
                    <el-input v-model="form.walkLong"  ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateForm = false">取 消</el-button>
                <el-button type="primary" @click="showChart">确 定</el-button>
            </div>
        </el-dialog>
   </div>
</template>

<script>
    import Schart from "vue-schart";
	export default {
		data () {
			return {
			    dialogUpdateForm:false,
                formLabelWidth: '120px',
                form:{
			        begin:'',
                    end:'',
                    walkLong:'',
                },
			    tasks:[],
                allData:[],
                temp:[],
                tableData:[],
                temp1:[],
				source:[{
				    canvasId:"line",
		            name:"折线图",
		            data:[],
                    options:{
			            title:"灵敏度分析",
			            bgColor:"#009688",
			            titleColor:"#fff",
			            contentColor:"#cc0632",
			            axisColor:"#FFF",
			            fillColor:"#d9f501"
		            }
                }]
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
                this.listModules(command);
            },
            listModules(taskid){
                const self = this;
                self.$axios.post('/api/node/listNodes', {taskId: parseInt(taskid)}).then((res) => {
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
            openDiag(row){
                this.dialogUpdateForm=true;
                localStorage.setItem('nodeId', row.node_id);
            },
            showChart(){
                this.dialogUpdateForm=false;
                let id=localStorage.getItem("nodeId");
                for(let m=parseInt(this.form.begin);m<=parseInt(this.form.end);m=m+parseInt(this.form.walkLong))
                {
                    let flag = -3;
                    let sum=0;
                    this.temp=[];
                    for(let i=0;i<this.allData.length;i++)
                    {
                        let res={};
                        for(var key in this.allData[i])
                        {
                            res[key]=this.allData[i][key];
                        }
                        this.temp.push(res);
                    }
                    while (flag<0) {
                        this.temp1 = [];
                        for (let i = 0; i < this.temp.length; i++) {
                            if (this.temp[i].node_id === parseInt(id)) {
                                this.temp[i].node_value = m;
                            }
                            if (this.temp[i].degree > 0) {
                                this.temp1.push(this.temp[i]);
                            }
                        }
                        for (let i = 0; i < this.temp1.length; i++) {
                            for (let j = 0; j < this.temp.length; j++) {
                                if (this.temp1[i].parent === this.temp[j].node_id) {
                                    this.temp[j].node_value += this.temp1[i].node_value * 2;
                                    this.temp[j].degree++;
                                }
                                if (this.temp1[i].node_id === this.temp[j].node_id) {
                                    this.temp.splice(j, 1);
                                }
                            }
                        }
                        for (let i = 0; i < this.temp.length; i++) {
                            if (this.temp[i].parent === 0) {
                                flag = this.temp[i].degree;
                                sum=this.temp[i].node_value;
                            }
                        }

                    }
                    this.source[0].data.push({
                        name: m.toString(),
                        value: sum.toString()
                    })
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
<style>
    #wrap{
    display: flex;
    }
</style>
