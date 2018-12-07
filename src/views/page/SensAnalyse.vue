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
			        begin:0,
                    end:0
                },
			    tasks:[],
                allData:[],
                tableData:[],
				source:[{
				    canvasId:"line",
		            name:"折线图",
		            data:[
			            {
				            name:"坚果",
				            value:"7890"
			            },{
				            name:"果铺",
				            value:"5490"
			            },{
				            name:"特产",
				            value:"5509"
			            },{
				            name:"早餐",
				            value:"1231"
                        },{
				            name:"进口食品",
				            value:"231"
			            },{
				            name:"年货",
				            value:"9800"
			            },{
				            name:"其它",
				            value:"2311"
			            }
                    ],
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
                this.$message(command);
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
                        })
                    });
                }).then(()=>{
                    for(let i=0;i<self.allData.length;i++)
                    {
                        let j=0;
                        for(j=0;j<self.allData.length;j++)
                        {
                            if(self.allData[i].node_id===self.allData[j].parent)
                            {
                                break;
                            }
                        }
                        if(j===self.allData.length)
                            self.tableData.push(self.allData[i]);
                    }
                })
            },
            openDiag(){
                this.dialogUpdateForm=true;
            },
            showChart(){
                this.dialogUpdateForm=false;
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
