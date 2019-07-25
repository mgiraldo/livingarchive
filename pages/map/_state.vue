<template>
  <div class="container">
    <search-controls />
    <skeleton-pane
      ref="skeletonPane"
      @collapse="handleCollapse($refs.skeletonPane, $event)"
    />
    <results-list
      :key="$route.fullPath"
      ref="resultsPane"
      @click="showIndividual"
      @collapse="handleCollapse($refs.resultsPane, $event)"
    />
    <results-map
      ref="mapPane"
      @collapse="handleCollapse($refs.mapPane, $event)"
    />
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import SearchControls from '~/components/SearchControls'
import SkeletonPane from '~/components/SkeletonPane'
import ResultsList from '~/components/ResultsList'
import ResultsMap from '~/components/ResultsMap'

export default {
  scrollToTop: true,
  head() {
    return { title: 'Map - Living Archive' }
  },
  key: '_map',
  components: {
    SearchControls,
    SkeletonPane,
    ResultsList,
    ResultsMap
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
    handleCollapse(pane, collapsed) {
      console.log('collapse!')
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
  display: flex;
  height: 100vh;
}
.splitview {
  display: flex;
  flex-grow: 1;
}
</style>
