<template>
  <div
    ref="pane"
    :class="'skeleton collapsible ' + (collapsed ? 'collapsed' : '')"
    @scroll="positionButton"
  >
    <square-button
      ref="button"
      :label="collapsed ? 'Open' : 'Close'"
      :icon="collapsed ? '+' : '×'"
      @click="collapseClick"
    />
    <h1>Bone prevalence</h1>
    <skeleton-aggregations-viewer
      v-show="!collapsed"
      :key="$route.fullPath"
      :aggregations="aggregations"
      class="skeleton-viewer"
    />
  </div>
</template>

<script>
import SkeletonAggregationsViewer from '~/components/SkeletonAggregationsViewer'
import SquareButton from '~/components/SquareButton'

export default {
  components: {
    SkeletonAggregationsViewer,
    SquareButton
  },
  data() {
    return { collapsed: false }
  },
  computed: {
    aggregations() {
      return this.$store.state.aggs['bones.bone']
    }
  },
  methods: {
    positionButton() {
      this.$refs.button.$el.style.top = this.$refs.pane.scrollTop + 'px'
    },
    collapseClick() {
      this.collapsed = !this.collapsed
      if (this.collapsed) this.$refs.pane.scrollTop
      this.$refs.pane.ontransitionend = () => {
        this.$emit('collapse', this.collapsed)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  background-color: lighten($global-background-color, 3%);
  padding: 0.5rem;
  -webkit-overflow-scrolling: touch;
}
</style>
