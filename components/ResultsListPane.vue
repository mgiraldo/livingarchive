<template>
  <section
    ref="pane"
    :class="'results collapsible ' + (collapsed ? 'collapsed' : '')"
    @scroll="handleScroll"
  >
    <result-count />
    <square-button
      ref="button"
      :label="collapsed ? 'Open' : 'Close'"
      :icon="collapsed ? '+' : '×'"
      @click="collapseClick"
    />
    <div v-show="!collapsed">
      <results-explained />
      <p>
        <button class="link-button" @click="toggleGrid">
          View grid
        </button>
      </p>
      <transition-group name="results-list" tag="ul" class="results-list">
        <li
          is="result-item"
          v-for="(individual, index) in individuals"
          :key="index + '_' + individual.identifier"
          :individual="individual"
          @show="$emit('click', individual)"
        ></li>
      </transition-group>
    </div>
  </section>
</template>

<script>
import { updateRouter } from '~/utils/router'
import { PAGE_SIZE } from '~/utils/constants'

import ResultItem from '~/components/ResultItem'
import ResultsExplained from '~/components/ResultsExplained'
import ResultCount from '~/components/ResultCount'
import SquareButton from '~/components/SquareButton'

export default {
  components: { ResultItem, ResultsExplained, ResultCount, SquareButton },
  data() {
    return { page: 0, pageSize: PAGE_SIZE, individuals: [], collapsed: false }
  },
  computed: {},
  mounted() {
    this.getNextPage()
  },
  updated() {
    this.$refs.pane.scrollTop
  },
  methods: {
    totalPages() {
      return Math.ceil(this.$store.getters.displayedCount / this.pageSize)
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
    handleScroll(e) {
      let bottomOfWindow =
        e.target.scrollTop + window.innerHeight === e.target.scrollHeight

      if (bottomOfWindow) {
        this.getNextPage()
      }
      this.positionButton()
    },
    positionButton() {
      if (this.collapsed) this.$refs.pane.scrollTo(0, 0)
      this.$refs.button.$el.style.top = this.$refs.pane.scrollTop + 'px'
    },
    collapseClick() {
      this.collapsed = !this.collapsed
      this.positionButton()
      this.$refs.pane.ontransitionend = () => {
        this.$emit('collapse', this.collapsed)
      }
    },
    toggleGrid() {
      this.$store.commit('toggleViewMode', 'grid')
      updateRouter({ router: this.$router, store: this.$store })
    }
  }
}
</script>

<style lang="scss" scoped>
.results {
  background-color: lighten($global-background-color, 3%);
  overflow-y: auto;
  padding: 0.5rem;
  -webkit-overflow-scrolling: touch;
}
.results-list {
  list-style-type: none;
  margin: 0.5rem 0 5rem 0;
  min-width: 20rem;
  padding: 0;
}
</style>
