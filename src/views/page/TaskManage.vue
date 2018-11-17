<template>

    <div>
        <div style="height: 50px">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{dropItem}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="科学">科学</el-dropdown-item>
                    <el-dropdown-item command="自然">自然</el-dropdown-item>
                    <el-dropdown-item command="文化">文化</el-dropdown-item>
                    <el-dropdown-item command="全部">全部</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-input style="Float: left;height:50px;width: 500px;" float="left"
                      v-model="keyWord"
                      placeholder="请输入书名、作者"
                      clearable></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="searchBook" icon="el-icon-search">搜索
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
                label="图书名称"
                width="200%">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="writer"
                label="图书作者"
                width="200%"
            >
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.writer }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="resbooks"
                label="可借数量"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.resbooks }}</span>
                </template>
            </el-table-column>
            <el-table-column

                label="状态"
                width="150">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.hint" placement="top">
                        <el-button :icon="scope.row.icon" :type="scope.row.type" size="medium"
                                   @click="bookInformation(scope.$index)"></el-button>
                    </el-tooltip>

                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="借阅书籍信息" :visible.sync="dialogAddForm" width="30%">
            <div width="30%">
                <el-form :model="form">
                    <el-form-item label="书籍编号" :label-width="formLabelWidth">
                        <el-input v-model="form.bookId" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="书籍名称" :label-width="formLabelWidth">
                        <el-input v-model="form.bookname" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="书籍作者" :label-width="formLabelWidth">
                        <el-input v-model="form.writer" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="书籍类别" :label-width="formLabelWidth">
                        <el-input v-model="form.bookkind" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="索书号" :label-width="formLabelWidth">
                        <el-input v-model="form.findNumber" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="剩余数量" :label-width="formLabelWidth">
                        <el-input v-model="form.resbooks" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="总数量" :label-width="formLabelWidth">
                        <el-input v-model="form.allbooks" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="dialogAddForm = false" style="margin-left: 30%;">取 消</el-button>
                <el-button type="primary" @click="updateInfor">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TaskManage",

        data() {
            return {
                dialogAddForm: false,
                keyWord: "",
                formLabelWidth: '120px',
                dropItem: "全部",
                filterText: "",
                prop: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
                tableData: [{
                    bookId:0,
                    name:"",
                    writer:"",
                    resbooks:0,
                    allData:0,
                    bookkind:"",
                    findNumber:"",

                }],
                allData:[],
                recordInfo:[],
                form: {
                    bookId: 0,
                    bookname: '',
                    writer: '',
                    findNumber: '',
                    resbooks: 0,
                    allbooks: 0,
                    bookkind: 0,
                }
            }
        },
        methods: {
            handleCommand(command) {
                this.dropItem = command;
                this.tableData=[];
                if(command!=="全部")
                {
                    for(let i=0;i<this.allData.length;i++)
                    {
                        if(this.allData[i].bookkind.indexOf(command)!==-1)
                            this.tableData.unshift(this.allData[i]);
                    }
                }
                else {
                    this.tableData=this.allData;
                }
                this.$message('调整类别为' + command);
            },
            searchBook() {
                console.log(this.keyWord);
                this.tableData = [];

                for (let i = 0; i < this.allData.length; i++) {
                    if (this.allData[i].name === this.keyWord || this.allData[i].writer === this.keyWord) {
                        this.tableData.unshift(this.allData[i]);

                    }
                    else if (this.allData[i].name.indexOf(this.keyWord)!==-1 || this.allData[i].writer.indexOf(this.keyWord)!==-1) {
                        this.tableData.push(this.allData[i]);

                    }
                }

            },
            bookInformation(index) {
                if(this.tableData[index].flag===false)
                {
                    this.$message.warning("不可以借同一本书");
                    return;
                }
                this.dialogAddForm = true;
                this.form.bookId = this.tableData[index].bookId;
                this.form.bookname = this.tableData[index].name;
                this.form.writer = this.tableData[index].writer;
                this.form.findNumber = this.tableData[index].findNumber;
                this.form.resbooks = this.tableData[index].resbooks;
                this.form.allbooks = this.tableData[index].allbooks;
                this.form.bookkind = this.tableData[index].bookkind;
                localStorage.setItem('bookid', index);
            },
            updateInfor() {
                const self = this;
                self.dialogAddForm = false;
                let bookNum=parseInt(localStorage.getItem("books-num"));
                if(bookNum===0){
                    this.$message.warning("已超过最大借书数量");
                    return;
                }
                let id = localStorage.getItem("bookid");
                let temp = parseInt(self.tableData[id].resbooks) - 1;
                if(temp<0){
                    this.$message.warning("可借数量为0");
                    return;
                }
                localStorage.setItem('books-num',bookNum-1);



                self.tableData[id].resbooks = temp;
                self.$http.post('/api/books/updateBook', {
                    resbooks: temp,
                    allbooks: parseInt(self.tableData[id].allbooks),
                    bookId: parseInt(self.tableData[id].bookId)
                }, {}).then((response) => {
                    let newid = localStorage.getItem("user-id");
                    console.log(newid);
                    this.$http.post('/api/record/addRecord', {
                        userid: parseInt(newid),
                        bookid: parseInt(self.tableData[id].bookId)
                    }, {}).then((response) => {
                        self.listTask();
                    })
                });
                self.$http.post('/api/user/updateBooksNum', {
                    booksnum: bookNum-1,
                    userid: parseInt(localStorage.getItem("user-id"))
                }, {});

            },

            listTask() {
                const self = this;
                let id=parseInt(localStorage.getItem("user-id"));
                self.$axios.post('/api/record/listRecord',{
                    userid:id
                },{}).then((res) => {
                    self.recordInfo = [];
                    res.data.some(item => {
                        self.recordInfo.push({
                            bookid: item.bookid,
                        })
                    });
                    console.log(self.recordInfo);
                    self.$axios.post('/api/books/listBook').then((res) => {
                        self.tableData = [];
                        res.data.some(item => {
                            let temp=true;
                            let hint1="借阅";
                            let type1="primary";
                            let icon1="el-icon-plus";
                            for(let i=0;i<self.recordInfo.length;i++)
                                if(item.bookId===self.recordInfo[i].bookid) {
                                    temp = false;
                                    hint1="已借阅";
                                    type1="success";
                                    icon1="el-icon-check";
                                }
                            self.tableData.push({
                                 bookId: item.bookId,
                                 name: item.bookname,
                                 writer: item.writer,
                                 resbooks: item.resbooks,
                                 findNumber: item.findNumber,
                                 allbooks: item.allbooks,
                                 bookkind: item.bookkind,
                                 hint: hint1,
                                 icon: icon1,
                                 flag:temp,
                                 type:type1,
                             })
                        });
                     }).then(()=>{
                        self.allData=self.tableData;

                     });
                })

            },
            getDate(day) {
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
                return dateyear + '-' + datemonth + '-' + dateday + ' ' + datehour + ':' + datemin + ':' + datesec;
            },
        },
        mounted() {
            this.listTask();
        },
    }
</script>

<style scoped>

</style>
