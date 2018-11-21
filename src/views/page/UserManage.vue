<template>
    <div>
        <div style="height: 50px">
            <el-input style="Float: left;height:50px;width: 500px;" float="left"
                      v-model="keyWord"
                      placeholder="请输入用户名"
                      clearable></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="searchUser" icon="el-icon-search">搜索
            </el-button>
        </div>
        <el-table
            :data="tableData"
            height="600"
            stripe
            border
            style="width: 80%"
            highlight-current-row
        >
            <el-table-column
                prop="name"
                label="用户名称"
                width="200%">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                label="删除用户"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="删除" placement="top">
                        <el-button icon="el-icon-delete" type="primary" size="medium"
                                   @click="deleteUser(scope.$index)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    export default {
        name: "UserManange",
        data() {
            return {
                dialogAddForm: false,
                keyWord: "",
                formLabelWidth: '120px',
                filterText: "",
                tableData: [],
                allData:[],
                recordInfo:[],
            }
        },
        methods:{
            listUser(){
                const self=this;
                self.$axios.post('/api/user/listUser').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        self.tableData.push({
                            userid: item.userid,
                            name: item.username,
                            password: item.password,
                            userkind: item.userkind,
                            money:item.money
                        })
                    });
                }).then(()=>{
                    self.allData=self.tableData;
                });
            },
            searchUser(){
                console.log(this.keyWord);
                this.tableData = [];

                for (let i = 0; i < this.allData.length; i++) {
                    if (this.allData[i].name === this.keyWord ) {
                        this.tableData.unshift(this.allData[i]);

                    }
                    else if (this.allData[i].name.indexOf(this.keyWord)!==-1 ) {
                        this.tableData.push(this.allData[i]);

                    }
                }
            },

            deleteUser(index){
                const self=this;
                self.$http.post('/api/user/deleteUser',{
                    userid: self.tableData[index].userid
                },{}).then(()=>{
                    self.listUser();
                })
            }
        },
        mounted(){
            this.listUser();
        }
    }
</script>

<style scoped>

</style>
