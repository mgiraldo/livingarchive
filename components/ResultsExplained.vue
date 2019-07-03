<template>
  <div class="explainer">
    <span
      >Showing {{ count }} results {{ isFiltered ? 'filtered by:' : '' }}</span
    >
    <label
      v-for="(filter, index) in filters"
      :key="index"
      :for="'filter-' + index"
      class="filter"
      :style="'background-color: ' + filter.color"
    >
      <input
        :id="'filter-' + index"
        class="checkbox"
        type="checkbox"
        checked="checked"
        @change="
          toggled(
            filter.index,
            filter.filter,
            filter.name,
            $event.target.checked
          )
        "
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
import { RDF_SEXES, RDF_AGES, RDF_LEVELS, RDF_PHASES } from '~/utils/constants'

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
      const ages = [...this.$store.state.checkedAges.values()]
      ages.forEach(index => {
        filters.push({
          index: index,
          filter: 'Ages',
          type: 'Age',
          name: Object.keys(RDF_AGES.values)[index],
          color: Object.values(RDF_AGES.values)[index]
        })
      })
      const sexes = [...this.$store.state.checkedSexes.values()]
      sexes.forEach(index => {
        filters.push({
          index: index,
          filter: 'Sexes',
          type: 'Sex',
          name: Object.keys(RDF_SEXES.values)[index],
          color: Object.values(RDF_SEXES.values)[index]
        })
      })
      return filters
    }
  },
  methods: {
    toggled(index, filter, name, value) {
      this.$store.commit('checkedFilter', { filter, index, value })
      updateRouter({ router: this.$router, store: this.$store })
    }
  }
}
</script>

<style lang="scss" scoped>
.explainer {
  margin-bottom: 0.5rem;
}
.filter {
  border: 0.1rem solid transparent;
  border-radius: 0.125rem;
  color: $global-background-color;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.5rem;
  padding: 0 0.25rem;
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
