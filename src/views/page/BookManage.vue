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
            <el-button style="Float: left;height:40px;" type="primary" @click="dialogAddForm=true"
                       icon="el-icon-plus">录入图书
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
                prop="resbooks"
                label="图书总数"
                width="150">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.allbooks }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="resbooks"
                label="借出数量"
                width="150">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.allbooks - scope.row.resbooks }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-tooltip content="修改库存" placement="top">
                        <el-button icon="el-icon-edit" type="primary" size="medium"
                                   @click="openEditBook(scope.$index)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="移除图书" placement="top">
                        <el-button icon="el-icon-minus" type="primary" size="medium"
                                   @click="removeBook(scope.$index)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="修改库存" :visible.sync="diagEditForm" width="20%">
            <div align="center">
                <el-input style="width: 150px;"
                    v-model="newBookNum"
                    placeholder="输入新的库存量"
                    clearable
                ></el-input>
            </div>
            <div align="center">
                <el-button @click="diagEditForm = false" style="margin-top: 20px" size="small" >取 消</el-button>
                <el-button type="primary" @click="editBook" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="录入书籍信息" :visible.sync="dialogAddForm" width="30%">
            <div width="30%">
                <el-form :model="form">
                    <el-form-item label="书籍名称" :label-width="formLabelWidth">
                        <el-input v-model="form.bookname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="书籍作者" :label-width="formLabelWidth">
                        <el-input v-model="form.writer" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="索书号" :label-width="formLabelWidth">
                        <el-input v-model="form.findNumber" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="总数量" :label-width="formLabelWidth">
                        <el-input v-model="form.allbooks" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="书籍类别" :label-width="formLabelWidth">
                          <el-checkbox-group v-model="form.checkList">
                                <el-checkbox label="科学"></el-checkbox>
                                <el-checkbox label="自然"></el-checkbox>
                                <el-checkbox label="文化"></el-checkbox>
                          </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <el-button @click="dialogAddForm = false" style="margin-left: 30%;">取 消</el-button>
                <el-button type="primary" @click="addBook">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "BookManage",
        data() {
            return {
                dialogAddForm: false,
                diagEditForm:false,
                newBookNum:"",
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
                    bookId: 0,
                    name: "",
                    writer: "",
                    resbooks: 0,
                    allData: 0,
                    bookkind: "",
                    findNumber: "",

                }],
                allData: [],
                recordInfo: [],
                form: {
                    bookname: 'nihao',
                    writer: 'hiayan',
                    findNumber: 'd112',
                    allbooks: 10,
                    checkList:[],
                }
            }
        },
        methods: {
            listBooks() {
                const self = this;
                self.$axios.post('/api/books/listBook').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        self.tableData.push({
                            bookId: item.bookId,
                            name: item.bookname,
                            writer: item.writer,
                            resbooks: item.resbooks,
                            findNumber: item.findNumber,
                            allbooks: item.allbooks,
                            bookkind: item.bookkind,
                        })
                    });
                }).then(() => {
                    self.allData = self.tableData;

                });
            },
            openEditBook(index) {
                this.diagEditForm=true;
                localStorage.setItem("selectedBook", index);
            },
            editBook(){
                let id=parseInt(localStorage.getItem("selectedBook"));
                const self=this;
                self.$axios.post('/api/books/updateBook', {
                    resbooks: self.tableData[id].resbooks+parseInt(self.newBookNum)-self.tableData[id].allbooks,
                    allbooks: self.newBookNum,
                    bookId: self.tableData[id].bookId,
                }).then(() => {
                    self.diagEditForm=false;
                    self.newBookNum="";
                    this.listBooks();
                });
            },
            removeBook(index) {
                if (this.tableData[index].resbooks < this.tableData[index].allbooks) {
                    this.$message.warning("仍有图书外借，暂时不能移除");
                    return;
                }
                let self = this;
                self.$axios.post('/api/books/deleteBook', {
                    bookId: self.tableData[index].bookId
                }).then(() => {
                    this.listBooks();
                });
            },
            searchBook() {
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
            addBook() {

                for (let i = 0; i < this.allData.length; i++) {
                    if (this.form.bookname === this.allData[i].name && this.form.writer === this.allData[i].writer) {
                        this.$message.warning("书名和作者不能同时相同！");
                        return;
                    }
                    if (this.form.findNumber === this.allData[i].findNumber) {
                        this.$message.warning("索书号已存在！");
                        return;
                    }
                }
                let self = this;
                let temp="";
                for(let i=0;i<self.form.checkList.length;i++)
                    temp=temp+self.form.checkList[i];
                self.$axios.post('/api/books/addBook', {
                    bookId: parseInt(self.allData[self.allData.length - 1].bookId) + 1,
                    bookname: self.form.bookname,
                    writer: self.form.writer,
                    findNumber: self.form.findNumber,
                    resbooks: self.form.allbooks,
                    allbooks: self.form.allbooks,
                    bookkind: temp
                }).then(() => {
                    this.listBooks();
                });
                this.dialogAddForm = false;
            },
            handleCommand(command) {
                this.dropItem = command;
                this.tableData = [];
                if (command !== "全部") {
                    for (let i = 0; i < this.allData.length; i++) {
                        if (this.allData[i].bookkind.indexOf(command) !== -1)
                            this.tableData.push(this.allData[i]);
                    }
                }
                else {
                    this.tableData = this.allData;
                }
                this.$message('调整类别为' + command);
            },
        },
        mounted() {
            this.listBooks();
        }
    }
</script>

<style scoped>

</style>
