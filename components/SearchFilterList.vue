<template>
  <ul v-show="open">
    <li v-for="(value, name, index) in aggregations" :key="index" class="facet">
      <label :for="`${name}_${index}`">
        <input
          :id="`${name}_${index}`"
          type="checkbox"
          :value="index"
          :checked="inStore(facet.name, name)"
          @change="toggled(facet.name, name, $event.target.checked)"
        />
        <filter-color-item :name="name" :color="facetColor(name)" />
      </label>
      <search-filter-bar :total="total" :value="value" />
    </li>
  </ul>
</template>

<script>
import { updateRouter } from '~/utils/router'

import FilterColorItem from '~/components/FilterColorItem'
import SearchFilterBar from '~/components/SearchFilterBar'

export default {
  components: {
    FilterColorItem,
    SearchFilterBar
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, default: null },
    open: { type: Boolean, required: true }
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    }
  },
  methods: {
    toggled(filter, name, value) {
      this.$store.commit('checkedFilter', { filter, name, value })
      updateRouter({ router: this.$router, store: this.$store })
    },
    facetColor(name) {
      const nullColor = '#aaa'
      // we assume facet has colors or else just null
      if (!this.facet.values) return null
      const index = Object.keys(this.facet.values).indexOf(name)
      // has colors but not present so default color #aaa
      if (index === -1) return nullColor
      const color = Object.values(this.facet.values)[index]
      return color ? color : nullColor
    },
    inStore(filter, name) {
      return this.$store.getters.filterIsChecked({ filter, name })
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.facet {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}
label {
  cursor: pointer;
  display: flex;
  margin-bottom: 0.25rem;
}
input {
  margin-right: 0.5rem;
}
</style>
