<template>

    <div>
        <div style="height: 50px">

            <el-input style="Float: left;height:50px;width: 500px;" float="left" v-model="keyWord"
                      placeholder="请输入书名、作者"
                      clearable></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="searchBook" icon="el-icon-search">搜索
            </el-button>
            <el-button style="Float: left;height:40px;" type="primary" @click="openSellInfo" >支付
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
                width="150%">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="writer"
                label="图书作者"
                width="150%"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.writer }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                label="单价"
                width="120%"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="renew"
                label="购买数量"
                width="120%"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.renew }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="deadline"
                label="加入购物车日期"
                width="150%">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.deadline }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="150%">
                <template slot-scope="scope">
                    <el-tooltip content="减少" placement="top">
                        <el-button icon="el-icon-minus" @click="returnBook(scope.$index)" type="primary"
                                   size="medium"></el-button>
                    </el-tooltip>
                    <el-tooltip content="增加" placement="top">
                        <el-button icon="el-icon-plus" @click="renewBook(scope.$index)" type="primary"
                                   size="medium"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
             <el-table-column
                prop="flag"
                label="选中"
                width="80%">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.flag" style="margin-left: 10px"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="购买信息" :visible.sync="dialogAddForm" width="30%">
            <div width="30%">
                <el-form :model="form">
                    <el-form-item label="地址" :label-width="formLabelWidth">
                        <el-input v-model="form.address" autocomplete="off" ></el-input>
                    </el-form-item>
                    <el-form-item label="总价" :label-width="formLabelWidth">
                        <el-input v-model="form.sum" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>

                </el-form>
                <el-button @click="dialogAddForm = false" style="margin-left: 30%;">取 消</el-button>
                <el-button type="primary" @click="payBooks">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TaskManage",
        data() {
            return {
                dialogAddForm:false,
                formLabelWidth: '120px',
                dropItem: "全部",
                keyWord: "",
                currentDate: "",
                tableData: [],
                allData: [],
                allBooks: [],
                bookList: [],
                form: {
                    username:'',
                    address: '',
                    sum:'',
                }
            }
        },
        methods: {
            /*handleCommand(command) {
                this.dropItem = command;
                this.tableData = [];
                if (command !== "全部") {
                    for (let i = 0; i < this.allData.length; i++) {
                        if (command === '一周内') {
                            if (this.allData[i].leftDays <= 7 && this.allData[i].leftDays > 0)
                                this.tableData.push(this.allData[i]);
                        }
                        else if (command === '一周以上') {
                            if (this.allData[i].leftDays > 7)
                                this.tableData.push(this.allData[i]);
                        }
                        else if (command === '已逾期') {
                            if (this.allData[i].leftDays < 0)
                                this.tableData.push(this.allData[i]);
                        }
                        console.log(this.allData[i].leftDays);
                    }
                }
                else {
                    this.tableData = this.allData;
                }
                this.$message('还书时间:' + command);
            },*/

            listTask() {
                const self = this;
                self.$axios.post('/api/books/listBook').then((res) => {
                    self.allBooks = [];
                    res.data.some(item => {
                        self.allBooks.push({
                            bookname: item.bookname,
                            writer: item.writer,
                            resbooks: item.resbooks,
                            findNumber: item.findNumber,
                            bookId: item.bookId,
                            allbooks: item.allbooks,
                            bookkind: item.bookkind,
                            price:item.price,
                        })
                    });
                }).then(()=> {
                    self.$axios.post('/api/record/listRecord', {userid: localStorage.getItem("user-id")}, {}).then((res) => {
                        self.bookList = [];
                        res.data.some(item => {
                            self.bookList.push({
                                bookId: item.bookid,
                                borrowDate: item.borrowDate,
                                renew: item.renew,
                                price: item.price
                            })
                        });
                    }).then(() => {
                        self.tableData = [];
                        for (let i = 0; i < self.bookList.length; i++) {
                            for (let j = 0; j < self.allBooks.length; j++) {
                                if (self.bookList[i].bookId === self.allBooks[j].bookId) {
                                    let item = self.allBooks[j];
                                    self.tableData.push({
                                        name: item.bookname,
                                        writer: item.writer,
                                        resbooks: item.resbooks,
                                        findNumber: item.findNumber,
                                        bookId: item.bookId,
                                        allbooks: item.allbooks,
                                        bookkind: item.bookkind,
                                        borrowDate: self.bookList[i].borrowDate,
                                        price: item.price,
                                        flag: true,
                                        renew: self.bookList[i].renew,
                                        deadline: self.getDate(self.bookList[i].borrowDate, -1),
                                        leftDays: self.getDays(self.bookList[i].borrowDate, self.bookList[i].renew) - self.getDays(self.currentDate, -1)
                                    });
                                    break;
                                }
                            }
                        }
                        self.allData = self.tableData;
                    });
                });
            },
            searchBook() {
                console.log(this.keyWord);
                this.tableData = [];
                for (let i = 0; i < this.allData.length; i++) {
                    if (this.allData[i].name === this.keyWord || this.allData[i].writer === this.keyWord) {
                        this.tableData.unshift(this.allData[i]);
                    }
                    else if (this.allData[i].name.indexOf(this.keyWord) !== -1 || this.allData[i].writer.indexOf(this.keyWord) !== -1) {
                        this.tableData.push(this.allData[i]);
                    }
                }
            },
            returnBook(index) {
                const self = this;
                let tempR=parseInt(self.tableData[index].renew)-1;
                let temp = parseInt(self.tableData[index].resbooks) + 1;
                if(tempR==0)
                {
                    self.$http.post('/api/record/deleteRecord', {
                        userid: parseInt(localStorage.getItem('user-id')),
                        bookid: parseInt(self.tableData[index].bookId)
                    }, {}).then(()=>{
                        let temp = parseInt(self.tableData[index].resbooks) + 1;
                        self.$http.post('/api/books/updateBook', {
                            resbooks: temp,
                            allbooks: parseInt(self.tableData[index].allbooks),
                            price:parseInt(self.tableData[index].price),
                            bookId: parseInt(self.tableData[index].bookId)
                        }, {}).then(()=>{
                         
                            self.listTask();
                        });
                    });
                }
                else {
                    self.$http.post('/api/record/updateRecord', {
                        renew: tempR,
                        userid: parseInt(localStorage.getItem('user-id')),
                        bookid: parseInt(self.tableData[index].bookId)
                    }, {}).then(()=>{


                        self.$http.post('/api/books/updateBook', {
                            resbooks: temp,
                            allbooks: parseInt(self.tableData[index].allbooks),
                            price:parseInt(self.tableData[index].price),
                            bookId: parseInt(self.tableData[index].bookId)
                        }, {}).then(()=>{


                            self.listTask();
                            console.log(temp);
                        });
                    });
                }



            },
            renewBook(index) {
                if(this.tableData[index].resbooks-1<0)
                {
                    this.$message.warning("库存不够");
                    return;
                }
                const self = this;
                self.$http.post('/api/record/updateRecord', {
                    userid: parseInt(localStorage.getItem('user-id')),
                    bookid: parseInt(self.tableData[index].bookId),
                    renew: parseInt(self.tableData[index].renew) + 1
                }, {}).then(()=>{
                    self.$http.post('/api/books/updateBook',{
                        resbooks:self.tableData[index].resbooks-1,
                        allbooks:self.tableData[index].allbooks,
                        price:parseInt(self.tableData[index].price),
                        bookId:parseInt(self.tableData[index].bookId)
                    },{}).then(()=>{
                        self.listTask();
                    })
                });
            },
           /* getBooks() {
                const self = this;
                self.$axios.post('/api/books/listBook').then((res) => {
                    self.allBooks = [];
                    res.data.some(item => {
                        self.allBooks.push({
                            bookname: item.bookname,
                            writer: item.writer,
                            resbooks: item.resbooks,
                            findNumber: item.findNumber,
                            bookId: item.bookId,
                            allbooks: item.allbooks,
                            bookkind: item.bookkind,
                            price:item.price,
                        })
                    });
                });
            },*/
           openSellInfo(){
                if(this.tableData.length===0)
                {
                    this.$message.warning("购物车为空");
                    return ;
                }
                let sum=0;
                for(let i=0;i<this.tableData.length;i++)
                {
                    if(this.tableData[i].flag===true)
                        sum=sum+parseInt(this.tableData[i].price)*parseInt(this.tableData[i].renew);
                }

                this.form.sum=sum.toString();
                this.dialogAddForm=true;
           },
            payBooks(){
                this.dialogAddForm=false;
                const self=this;
                var mydate=new Date();
                var date=mydate.toLocaleDateString()+mydate.toLocaleTimeString();
                console.log(date);
                self.$http.post('/api/user/updateMoney', {
                    userid: parseInt(localStorage.getItem('user-id')),
                    money: parseInt(localStorage.getItem('user-money'))-parseInt(self.form.sum),
                }, {}).then(()=> {
                    localStorage.setItem('user-money',parseInt(localStorage.getItem('user-money'))-parseInt(self.form.sum));
                    self.$http.post('/api/sellRecord/addSell', {
                        usename: localStorage.getItem('user-name'),
                        address: self.form.address,
                        sum:parseInt(self.form.sum),
                        date: date
                     }, {}).then(()=>{
                        for(let i=0;i<self.tableData.length;i++)
                        {
                            if(self.tableData[i].flag===true)
                            {
                                self.$http.post('/api/record/deleteRecord', {
                                    bookid: parseInt(self.tableData[i].bookId),
                                    userid: parseInt(localStorage.getItem('user-id'))
                                }, {}).then(()=>{
                                    self.listTask();
                                })
                            }
                        }
                    })
                    //this.$message.info(sum.toString());
                })
            },
            getDays(day, renew) {
                day = day.split("-");
                let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                let dateYear = parseInt(day[0]);
                let dateMonth = parseInt(day[1]) + renew;
                if (dateMonth >= 12)
                    dateYear++;
                dateMonth = dateMonth % 12 + 1;

                day = day[2].split("T")
                let dateDay = parseInt(day[0]) + 1;
                if (days[dateMonth - 1] < dateDay) {
                    dateDay = days[dateMonth - 1];
                }
                let sum = dateYear * 365;
                for (let i = 0; i < dateMonth - 1; i++) {
                    sum += days[i];
                }

                return sum + dateDay;
            },
            getDate(day, renew) {
                day = day.split("-");
                let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                let dateYear = parseInt(day[0]);
                let dateMonth = parseInt(day[1]) + renew;
                if (dateMonth >= 12)
                    dateYear++;
                dateMonth = dateMonth % 12 + 1;

                day = day[2].split("T")
                let dateDay = parseInt(day[0]) + 1;
                if (days[dateMonth - 1] < dateDay) {
                    dateDay = days[dateMonth - 1];
                }

                return dateYear + '-' + dateMonth + '-' + dateDay;
            },
        },
        mounted() {
            let self = this;
            this.$http.post('/api/record/getDate', {}, {}).then((res) => {
                self.currentDate = res.data[0].date;
            });
            this.listTask();
        },
    }
</script>

<style scoped>

</style>

