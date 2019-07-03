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
    <search-filter
      :aggregations="aggs('bones.bone')"
      :facet="{ name: 'Skeleton' }"
      type="skeleton"
    />
    <search-filter :aggregations="aggs('sex')" :facet="sexes" />
    <search-filter :aggregations="aggs('age')" :facet="ages" />
    <search-filter :aggregations="aggs('level')" :facet="levels" />
    <search-filter :aggregations="aggs('phase')" :facet="phases" />
  </form>
</template>

<script>
import { updateRouter } from '~/utils/router'
import { RDF_SEXES, RDF_AGES, RDF_LEVELS, RDF_PHASES } from '~/utils/constants'

import SearchFilter from '~/components/SearchFilter'

export default {
  components: { SearchFilter },
  data() {
    return {
      ages: RDF_AGES,
      sexes: RDF_SEXES,
      levels: RDF_LEVELS,
      phases: RDF_PHASES
    }
  },
  computed: {},
  methods: {
    aggs(type) {
      return this.$store.state.aggs[type]
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
  font-size: 0.8rem;
  padding: 0.5rem;
}
.filter-button {
  border: none;
  background-color: lighten($color: $global-background-color, $amount: 20%);
  color: $global-text-color;
  border-radius: 0.25rem;
  border-width: 0.1rem;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: $global-text-color;
    color: lighten($color: $global-background-color, $amount: 20%);
  }
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
