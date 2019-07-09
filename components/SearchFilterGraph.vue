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
          name: agg.trim(),
          value: this.aggregations[agg],
          sortableName: agg.trim().toLowerCase()
        })
      }
      sorted = sorted.sort((a, b) => (a.sortableName < b.sortableName ? -1 : 1))
      return sorted
    },
    aggregationGraph() {
      let graph = {}
      for (let index in this.sortedAggregations) {
        const agg = this.sortedAggregations[index]
        let node = { ...agg }
        const nodeArray = agg.sortableName.split('.').map(name => name.trim())
        const nameArray = agg.name.split('.').map(name => name.trim())
        node.name = nameArray[0]
        node.sortableName = nodeArray[0]
        if (nodeArray.length > 1)
          node.children = this.parseNode(
            nodeArray.slice(1),
            nameArray.slice(1),
            agg.value
          )
        graph[nodeArray[0]] = node
      }
      return graph
    }
  },
  methods: {
    parseNode(nodeArray, nameArray, value) {
      if (nodeArray.length <= 1) {
        return {
          [nameArray[0]]: {
            name: nameArray[0],
            value: value,
            sortableName: nodeArray[0]
          }
        }
      }
      const sortableName = nodeArray.splice(0, 1)[0]
      const name = nameArray.splice(0, 1)[0]
      return {
        [name]: {
          name: name,
          value: value,
          sortableName: sortableName,
          children: this.parseNode(nodeArray, nameArray, value)
        }
      }
    },
    toggle() {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped></style>
