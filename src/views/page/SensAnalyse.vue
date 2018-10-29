<template>
    <div id="diagramContainer">
        <p>hello</p>
        <div id="item_left" class="item">
            <p>left</p>
        </div>
        <div id="item_right" class="item" style="margin-left:50px;">
            <p>right</p>
        </div>
    </div>

</template>

<script>
    export default {
        name: "SensAnalyse",
        methods: {
            test() {
                jsPlumb.connect({
                    source: 'item_left',
                    target: 'item_right',
                    endpoint: 'Dot'
                });

            },
            mounted(){
                this.test();
            }
        }
    }

</script>

<style scoped>
    #diagramContainer {
      padding: 20px;
      width: 80%;
      height: 400px;
      border: 1px solid gray;
    }

    .item {
      position: absolute;
      height: 80px;
      width: 80px;
      border: 1px solid blue;
    }
</style>
