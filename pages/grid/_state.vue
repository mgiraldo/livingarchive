<template>
  <div class="container">
    <search-controls-pane />
    <grid-results-list :key="$route.fullPath" />
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import GridResultsList from '~/components/GridResultsList'
import SearchControlsPane from '~/components/SearchControlsPane'

export default {
  scrollToTop: true,
  head() {
    return { title: 'Grid - Living Archive' }
  },
  key: '_grid',
  components: {
    GridResultsList,
    SearchControlsPane
  },
  fetch: async function({ store, params }) {
    // console.log('fetch')
    if (params.state) {
      // console.log('ssr map.fetch', params)
      let parsedParams = parseParams(params)
      store.commit('setFilters', { params: parsedParams })
    }
    await store.dispatch('fetchIndividuals')
  },
  mounted() {
    this.$store.commit('toggleViewMode', 'grid')
  }
}
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
.container {
  display: flex;
  height: 100vh;

  @media all and (orientation: portrait) {
    flex-direction: column;
  }
}
</style>
