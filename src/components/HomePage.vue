<template>
    <div class="page-content" @mousedown="startNodesBus($event)" @mousemove="moveNodesBus($event)"
         @mouseup="endNodesBus($event)">

        <div class="mainContent">
            <div class="nav">
                <div class="nodes_bus">
                    <p>{{taskName}}</p>
                    <el-button style="Float: left;height:40px;width: 120px" type="primary" @click="dragIt('新建节点')" icon="el-icon-plus">新建节点
                    </el-button>
                    <el-button style="Float: left;height:40px;width: 120px" type="primary" @click="loadNodesAndEdges" icon="el-icon-refresh">刷新模型
                    </el-button>
                    <el-button style="Float: left;height:40px;width: 120px" type="primary" @click="save" icon="el-icon-upload">保存修改
                    </el-button>
                </div>
            </div>
            <div class="DAG-content">
                <Step1/>
            </div>
        </div>
        <nodes-bus v-if="dragBus" :value="busValue.value" :pos_x="busValue.pos_x" :pos_y="busValue.pos_y"/>
    </div>
</template>

<script>
    import {tap} from "./DataMainPage.js";
    import Step from "./DAG";
    import NodesBus from "./nodesBus";
    import {mapState, mapActions} from "vuex";

    export default {
        computed: mapState({
            DataAll: state => state.dagStore.DataAll,
        }),
        data() {
            return {
                taskId: 0,
                taskName: "新建任务",
                tap: tap,
                dragBus: false,
                busValue: {
                    value: "name",
                    pos_x: 100,
                    pos_y: 100
                }
            };
        },
        methods: {
            ...mapActions(["addNode"]),
            selStep(i) {
                window.sessionStorage["step"] = i;
                this.tap.forEach((item, n) => {
                    i - n === 0 ? (item.sel = true) : (item.sel = false);
                });
                this.tap = JSON.parse(JSON.stringify(this.tap));
            },
            save() {
                let self = this;
                this.$axios.post('/api/edge/deleteEdges', {taskId: self.taskId}, {}).then((response) => {
                    self.$axios.post('/api/edge/addEdges', this.DataAll.edges, {});
                });
                this.$axios.post('/api/node/deleteNodes', {taskId: self.taskId}, {}).then((response) => {
                    self.$axios.post('/api/node/addNodes', this.DataAll.nodes, {});
                });
            },
            loadNodesAndEdges() {
                let nodes = [];
                this.DataAll.edges = [];
                let self = this;
                this.$axios.post('/api/node/listNodes', {taskId: self.taskId}).then((res) => {
                    res.data.some(item => {
                        nodes.push({
                            name: item.name,
                            id: item.id,
                            parent: item.parent,
                            pos_x: item.pos_x,
                            pos_y: item.pos_y,
                            type: 'constant',
                            in_ports: [0],
                            out_ports: [0],
                            degree: item.degree,
                            taskId: self.taskId
                        })
                    });

                }).then(() => {
                    if (nodes.length > 0)
                        self.DataAll.nodes = nodes;
                    self.DataAll.nodes[0].taskId = self.taskId;
                });
                this.$axios.post('/api/edge/listEdges', {taskId: self.taskId}).then((res) => {
                    res.data.some(item => {
                        this.DataAll.edges.push({
                            dst_node_id: item.dst_node_id,
                            src_node_id: item.src_node_id,
                            dst_input_idx: 0,
                            src_output_idx: 0,
                            id: item.id,
                            taskId: self.taskId
                        })
                    });

                });
            },
            dragIt(val) {
                sessionStorage["dragDes"] = JSON.stringify({
                    drag: true,
                    name: val
                });
            },
            startNodesBus(e) {
                /**
                 *  别的组件调用时, 先放入缓存
                 * dragDes: {
                 *    drag: true,
                 *    name: 组件名称
                 *    type: 组件类型
                 *    model_id: 跟后台交互使用
                 * }
                 **/
                let dragDes = null;
                if (sessionStorage["dragDes"]) {
                    dragDes = JSON.parse(sessionStorage["dragDes"])
                }
                if (dragDes && dragDes.drag) {
                    const x = e.pageX;
                    const y = e.pageY;
                    this.busValue = Object.assign({}, this.busValue, {
                        pos_x: x,
                        pos_y: y - 70,
                        value: dragDes.name
                    });
                    this.dragBus = true;
                }
            },
            moveNodesBus(e) {
                if (this.dragBus) {
                    const x = e.pageX;
                    const y = e.pageY;
                    this.busValue = Object.assign({}, this.busValue, {
                        pos_x: x,
                        pos_y: y - 70
                    });
                }
            },
            endNodesBus(e) {
                let dragDes = null;
                if (sessionStorage["dragDes"]) {
                    dragDes = JSON.parse(sessionStorage["dragDes"])
                }
                if (dragDes && dragDes.drag && e.toElement.id === "svgContent") {
                    const {model_id, type} = dragDes;
                    const pos_x = (e.offsetX - 90) / (sessionStorage['svgScale'] || 1); // 参数修正
                    const pos_y = (e.offsetY - 15) / (sessionStorage['svgScale'] || 1); // 参数修正
                    const params = {
                        model_id: sessionStorage["newGraph"],
                        desp: {
                            type,
                            pos_x,
                            pos_y,
                            name: this.busValue.value
                        }
                    };
                    this.addNode(params);
                }
                window.sessionStorage["dragDes"] = null;
                this.dragBus = false;
                console.log(this.DataAll.nodes);
            }
        },
        mounted() {
            if (window.sessionStorage["step"]) {
                const i = window.sessionStorage.step;
                this.selStep(i);
            }
            sessionStorage['svgScale'] = 1
            this.taskId = localStorage.getItem('task-id');
            if (this.taskId > 0) {
                this.taskName = localStorage.getItem('task-name');
                this.loadNodesAndEdges();
            }
        },
        components: {
            ...Step,
            NodesBus
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-content {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }

    .mainContent {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        text-align: left;
    }

    .mainContent .nav {
        width: 150px;
        background: #242f42;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
    }

    .mainContent .nav div {
        color: #ffffff;
        height: 50px;
        line-height: 50px;
        width: 100%;
        text-align: center;
    }

    .DAG-content {
        position: absolute;
        left: 150px;
        top: 0;
        bottom: 0;
        right: 0;
        overflow: scroll;
    }

    .nodes_bus {
        user-select: none;
        text-align: center;
    }

    .nodes_bus span {
        display: block;
        border: 1px white solid;
        height: 50px;
        width: 200px;
        margin-left: 50%;
        transform: translateX(-50%);
        margin-bottom: 30px;
        cursor: move;
    }
</style>
