<template>
   <div>
       <div class="chart-show">
        	<div class="chart-item" v-for="item in source">
        		<div class="chart-item-title" v-cloak>{{ item.name }}</div>
        		<schart :canvasId="item.canvasId" :type="item.canvasId" :data="item.data" width="600" height="600" :options="item.options"></schart>
        	</div>
        </div>
   </div>
</template>

<script>
    import Schart from "vue-schart";
	export default {
		data () {
			return {
				source:[{
				    canvasId:"line",
		            name:"折线图",
		            data:[
			            {
				            name:"坚果",
				            value:"7890"
			            },{
				            name:"果铺",
				            value:"5490"
			            },{
				            name:"特产",
				            value:"5509"
			            },{
				            name:"早餐",
				            value:"1231"
                        },{
				            name:"进口食品",
				            value:"231"
			            },{
				            name:"年货",
				            value:"9800"
			            },{
				            name:"其它",
				            value:"2311"
			            }
                    ],
                    options:{
			            title:"**商城商品品类销量汇总",
			            bgColor:"#009688",
			            titleColor:"#fff",
			            contentColor:"#cc0632",
			            axisColor:"#FFF",
			            fillColor:"#d9f501"
		            }
                }]
			}
		},
		components:{
			Schart
		},

	}
</script>
