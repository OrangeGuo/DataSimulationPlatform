<template>

    <div>
        <div style="height: 50px">
            <el-input style="Float: left;height:50px;width: 500px;" float="left" placeholder="请输入关键字"
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

                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button icon="el-icon-delete" type="danger"
                               size="small"></el-button>
                    <el-button icon="el-icon-edit" type="primary" size="small"
                    ></el-button>
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
                        console.log(self.flag);

                    });

                }).then(() => {
                    if (self.flag === 0) {
                        if (self.tableData.length > 0) {

                            self.current_task = self.tableData[0].id;
                        }
                        self.flag = 1;
                    }
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
