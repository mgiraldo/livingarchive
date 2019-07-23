<template>
  <div class="container" @mouseup="resizeUp" @mousemove="resizeMove">
    <search-controls />
    <skeleton-pane />
    <div ref="splitPane" class="splitview">
      <section ref="resultsPane" class="results">
        <result-count />
        <results-explained />
        <!-- <p>
          <button class="link-button" @click="toggleGrid">
            View grid
          </button>
        </p> -->
        <ul class="results-list">
          <li
            is="result-item"
            v-for="individual in displayedIndividuals"
            :key="individual.identifier"
            :individual="individual"
            @show="showClick"
          ></li>
        </ul>
      </section>
      <div class="resizer" @mousedown="resizeDown">⋮</div>
      <results-map ref="mapPane" />
    </div>
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'
import { updateRouter } from '~/utils/router'

import SearchControls from '~/components/SearchControls'
import SkeletonPane from '~/components/SkeletonPane'
import ResultItem from '~/components/ResultItem'
import ResultsExplained from '~/components/ResultsExplained'
import ResultsMap from '~/components/ResultsMap'
import ResultCount from '~/components/ResultCount'

export default {
  head() {
    return { title: 'map' }
  },
  key: '_map',
  components: {
    SearchControls,
    SkeletonPane,
    ResultItem,
    ResultsExplained,
    ResultsMap,
    ResultCount
  },
  data() {
    return {
      resizing: false,
      splitPaneWidth: 0,
      splitPaneX: 0
    }
  },
  computed: {
    individualCount() {
      return this.$store.getters.displayedCount
    },
    displayedIndividuals() {
      const keys = Object.keys(this.$store.getters.displayedIndividuals)
      const count = keys.length
      if (count <= 100) return this.$store.getters.displayedIndividuals
      let smallSet = {}
      for (let i = 0; i < 100; i++) {
        smallSet[keys[i]] = this.$store.getters.displayedIndividuals[keys[i]]
      }
      return smallSet
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
  created() {},
  mounted() {
    this.checkResizer()
  },
  methods: {
    showClick(who) {
      console.log(who)
      this.$refs.mapPane.highlightIndividual(who)
    },
    checkResizer() {
      this.checkPane = setInterval(() => {
        if (this.$refs.splitPane) {
          clearInterval(this.checkPane)
          this.pane = this.$refs.splitPane
        }
      }, 100)
    },
    resizeDown() {
      this.resizing = true
      this.splitPaneWidth = this.pane.offsetWidth
      this.splitPaneX = this.pane.offsetLeft
      this.disableSelect()
    },
    resizeMove(e) {
      if (this.resizing && this.$refs.resultsPane && this.$refs.mapPane) {
        let left = this.$refs.resultsPane
        let newX = e.clientX
        let pct = ((newX - this.splitPaneX) / this.splitPaneWidth) * 100
        pct = pct > 0 ? pct : 0
        left.style.flexBasis = pct + '%'
        this.$refs.mapPane.resizePane(100 - pct + '%')
      }
      e.preventDefault()
      e.stopPropagation()
    },
    resizeUp() {
      this.resizing = false
      this.enableSelect()
    },
    disableSelect() {
      if (!this.pane) return
      this.pane.style['-moz-user-select'] = 'none'
      this.pane.style['-webkit-user-select'] = 'none'
      this.pane.style['-ms-user-select'] = 'none'
      this.pane.style.userSelect = 'none'
    },
    enableSelect() {
      if (!this.pane) return
      this.pane.style['-moz-user-select'] = ''
      this.pane.style['-webkit-user-select'] = ''
      this.pane.style['-ms-user-select'] = ''
      this.pane.style.userSelect = ''
    },
    toggleGrid() {
      this.$store.commit('toggleViewMode', 'grid')
      updateRouter({ router: this.$router, store: this.$store })
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
.results {
  flex-basis: 50%;
  overflow-x: hidden;
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
.resizer {
  background-color: lighten($global-background-color, 30%);
  cursor: col-resize;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 0.5rem;

  &:before,
  &:after {
    content: '⋮';
  }

  &:hover {
    background-color: lighten($global-background-color, 5%);
  }
}
</style>
