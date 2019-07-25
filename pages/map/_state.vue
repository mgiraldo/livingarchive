<template>
  <div class="container">
    <search-controls />
    <skeleton-pane ref="skeletonPane" @collapse="handleCollapse" />
    <results-list-pane
      :key="$route.fullPath"
      ref="resultsListPane"
      @click="showIndividual"
      @collapse="handleCollapse"
    />
    <results-map-pane ref="mapPane" @collapse="handleCollapse" />
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import SearchControls from '~/components/SearchControls'
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
    SearchControls,
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
.container {
  background-color: darken($global-background-color, 6%);
  display: flex;
  height: 100vh;
}
.splitview {
  display: flex;
  flex-grow: 1;
}
</style>
