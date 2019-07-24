<template>
  <section ref="resultsPane" class="results" @scroll="handleScroll">
    <result-count />
    <results-explained />
    <p>
      <button class="link-button" @click="toggleMap">
        View map
      </button>
    </p>
    <div ref="grid" class="results-list">
      <grid-view-item
        v-for="(individual, index) in individuals"
        :key="index + '_' + individual.identifier"
        :individual="individual"
        :expanded="selectedIndividual === individual"
        :row="selectedIndividual === individual ? row : null"
        @click="gridItemClick"
      ></grid-view-item>
      <div
        v-if="selectedGridItem"
        ref="expansion"
        class="expansion"
        :style="row ? `grid-row-start:` + row : ''"
      >
        <individual-info :individual="selectedGridItem.individual" />
      </div>
    </div>
  </section>
</template>

<script>
import { updateRouter } from '~/utils/router'
import { PAGE_SIZE } from '~/utils/constants'

import GridViewItem from '~/components/GridViewItem'
import ResultCount from '~/components/ResultCount'
import ResultsExplained from '~/components/ResultsExplained'
import IndividualInfo from '~/components/IndividualInfo'

export default {
  components: {
    GridViewItem,
    ResultCount,
    ResultsExplained,
    IndividualInfo
  },
  data() {
    return {
      selectedGridItem: null,
      page: 0,
      pageSize: PAGE_SIZE * 5, // because many squares fit in grid
      rowNumber: 0,
      individuals: []
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.$store.getters.displayedCount / this.pageSize)
    },
    selectedIndividual() {
      return this.selectedGridItem ? this.selectedGridItem.individual : null
    },
    row() {
      return this.rowNumber
    }
  },
  mounted() {
    this.getNextPage()
    this.setRow()
    window.addEventListener('resize', this.setRow)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setRow)
  },
  methods: {
    handleScroll(e) {
      let bottomOfWindow =
        e.target.scrollTop + window.innerHeight === e.target.scrollHeight

      if (bottomOfWindow) {
        this.getNextPage()
      }
    },
    getNextPage() {
      if (this.page + 1 > this.totalPages) return
      const individualArray = Object.values(
        this.$store.getters.displayedIndividuals
      )
      const start = this.page * this.pageSize
      for (let i = start; i < start + this.pageSize; i++) {
        let individual = individualArray[i]
        if (!individual) break
        this.individuals.push(individual)
      }
      this.page++
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
    },
    toggleMap() {
      this.$store.commit('toggleViewMode', 'map')
      updateRouter({ router: this.$router, store: this.$store })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.expansion {
  color: $global-text-color;
  display: flex;
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: -1;
  grid-row-start: 1;
  padding: 1rem 0.5rem;
}
</style>
