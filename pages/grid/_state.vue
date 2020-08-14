<template>
  <div class="container">
    <SearchControlsPane />
    <GridResultsListPane :key="$route.fullPath" />
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import GridResultsListPane from '~/components/GridResultsListPane'
import SearchControlsPane from '~/components/SearchControlsPane'

export default {
  scrollToTop: true,
  head() {
    return { title: 'Grid - Living Archive' }
  },
  key: '_grid',
  components: {
    GridResultsListPane,
    SearchControlsPane,
  },
  fetch: async function ({ store, params }) {
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
  },
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
