<template>

    <div>
        <div style="height: 50px">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{dropItem}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="一周以上">一周以上</el-dropdown-item>
                    <el-dropdown-item command="已逾期">已逾期</el-dropdown-item>
                    <el-dropdown-item command="一周内">一周内</el-dropdown-item>
                    <el-dropdown-item command="全部">全部</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-input style="Float: left;height:50px;width: 500px;" float="left" v-model="keyWord"
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
                    <span style="margin-left: 10px">{{ scope.row.writer }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="deadline"
                label="归还日期"
                width="300">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.deadline }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-tooltip content="归还" placement="top">
                        <el-button icon="el-icon-minus" @click="returnBook(scope.$index)" type="primary"
                                   size="medium"></el-button>
                    </el-tooltip>
                    <el-tooltip content="续借" placement="top">
                        <el-button icon="el-icon-plus" @click="renewBook(scope.$index)" type="primary"
                                   size="medium"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "TaskManage",
        data() {
            return {
                dropItem: "全部",
                keyWord: "",
                currentDate: "",
                tableData: [],
                allData: [],
                allBooks: [],
                bookList: []
            }
        },
        methods: {
            handleCommand(command) {
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
            },
            listTask() {
                const self = this;
                self.$axios.post('/api/record/listRecord', {userid: localStorage.getItem("user-id")}, {}).then((res) => {
                    self.bookList = [];
                    res.data.some(item => {
                        self.bookList.push({
                            bookId: item.bookid,
                            borrowDate: item.borrowDate,
                            renew: item.renew
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
                                    renew: self.bookList[i].renew,
                                    deadline: self.getDate(self.bookList[i].borrowDate, self.bookList[i].renew),
                                    leftDays: self.getDays(self.bookList[i].borrowDate, self.bookList[i].renew) - self.getDays(self.currentDate, -1)
                                });
                                break;
                            }
                        }
                    }
                    self.allData = self.tableData;
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
                let self = this;
                this.$http.post('/api/record/deleteRecord', {
                    userid: parseInt(localStorage.getItem('user-id')),
                    bookid: parseInt(self.tableData[index].bookId)
                }, {});
                this.tableData.slice(index, 1);
                let bookNum = parseInt(localStorage.getItem("books-num"));
                self.$http.post('/api/user/updateBooksNum', {
                    booksnum: bookNum + 1,
                    userid: parseInt(localStorage.getItem("user-id"))
                }, {});
                localStorage.setItem('books-num', bookNum + 1);
                let temp = parseInt(self.tableData[index].resbooks) + 1;
                self.$http.post('/api/books/updateBook', {
                    resbooks: temp,
                    allbooks: parseInt(self.tableData[index].allbooks),
                    bookId: parseInt(self.tableData[index].bookId)
                }, {});
                self.tableData[index].resbooks = temp;
                this.listTask();
            },
            renewBook(index) {
                if (this.tableData[index].renew === 3) {
                    this.$message.warning("已达最大续借次数");
                    return;
                }
                let self = this;
                this.$http.post('/api/record/updateRecord', {
                    userid: parseInt(localStorage.getItem('user-id')),
                    bookid: parseInt(self.tableData[index].bookId),
                    renew: self.tableData[index].renew + 1
                }, {});
                this.tableData[index].renew++;
                this.tableData[index].deadline = this.getDate(this.tableData[index].borrowDate, this.tableData[index].renew);
                this.tableData[index].leftDays =this.getDays(this.tableData[index].borrowDate,this.tableData[index].renew)-this.getDays(this.currentDate,-1);
            },
            getBooks() {
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
                            bookkind: item.bookkind
                        })
                    });
                });
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
            this.getBooks();
            this.listTask();
        },
    }
</script>

<style scoped>

</style>

