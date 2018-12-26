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
            <el-button style="Float: left;height:40px;" type="primary" @click="startAnalyse" >灵敏度分析
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
                        width="800" height="600"  :options="item.options"></schart>
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
                <el-button type="primary" @click="showChange">确 定</el-button>
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
                dropVisible:false,
                formLabelWidth: '120px',
                form:{
			        begin:'',
                    end:'',
                    walkLong:'',
                },
			    tasks:[],
                allData:[],
                tableData:[],
                plan:[],
                plan1:[],
                nodeIsSelected:[],
				source:[{
				    canvasId:"line",
		            name:"分析结果",
		            data:[{
				        name:'',
                        value:0,
                    }],
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
                            weight:item.weight,
                            range:'',
                            long:'',
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
            clearItem(index){
                this.tableData[index].range="";
                this.tableData[index].long="";
                for(let i=0;i<this.nodeIsSelected.length;i++)
                {
                    if(this.nodeIsSelected[i].node_id===this.tableData[index].node_id)
                        this.nodeIsSelected.splice(i,1);
                }
            },
            openDiag(row){
                this.dialogUpdateForm=true;
                localStorage.setItem('nodeId', row.node_id);
            },
            showChange(){
                if(this.form.begin===''||this.form.end===''||this.form.end==='')
                {
                    this.$message.warning("输入框不能为空");
                    return;
                }
                let id=parseInt(localStorage.getItem("nodeId"));
                let i=0;
                for(i=0;i<this.tableData.length;i++)
                    if(this.tableData[i].node_id===id)
                        break;
                this.tableData[i].range=this.form.begin+"-"+this.form.end;
                this.tableData[i].long=this.form.walkLong;
                this.dialogUpdateForm=false;
                const self=this;
                let flag=false;
                let j=0;
                for(j=0;j<this.nodeIsSelected.length;j++)
                {
                    if(this.nodeIsSelected[j].node_id===id)
                    {
                        flag=true;
                    }
                }
                if(flag===false) {
                    this.nodeIsSelected.push({
                        node_id: self.tableData[i].node_id,
                        node_name: self.tableData[i].node_name,
                        begin: self.form.begin,
                        end: self.form.end,
                        tempValue: self.form.begin,
                        long: self.form.walkLong
                    });
                }
                else{
                    this.nodeIsSelected[j].begin=this.form.begin;
                    this.nodeIsSelected[j].end=this.form.end;
                    this.nodeIsSelected[j].long=this.form.walkLong;
                    this.nodeIsSelected[j].tempValue=this.form.begin;
                }
                this.form={};
            },
            startAnalyse(){
                if(this.tableData.length===0) {
                    this.$message.warning("请先选择任务模型");
                    return;
                }
                if(this.nodeIsSelected.length===0){
                    this.$message.warning("请先为结点确定一个变换范围(双击对应结点)");
                    return ;
                }
                let i=0;
                let length=this.nodeIsSelected.length;
                this.plan=[];
                let y=1;
                this.dropVisible=true;
                for(i=0;i<this.nodeIsSelected.length;i++)
                {
                    this.nodeIsSelected[i].tempValue=this.nodeIsSelected[i].begin;
                }
                i=0;
                while(parseFloat(this.nodeIsSelected[length-1].tempValue)<parseFloat(this.nodeIsSelected[length-1].end))
                {
                    if(parseFloat(this.nodeIsSelected[i].tempValue)<parseFloat(this.nodeIsSelected[i].end))
                    {
                        i=0;
                        let obj={};
                        let tempkey='id';
                        obj[tempkey]=y;
                        for(let j=0;j<this.nodeIsSelected.length;j++)
                        {
                            let key=this.nodeIsSelected[j].node_name;
                            obj[key]=this.nodeIsSelected[j].tempValue;
                            for(let m=0;m<this.allData.length;m++)
                            {
                                if(this.allData[m].node_id===this.nodeIsSelected[j].node_id)
                                {
                                    this.allData[m].node_value=this.nodeIsSelected[j].tempValue;

                                }
                                else
                                {
                                    let key5=this.allData[m].node_name;
                                    obj[key5]=this.allData[m].node_value;
                                }
                            }
                        }
                        for (let n = this.allData.length-1; n >0; n--) {
                             for (let a =this.allData.length-1; a >=0; a--) {

                                    if (this.allData[a].node_id === this.allData[n].parent) {

                                        let temp_value = parseFloat(this.allData[n].node_value);
                                        let temp_weight = parseFloat(this.allData[n].weight);
                                        let temp = parseFloat(this.allData[a].node_value);
                                        temp += temp_weight * temp_value;
                                        this.allData[a].node_value = temp;

                                     }
                             }

                         }
                         for(let l=0;l<this.allData.length;l++)
                             if(this.allData[l].parent===0){
                                  let key1="root";
                                 obj[key1]=this.allData[l].node_value;
                             }
                        this.plan.push(obj);
                        y++;
                        for(let d=0;d<this.allData.length;d++)
                            for(let r=0;r<this.tableData.length;r++)
                            {
                                if(this.allData[d].node_id!==this.tableData[r].node_id)
                                    this.allData[d].node_value=0;
                            }
                        let tempValue=parseFloat(this.nodeIsSelected[i].tempValue);
                        let long=parseFloat(this.nodeIsSelected[i].long);
                        this.nodeIsSelected[i].tempValue=tempValue+long;
                    }
                    else{
                        this.nodeIsSelected[i].tempValue=this.nodeIsSelected[i].begin;
                        i++;
                        if(i<length)
                        {
                            this.nodeIsSelected[i].tempValue=parseFloat(this.nodeIsSelected[i].tempValue)+parseFloat(this.nodeIsSelected[i].long);

                        }
                    }
                }
                this.plan1=[];
                for(let x=0;x<this.tableData.length;x++)
                {
                    this.plan1.push({
                        dataItem:this.tableData[x].node_name,
                        dataName:this.tableData[x].node_name,
                    })
                }
                this.plan1.push({
                    dataItem:'root',
                    dataName:'root',
                })
                this.source[0].data=[];
                for(let g=0;g<this.plan.length;g++)
                {
                    this.source[0].data.push({
                        name:this.plan[g].id,
                        value:this.plan[g].root
                    })
                }
            },
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
