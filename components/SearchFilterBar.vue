<template>
  <div :class="'aggregation agg-' + percent">
    {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    total: { type: Number, required: true },
    value: { type: Number, required: true }
  },
  computed: {
    percent() {
      let pct = Math.round((this.value / this.total) * 100)
      return pct < 100 ? pct : 100
    }
  }
}
</script>

<style lang="scss" scoped>
.aggregation {
  display: flex;
  padding-bottom: 0.125rem;
  padding-left: 0.125rem;
}
@for $i from 0 through 100 {
  .agg-#{$i} {
    background: linear-gradient(
        to right,
        $aggregation-bar-color 0%,
        $aggregation-bar-color #{$i + '%'},
        $aggregation-bar-background-color #{$i + '%'},
        $aggregation-bar-background-color
      )
      100%;
  }
}
</style>
