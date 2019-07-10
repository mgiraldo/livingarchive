<template>
  <div class="container">
    <search-controls />
    <section class="results">
      <result-count />
      <results-explained />
      <ul class="results-list">
        <li
          is="result-item"
          v-for="individual in displayedIndividuals"
          :key="individual.identifier"
          :individual="individual"
          :show-controls="false"
        ></li>
      </ul>
    </section>
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import SearchControls from '~/components/SearchControls'
import ResultItem from '~/components/ResultItem'
import ResultsExplained from '~/components/ResultsExplained'
import ResultCount from '~/components/ResultCount'

export default {
  head() {
    return { title: 'search' }
  },
  key: '_search',
  components: {
    SearchControls,
    ResultItem,
    ResultsExplained,
    ResultCount
  },
  data() {
    return {}
  },
  computed: {
    individualCount() {
      return this.$store.getters.displayedCount
    },
    displayedIndividuals() {
      return this.$store.getters.displayedIndividuals
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
  methods: {}
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
}
.results {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem;
}
.results-list {
  list-style-type: none;
  margin: 0.5rem 0 5rem 0;
  padding: 0;
}
</style>
