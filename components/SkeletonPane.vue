<template>
  <div ref="pane" :class="'collapsible ' + (collapsed ? 'collapsed' : '')">
    <SquareButton
      ref="button"
      :label="collapsed ? 'Open' : 'Close'"
      :icon="collapsed ? '+' : '×'"
      @click="collapseClick"
    />
    <div class="scroller skeleton">
      <h1>Bone prevalence</h1>
      <SkeletonAggregationsViewer
        v-show="!collapsed"
        :key="$route.fullPath"
        :aggregations="aggregations"
        class="skeleton-viewer"
      />
    </div>
  </div>
</template>

<script>
import SkeletonAggregationsViewer from '~/components/SkeletonAggregationsViewer'
import SquareButton from '~/components/SquareButton'

export default {
  components: {
    SkeletonAggregationsViewer,
    SquareButton,
  },
  data() {
    return { collapsed: false }
  },
  computed: {
    aggregations() {
      return this.$store.state.aggs['bones.bone']
    },
  },
  methods: {
    collapseClick() {
      this.collapsed = !this.collapsed
      this.$refs.pane.ontransitionend = () => {
        this.$emit('collapse', this.collapsed)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.skeleton {
  background-color: $global-background-color;
  padding: 0.5rem;
}
</style>
