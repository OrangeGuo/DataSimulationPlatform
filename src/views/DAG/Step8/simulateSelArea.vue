<template>
     <g>
        <foreignObject width="100%" height="100%" style="position: absolute">
        <body xmlns="http://www.w3.org/1999/xhtml" :style="getSimulateSelArea()" id="simulate_sel_area">
        </body>
        </foreignObject>
    </g>
</template>

<script>
export default {
  props: {
    simulate_sel_area: {
      type: Object,
      default: () => {
        return {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
      }
    }
  },
  methods: {
    getSimulateSelArea() {
      const { left, top, width, height } = this.simulate_sel_area;
      return `width: ${width}px; height: ${height}px; left: ${left}px; top: ${top}px; border: 3px dashed blue;position: absolute;`;
    }
  },
  mounted() {
    console.log("1");
  }
};
</script>

<style lang="scss" scoped>

</style>
