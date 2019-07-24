<template>
  <div class="container">
    <search-controls />
    <section ref="resultsPane" class="results">
      <h1>{{ individualCount }} individuals</h1>
      <results-explained />
      <p>
        <button class="link-button" @click="toggleMap">
          View map
        </button>
      </p>
      <div ref="grid" class="results-list">
        <grid-view-item
          v-for="individual in displayedIndividuals"
          :key="individual.identifier"
          :individual="individual"
          :show-click="gridItemClick"
          :expanded="selectedIndividual === individual"
          :row="selectedIndividual === individual ? row : null"
        ></grid-view-item>
      </div>
    </section>
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'
import { updateRouter } from '~/utils/router'

import SearchControls from '~/components/SearchControls'
import GridViewItem from '~/components/GridViewItem'
import ResultsExplained from '~/components/ResultsExplained'

export default {
  head() {
    return { title: 'map' }
  },
  key: '_map',
  components: {
    SearchControls,
    GridViewItem,
    ResultsExplained
  },
  data() {
    return {
      selectedGridItem: null,
      rowNumber: 0
    }
  },
  computed: {
    individualCount() {
      return this.$store.getters.displayedCount
    },
    displayedIndividuals() {
      return this.$store.getters.displayedIndividualsWithBones
    },
    selectedIndividual() {
      return this.selectedGridItem ? this.selectedGridItem.individual : null
    },
    row() {
      return this.rowNumber
    }
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
    this.setRow()
    this.$store.commit('toggleViewMode', 'grid')
    window.addEventListener('resize', this.setRow)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setRow)
  },
  methods: {
    toggleMap() {
      this.$store.commit('toggleViewMode', 'map')
      updateRouter({ router: this.$router, store: this.$store })
    },
    setRow() {
      if (!this.selectedGridItem) return
      let offsets = []
      let el = this.selectedGridItem.$refs.item
      while (el) {
        // ignore the expansion itself
        if (!el.classList.contains('expansion')) offsets.push(el.offsetTop)
        el = el.previousElementSibling
      }
      let rows = offsets.filter(
        (val, idx, array) => val && array.indexOf(val) === idx
      )
      this.rowNumber = rows.length + 1
    },
    showHideExpansion(who) {
      if (who === this.selectedGridItem) {
        // just closing the existing one
        this.selectedGridItem = null
        return
      }
      this.selectedGridItem = who
    },
    gridItemClick(who) {
      this.showHideExpansion(who)
      this.setRow()
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
  flex: 1;
}
.results {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem 0 0 1rem;
  -webkit-overflow-scrolling: touch;

  h1 {
    font-size: 2rem;
  }

  h1,
  p {
    margin-left: 0.2rem;
  }
}
.results-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 10rem);
  grid-gap: 1rem;
  margin: 1rem 0 0 0;
  padding: 0 0 5rem 0;
}
</style>
