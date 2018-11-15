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
            <el-input style="Float: left;height:50px;width: 500px;" float="left" placeholder="请输入书名、作者"
                      clearable></el-input>
            <el-button style="Float: left;height:40px;" type="primary" @click="" icon="el-icon-search">搜索
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
                    <el-tooltip content="可借阅" placement="top">
                        <el-button icon="el-icon-plus" type="primary" size="medium"></el-button>
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
                filterText: "",
                prop: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
                tableData: []
            }
        },
        methods: {
            handleCommand(command) {
                this.dropItem=command;
                this.$message('调整类别为' + command);
            },
            listTask() {
                const self = this;
                self.$axios.post('/api/books/listBook').then((res) => {
                    self.tableData = [];
                    res.data.some(item => {
                        self.tableData.push({
                            name: item.bookname,
                            writer: item.writer,
                            resbooks: item.resbooks,
                            findNumber: item.findNumber
                        })
                    });
                });
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
