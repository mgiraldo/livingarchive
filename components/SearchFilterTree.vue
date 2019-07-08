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
    aggregationTree() {
      let treeArray = []
      for (let item in this.sortedAggregations) {
        const agg = this.sortedAggregations[item]
        let node = { ...agg }
        const nodeArray = agg.sortableName.split('.')
        const nameArray = agg.name.split('.')
        node.sortableName = nodeArray[0]
        if (nodeArray.length > 1)
          node.children = this.parseNode(
            nodeArray.slice(1),
            nameArray.slice(1),
            agg.value
          )
        treeArray.push(node)
      }
      let finalArray = {}
      treeArray.forEach(element => {
        finalArray[element.sortableName] = { ...element }
        if (element.children) {
          finalArray[element.sortableName].children = this.putChildren(
            {},
            element.children
          )
        }
      })
      return finalArray
    },
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
    putChildren(node, children) {
      children.forEach(element => {
        node[element.sortableName] = { ...element }
        if (element.children) {
          node[element.sortableName].children = this.putChildren(
            {},
            element.children
          )
        }
      })
    },
    parseNode(nodeArray, nameArray, value) {
      const sortableName = nodeArray[0]
      const name = nameArray[0]
      if (nodeArray.length <= 1) {
        return { name: name, value: value, sortableName: sortableName }
      }
      return {
        name: name,
        value: value,
        sortableName: sortableName,
        children: this.parseNode(nodeArray.slice(1), nameArray.slice(1), value)
      }
    },
    toggle() {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped></style>
