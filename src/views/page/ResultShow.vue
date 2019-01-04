<template>
    <div id="wrap">
        <div class="chart-show" style="margin-left: 20px">
                <div class="chart-item" v-for="item in source">
                    <div class="chart-item-title" v-cloak>{{ item.name }}</div>
                    <schart :canvasId="item.canvasId" :type="item.canvasId" :data="item.data"
                            width="800" height="600" :options="item.options"></schart>
                </div>
        </div>
        <schart :canvasId="canvasId" :type="type" :width="width"
    :height="height" :data="data" :options="options"></schart>
    </div>

</template>

<script>
    import Schart from "vue-schart";
    export default {
        name: "ResultShow",
        data(){
            return{
                canvasId: 'myCanvas',
                type: 'ring',
                width: 800,
                height: 600,
                data: [],
                options: {
                    bgColor: '#FFFFFF',            // 默认背景颜色
                    title: '环状图显示',// 图表标题
                    titleColor: '#000000',         // 图表标题颜色
                    legendColor: '#000000',         // 图例文本颜色
                    legendTop: 40,               // 图例距离顶部的长度
                    colorList: ["#1E9FFF", "#13CE66", "#F7BA2A", "#FF4949", "#72f6ff","#1585e6","#189c1d"],   // 环形图颜色列表
                    radius: 150,                     // 环形图外圆半径
                    innerRadius: 90            // 环形图内圆半径

                },
                source: [{
                    canvasId: "bar",
                    name: "分析结果",
                    data: [{
                        name: '',
                        value: 0,
                    }],
                    options: {
                        title: "数据绑定后结果",
                        bgColor: "#fff",
                        titleColor: "#000000",
                        contentColor: "#fff",
                        axisColor: "#000000",
                        fillColor: "#cc0632",
                        autoWidth: true
                    }
                }],
            }
        },
        methods:{
            color16(){
			    var r = Math.floor(Math.random()*256);
			    var g = Math.floor(Math.random()*256);
			    var b = Math.floor(Math.random()*256);
			    var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
			    return color;
		    },
            showInCharts(){
                let temp=[];
                this.source[0].data=[];
                this.data=[];
                this.options.colorList=[];
                temp=this.$route.query.name;

                for(let i=0;i<temp.length;i++)
                {
                    this.source[0].data.push({
                        name:temp[i].name,
                        value:parseFloat(temp[i].value)
                    })
                    this.data.push({
                        name:temp[i].name,
                        value:parseFloat(temp[i].value)
                    })
                    this.options.colorList.push(this.color16());
                }


            }
        },
        components:{
            Schart
        },
       mounted() {
            this.showInCharts();
       }

    }
</script>

<style   type="text/css" scoped>
    #wrap {
        display: flex;
    }

</style>
