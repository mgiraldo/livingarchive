<template>
  <section>
    <search-filter-title
      :click-handler="toggle"
      :controls="'facet_' + facet.name + '_toggle'"
      :open="open"
      :text="facet.name"
    />
    <div :id="'facet_' + facet.name + '_toggle'">
      <ul v-show="open">
        <li
          v-for="(color, name, index) in presentFacets"
          :key="index"
          class="facet"
        >
          <label :for="`${name}_${index}`">
            <input
              :id="`${name}_${index}`"
              type="checkbox"
              :value="index"
              :checked="inStore(facet.name, name)"
              @change="toggled(facet.name, name, $event.target.checked)"
            />
            <filter-color-item :name="name" :color="color" />
          </label>
          <search-filter-bar :total="total" :value="aggregations[name]" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { updateRouter } from '~/utils/router'

import FilterColorItem from '~/components/FilterColorItem'
import SearchFilterTitle from '~/components/SearchFilterTitle'
import SearchFilterBar from '~/components/SearchFilterBar'

export default {
  components: {
    FilterColorItem,
    SearchFilterBar,
    SearchFilterTitle
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, default: null }
  },
  data() {
    return { open: false }
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    },
    presentFacets() {
      let facets = {}
      let aggs = Object.keys(this.aggregations)
      aggs.forEach(agg => {
        facets[agg] = this.facet.values[agg]
      })
      return facets
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    toggled(filter, name, value) {
      const index = Object.keys(this.facet.values).indexOf(name)
      this.$store.commit('checkedFilter', { filter, index, value })
      updateRouter({ router: this.$router, store: this.$store })
    },
    inStore(filter, name) {
      const index = Object.keys(this.facet.values).indexOf(name)
      return this.$store.state['checked' + filter].has(index)
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
