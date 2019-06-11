<template>
  <div class="container" @mouseup="resizeUp" @mousemove="resizeMove">
    <search-controls class="controls" />
    <div ref="splitPane" class="splitview">
      <section ref="resultsPane" class="results">
        <h1>{{ individualCount }} individuals</h1>
        <p>Filtered by: Age: {{ ageFilter }} and Sex: {{ sexFilter }}</p>
        <ul class="results-list">
          <li
            is="result-item"
            v-for="individual in individuals"
            :key="individual.identifier"
            :individual="individual"
            :vars="vars"
            :show-click="showClick"
            :building-click="buildingClick"
          ></li>
        </ul>
      </section>
      <div class="resizer" @mousedown="resizeDown">⋮</div>
      <results-map ref="mapPane" :individuals="individuals" />
    </div>
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'

import SearchControls from '~/components/SearchControls'
import ResultItem from '~/components/ResultItem'
import ResultsMap from '~/components/ResultsMap'

export default {
  head() {
    return { title: 'map' }
  },
  key: '_map',
  components: {
    SearchControls,
    ResultItem,
    ResultsMap
  },
  data() {
    return {
      resizing: false,
      splitPaneWidth: 0,
      splitPaneX: 0,
      ageFilter: [...this.$store.state.checkedAges],
      sexFilter: [...this.$store.state.checkedSexes]
    }
  },
  computed: {
    individualCount() {
      return this.$store.state.individualCount
    },
    vars() {
      return this.$store.state.vars.individuals
    },
    individuals() {
      return this.$store.state.individuals
    }
  },
  beforeRouteUpdate(to, from, next) {
    // console.log('route change', to, from, next)
    next()
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
  created() {},
  mounted() {
    this.checkResizer()
    this.$store.subscribe(mutation => {
      if (
        mutation.type === 'setFilters' ||
        mutation.type === 'clearFilters' ||
        mutation.type === 'checkedFilter' ||
        mutation.type === 'onlyProp'
      ) {
        this.updateFilters()
      }
    })
  },
  methods: {
    showClick(who) {
      this.$refs.mapPane.selectMarker(who)
    },
    buildingClick(who) {
      this.$refs.mapPane.showBuilding(who)
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
      if (this.resizing) {
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
    updateFilters() {
      this.ageFilter = [...this.$store.state.checkedAges]
      this.sexFilter = [...this.$store.state.checkedSexes]
    },
    disableSelect() {
      this.pane.style['-moz-user-select'] = 'none'
      this.pane.style['-webkit-user-select'] = 'none'
      this.pane.style['-ms-user-select'] = 'none'
      this.pane.style.userSelect = 'none'
    },
    enableSelect() {
      this.pane.style['-moz-user-select'] = ''
      this.pane.style['-webkit-user-select'] = ''
      this.pane.style['-ms-user-select'] = ''
      this.pane.style.userSelect = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
}
.controls {
  flex: 0 0 15rem;
  overflow-wrap: anywhere;
  overflow-y: auto;
  width: 15rem;
}
.splitview {
  display: flex;
  flex: 1;
}
.results {
  flex-basis: 50%;
  overflow-y: auto;
  padding: 0.5rem;

  h1 {
    font-size: 2rem;
  }

  h1,
  p {
    margin-left: 0.2rem;
  }
}
.results-list {
  list-style-type: none;
  margin: 0.5rem 0 0 0;
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
