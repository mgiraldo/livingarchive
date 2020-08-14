<template>
  <ul v-show="open">
    <li
      is="search-filter-checkbox-bar"
      v-for="(value, name, index) in aggregations"
      :key="index + '_' + name"
      :name="name"
      :color="facetColor(name)"
      :value="value"
      :total="total"
      :checked="inStore(facet.name, name)"
      @change="toggled(facet.name, name, $event)"
    ></li>
  </ul>
</template>

<script>
import { updateRouter } from '~/utils/router'

import SearchFilterCheckboxBar from '~/components/SearchFilterCheckboxBar'

export default {
  components: {
    SearchFilterCheckboxBar,
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, default: null },
    open: { type: Boolean, required: true },
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    },
  },
  methods: {
    toggled(filter, name, value) {
      this.$store.commit('checkedFilter', { filter, name, value })
      updateRouter({ router: this.$router, store: this.$store })
    },
    facetColor(name) {
      // we assume facet has colors or else just null
      if (!this.facet.colors) return null
      const nullColor = '#aaa'
      const index = Object.keys(this.facet.colors).indexOf(name)
      // has colors but not present so default color #aaa
      if (index === -1) return nullColor
      const color = Object.values(this.facet.colors)[index]
      return color ? color : nullColor
    },
    inStore(filter, name) {
      return this.$store.getters.filterIsChecked({ filter, name })
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0.25rem;
}
.facet {
  @include custom-checkbox;

  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
