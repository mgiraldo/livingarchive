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
        treeArray.push(node)
      }
      let finalArray = {}
      treeArray.forEach(element => {
        if (finalArray.hasOwnProperty(element.sortableName)) {
          // console.log(
          //   'has',
          //   element.sortableName,
          //   finalArray[element.sortableName],
          //   element.children
          // )
          finalArray[element.sortableName].children = {
            ...this.putChildren(
              finalArray[element.sortableName].children,
              element.children
            )
          }
        } else {
          finalArray[element.sortableName] = { ...element }
        }
      })
      return finalArray
    },
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
    }
  },
  methods: {
    putChildren(node, child) {
      // console.log('node', node, child)
      if (child.children) {
        node = { ...child }
        node.children = { ...this.putChildren(node, child.children) }
      } else {
        return node
      }
    },
    parseNode(nodeArray, nameArray, value) {
      if (nodeArray.length <= 1) {
        return { name: nameArray[0], value: value, sortableName: nodeArray[0] }
      }
      const sortableName = nodeArray.splice(0, 1)[0]
      const name = nameArray.splice(0, 1)[0]
      return {
        name: name,
        value: value,
        sortableName: sortableName,
        children: this.parseNode(nodeArray, nameArray, value)
      }
    },
    toggle() {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped></style>
