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
        :open="open"
        :facet="facet"
        :aggregations="aggregations"
      />
    </div>
  </section>
</template>

<script>
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
