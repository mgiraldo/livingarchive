<template>
  <section>
    <search-filter-title
      :click-handler="toggle"
      :controls="'facet_' + facet.name + '_toggle'"
      :open="open"
      :text="facet.name"
    />
    <div :id="'facet_' + facet.name + '_toggle'">
      <search-filter-list
        :open="open"
        :facet="facet"
        :aggregations="aggregations"
      />
    </div>
  </section>
</template>

<script>
import SearchFilterTitle from '~/components/SearchFilterTitle'
import SearchFilterList from '~/components/SearchFilterList'

export default {
  components: {
    SearchFilterTitle,
    SearchFilterList
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, required: true }
  },
  data() {
    return { open: false }
  },
  computed: {
    sortedAggregations() {
      let sorted = []
      for (let agg in this.aggregations) {
        sorted.push({
          name: agg,
          value: this.aggregations[agg],
          sortableName: agg.toLowerCase()
        })
      }
      sorted = sorted.sort((a, b) => (a.sortableName < b.sortableName ? -1 : 1))
      return sorted
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
