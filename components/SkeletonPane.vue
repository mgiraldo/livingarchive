<template>
  <div class="skeleton">
    <h1>Bone prevalence</h1>
    <skeleton-aggregations-viewer
      :key="$route.fullPath"
      :aggregations="aggregations"
    />
  </div>
</template>

<script>
import SkeletonAggregationsViewer from '~/components/SkeletonAggregationsViewer'

export default {
  components: {
    SkeletonAggregationsViewer
  },
  computed: {
    aggregations() {
      return this.$store.state.aggs['bones.bone']
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  background-color: lighten($color: $global-background-color, $amount: 3%);
  flex-basis: 20rem;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0.5rem;
}
</style>
