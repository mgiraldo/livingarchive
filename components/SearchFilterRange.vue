<template>
  <section>
    <search-filter-title
      :click-handler="toggle"
      :controls="'facet_' + facet.name + '_toggle'"
      :open="open"
      :text="facet.name"
    />
    <div :id="'facet_' + facet.name + '_toggle'">
      <search-filter-range-selector
        :key="$route.fullPath"
        :open="open"
        :facet="facet"
        :aggregations="aggregations"
        :on-change="handleChange"
      />
    </div>
  </section>
</template>

<script>
import { updateRouter } from '~/utils/router'

import SearchFilterTitle from '~/components/SearchFilterTitle'
import SearchFilterRangeSelector from '~/components/SearchFilterRangeSelector'

export default {
  components: {
    SearchFilterTitle,
    SearchFilterRangeSelector
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, required: true }
  },
  data() {
    return { open: false }
  },
  computed: {},
  methods: {
    handleChange(e) {
      const filter = this.facet.name
      const values = e.selectedNames
      this.$store.commit('resetFilter', { filter, values })
      updateRouter({ router: this.$router, store: this.$store })
    },
    toggle() {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped></style>
