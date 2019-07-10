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
        :from="from"
        :to="to"
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
  computed: {
    from() {
      const selected = [...this.$store.state['checked' + this.facet.name]]
      if (selected.size === 0) return ''
      return selected[0]
    },
    to() {
      const selected = [...this.$store.state['checked' + this.facet.name]]
      if (selected.size === 0) return ''
      return selected[selected.length - 1]
    }
  },
  methods: {
    handleChange(e) {
      const filter = this.facet.name
      const values = [e.fromAgg, e.toAgg]
      console.log(values)
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
