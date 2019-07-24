<template>
  <div class="container" @mouseup="resizeUp" @mousemove="resizeMove">
    <search-controls />
    <skeleton-pane />
    <div ref="splitPane" class="splitview">
      <results-list
        :key="$route.fullPath"
        ref="resultsPane"
        @click="showClick"
      />
      <div class="resizer" @mousedown="resizeDown">⋮</div>
      <results-map ref="mapPane" />
    </div>
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
    this.checkResizer()
  },
  methods: {
    showClick(who) {
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
        left.$refs.pane.style.flexBasis = pct + '%'
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
