<template>
  <div class="container">
    <search-controls-pane @collapse="handleCollapse" />
    <results-list-pane
      :key="$route.fullPath"
      @click="showIndividual"
      @collapse="handleCollapse"
    />
    <skeleton-pane @collapse="handleCollapse" />
    <results-map-pane ref="mapPane" @collapse="handleCollapse" />
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import SearchControlsPane from '~/components/SearchControlsPane'
import SkeletonPane from '~/components/SkeletonPane'
import ResultsListPane from '~/components/ResultsListPane'
import ResultsMapPane from '~/components/ResultsMapPane'

export default {
  scrollToTop: true,
  head() {
    return { title: 'Map - Living Archive' }
  },
  key: '_map',
  components: {
    SearchControlsPane,
    SkeletonPane,
    ResultsListPane,
    ResultsMapPane
  },
  data() {
    return {
      resizing: false,
      splitPaneWidth: 0,
      splitPaneX: 0
    }
  },
  fetch: async function({ store, params }) {
    // console.log('fetch')
    if (params.state) {
      // console.log('ssr map.fetch', params)
      let parsedParams = parseParams(params)
      // console.log(parsedParams)
      store.commit('setFilters', { params: parsedParams })
    }
    await store.dispatch('fetchIndividuals')
  },
  mounted() {
    this.$store.commit('toggleViewMode', 'map')
  },
  methods: {
    handleCollapse() {
      if (this.$refs.mapPane) this.$refs.mapPane.resize()
    },
    showIndividual(who) {
      this.$refs.mapPane.highlightIndividual(who)
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
.container {
  background-color: darken($global-background-color, 6%);
  display: flex;
  height: 100vh;

  @media all and (orientation: portrait) {
    flex-direction: column;
  }
}
</style>
