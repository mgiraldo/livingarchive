<template>
  <form class="controls">
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
    <search-filter-skeleton
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
  </form>
</template>

<script>
import { updateRouter } from '~/utils/router'
import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'

import SearchFilterStandard from '~/components/SearchFilterStandard'
import SearchFilterSkeleton from '~/components/SearchFilterSkeleton'
import SearchFilterRange from '~/components/SearchFilterRange'
import SearchFilterGraph from '~/components/SearchFilterGraph'

export default {
  components: {
    SearchFilterSkeleton,
    SearchFilterStandard,
    SearchFilterRange,
    SearchFilterGraph
  },
  data() {
    return {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.controls {
  background-color: lighten($color: $global-background-color, $amount: 5%);
  display: flex;
  flex-basis: 20rem;
  flex-direction: column;
  flex-shrink: 0;
  font-size: 0.9rem;
  overflow-wrap: anywhere;
  overflow-y: scroll;
  padding: 0.5rem;
  -webkit-overflow-scrolling: touch;
}
.filter-button {
  border: none;
  background-color: $filter-button-color;
  color: $global-text-color;
  border-radius: 0.25rem;
  border-width: 0.1rem;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 1rem 1rem 1rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: $global-text-color;
    color: lighten($color: $global-background-color, $amount: 20%);
  }
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
