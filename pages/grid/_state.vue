<template>
  <div class="container">
    <search-controls />
    <grid-results-list :key="$route.fullPath" />
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import GridResultsList from '~/components/GridResultsList'
import SearchControls from '~/components/SearchControls'

export default {
  scrollToTop: true,
  head() {
    return { title: 'grid' }
  },
  key: '_grid',
  components: {
    GridResultsList,
    SearchControls
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
.container {
  display: flex;
  height: 100vh;
}
</style>
