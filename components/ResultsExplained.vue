<template>
  <div class="explainer">
    <span class="summary">{{ isFiltered ? 'Filtered by:' : '' }}</span>
    <label
      v-for="(filter, index) in filters"
      :key="index"
      :for="'filter-' + index"
      class="filter"
    >
      <input
        :id="'filter-' + index"
        class="checkbox"
        type="checkbox"
        checked="checked"
        @change="
          filter.queryType === 'keyword' || filter.queryType === 'starts_with'
            ? remove(filter.value, filter.storeName)
            : filter.queryType === 'range'
            ? removeRange(filter.storeName)
            : ''
        "
      />
      {{ filter.explainedName }}: {{ filter.value }}
      <span
        class="remove"
        :aria-label="`Remove ${filter.explainedName} ${filter.value} filter`"
        >×</span
      >
    </label>
    <div class="export">
      Export results as:
      <nuxt-link :to="'/export/csv/' + exportURL" target="_blank" no-prefetch
        >CSV</nuxt-link
      >
      |
      <nuxt-link :to="'/export/json/' + exportURL" target="_blank" no-prefetch
        >JSON</nuxt-link
      >
      |
      <nuxt-link
        :to="'/export/geojson/' + exportURL"
        target="_blank"
        no-prefetch
        >GeoJSON</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { updateRouter } from '~/utils/router'
import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'

export default {
  components: {},
  computed: {
    exportURL() {
      return this.$route.params.state ? this.$route.params.state : ''
    },
    count() {
      return this.$store.getters.displayedCount
    },
    isFiltered() {
      return this.$store.state.filtered
    },
    filters() {
      let filters = []

      for (let param in FILTER_PARAMS_TO_NAMES) {
        const filter = FILTER_PARAMS_TO_NAMES[param]
        const storeName = filter.storeName
        const queryType = filter.queryType
        const explainedName = filter.explainedName
        const filterArray = [...this.$store.state['checked' + storeName]]
        if (filterArray.length === 0) continue
        switch (queryType) {
          case 'keyword':
          case 'starts_with':
            filterArray.forEach(value => {
              filters.push({
                storeName,
                explainedName,
                queryType,
                value
              })
            })
            break
          case 'range': {
            /*
            NOTE:
            Range accepts `filter=from` or `filter=from,to`.
            */
            let from = filterArray[0]
            let to = filterArray[0]
            if (filterArray.length > 1) {
              to = filterArray[1]
            }
            filters.push({
              storeName,
              explainedName,
              queryType,
              value: 'from ' + from + ' to ' + to
            })
            break
          }
        }
      }

      return filters
    }
  },
  methods: {
    remove(name, filter) {
      this.$store.commit('checkedFilter', { filter, name, value: false })
      updateRouter({ router: this.$router, store: this.$store })
    },
    removeRange(filter) {
      this.$store.commit('resetFilter', { filter, value: [] })
      updateRouter({ router: this.$router, store: this.$store })
    }
  }
}
</script>

<style lang="scss" scoped>
.explainer {
  margin-bottom: 0.5rem;
}
.summary {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.filter {
  background-color: $filter-button-color;
  border: 0.1rem solid transparent;
  border-radius: 0.125rem;
  color: $global-text-color;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.1rem 0.25rem;
  white-space: nowrap;

  & .remove {
    font-weight: bold;
  }

  &:hover {
    border-color: $global-alert-color;
  }
}
.checkbox {
  position: absolute;
  right: 100vw;
}
</style>
