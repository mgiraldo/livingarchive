<template>
  <div>
    <div>
      <span v-if="isFiltered">Filtered by:</span>
      <span
        v-for="(filter, index) in filters"
        :key="index"
        class="filter"
        :style="'background-color: ' + filter.color"
      >
        {{ filter.name }}
      </span>
    </div>
  </div>
</template>

<script>
import { RDF_AGES, RDF_SEXES } from '~/utils/constants'

export default {
  components: {},
  computed: {
    isFiltered() {
      return this.$store.state.filtered
    },
    filters() {
      let filters = []
      const ages = [...this.$store.state.checkedAges.values()]
      ages.forEach(index => {
        filters.push({
          name: Object.keys(RDF_AGES.values)[index],
          color: Object.values(RDF_AGES.values)[index]
        })
      })
      const sexes = [...this.$store.state.checkedSexes.values()]
      sexes.forEach(index => {
        filters.push({
          name: Object.keys(RDF_SEXES.values)[index],
          color: Object.values(RDF_SEXES.values)[index]
        })
      })
      return filters
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  border-radius: 0.125rem;
  color: $global-background-color;
  margin-right: 0.5rem;
  padding: 0 0.25rem;
  white-space: nowrap;
}
</style>
