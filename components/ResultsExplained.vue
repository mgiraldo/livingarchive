<template>
  <div class="explainer">
    <span class="summary"
      >Showing {{ count }} results {{ isFiltered ? 'filtered by:' : '' }}</span
    >
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
        @change="toggled(filter.name, filter.filter, $event.target.checked)"
      />
      {{ filter.type }}: {{ filter.name }}
      <span
        class="remove"
        :aria-label="`Remove ${filter.type} ${filter.name} filter`"
        >×</span
      >
    </label>
  </div>
</template>

<script>
import { updateRouter } from '~/utils/router'
import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'

export default {
  components: {},
  computed: {
    count() {
      return this.$store.getters.displayedCount
    },
    isFiltered() {
      return this.$store.state.filtered
    },
    filters() {
      let filters = []

      for (let param in FILTER_PARAMS_TO_NAMES) {
        const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
        const explainedName = FILTER_PARAMS_TO_NAMES[param].explainedName
        const filterArray = [
          ...this.$store.state['checked' + storeName].values()
        ]
        filterArray.forEach(filter => {
          filters.push({
            filter: storeName,
            type: explainedName,
            name: filter
          })
        })
      }

      return filters
    }
  },
  methods: {
    toggled(name, filter, value) {
      this.$store.commit('checkedFilter', { filter, name, value })
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
