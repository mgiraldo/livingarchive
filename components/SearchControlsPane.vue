<template>
  <form
    ref="pane"
    :class="'controls-wrapper collapsible ' + (collapsed ? 'collapsed' : '')"
    @scroll="handleScroll"
  >
    <h1 v-show="collapsed">Search filters</h1>
    <square-button
      ref="button"
      :label="collapsed ? 'Open' : 'Close'"
      :icon="collapsed ? '+' : '×'"
      @click="collapseClick"
    />
    <div v-show="!collapsed" class="controls">
      <transition name="button-slide-fade">
        <button
          v-show="filtered()"
          class="filter-button"
          type="button"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </transition>
      <search-filter-standard
        class="filter"
        :aggregations="aggs('b')"
        :facet="bones"
      />
      <search-filter-standard
        class="filter"
        :aggregations="sortedAggs('s')"
        :facet="sexes"
      />
      <search-filter-standard
        class="filter"
        :aggregations="sortedAggs('a')"
        :facet="ages"
      />
      <search-filter-range
        class="filter"
        :aggregations="aggs('l')"
        :facet="levels"
      />
      <search-filter-standard
        class="filter"
        :aggregations="aggs('p')"
        :facet="phases"
      />
    </div>
  </form>
</template>

<script>
import { updateRouter } from '~/utils/router'
import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'

import SearchFilterStandard from '~/components/SearchFilterStandard'
import SearchFilterRange from '~/components/SearchFilterRange'
import SquareButton from '~/components/SquareButton'

export default {
  components: {
    SquareButton,
    SearchFilterStandard,
    SearchFilterRange
  },
  data() {
    return {
      collapsed: false,
      ages: FILTER_PARAMS_TO_NAMES.a,
      sexes: FILTER_PARAMS_TO_NAMES.s,
      levels: FILTER_PARAMS_TO_NAMES.l,
      bones: FILTER_PARAMS_TO_NAMES.b,
      phases: FILTER_PARAMS_TO_NAMES.p
    }
  },
  computed: {},
  methods: {
    aggs(param) {
      // default elasticsearch sorting order (usually result count)
      const type = FILTER_PARAMS_TO_NAMES[param].agg
      let aggs = this.$store.state.aggs[type]
      return aggs
    },
    sortedAggs(param) {
      // age and sex are sorted as presented in constants.js
      const type = FILTER_PARAMS_TO_NAMES[param].agg
      let aggs = this.$store.state.aggs[type]
      const colorKeys = Object.keys(FILTER_PARAMS_TO_NAMES[param].colors)
      const present = Object.keys(aggs)
      const sorted = colorKeys.filter(agg => present.indexOf(agg) !== -1)
      let sortedAggs = {}
      sorted.forEach(key => {
        sortedAggs[key] = aggs[key]
      })
      return sortedAggs
    },
    filtered() {
      return this.$store.state.filtered
    },
    clearFilters() {
      this.$store.commit('clearFilters')
      updateRouter({ router: this.$router, store: this.$store })
    },
    handleScroll() {
      this.positionButton()
    },
    positionButton() {
      if (this.collapsed) this.$refs.pane.scrollTop = 0
      this.$refs.button.$el.style.top = this.$refs.pane.scrollTop + 'px'
    },
    collapseClick(e) {
      e.preventDefault()
      this.collapsed = !this.collapsed
      this.positionButton()
      this.$refs.pane.ontransitionend = () => {
        this.$emit('collapse', this.collapsed)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.controls-wrapper {
  background-color: lighten($color: $global-background-color, $amount: 5%);
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  overflow-wrap: anywhere;
  padding: 0.5rem;
  position: relative;
  -webkit-overflow-scrolling: touch;

  &.collapsed {
    padding: 0.5rem;
  }
}
.filter-button {
  margin: 0.5rem 0.5rem 1rem;
}
.filter {
  margin-bottom: 1rem;
}
.button-slide-fade-enter-active,
.button-slide-fade-leave-active {
  transition: all 0.3s ease;
}
.button-slide-fade-enter,
.button-slide-fade-leave-to {
  transform: translateY(-2rem);
  opacity: 0;
}
</style>
