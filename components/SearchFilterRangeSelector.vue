<template>
  <div v-show="open">
    <p class="explainer">Click and drag to select</p>
    <ul @mouseover="cancelHandler">
      <li
        v-for="(agg, index) in sortedAggregations"
        :ref="agg.name"
        :key="index"
        class="facet"
        :data-name="agg.name"
        @mouseover="mouseoverHandler"
        @mouseup="mouseupHandler"
        @mousedown="mousedownHandler"
      >
        <span class="label not-interactive">{{ agg.name }}</span>
        <search-filter-bar
          :class="'not-interactive range ' + hasSelectedClasses(agg.name)"
          :total="total"
          :value="agg.value"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import SearchFilterBar from '~/components/SearchFilterBar'

export default {
  components: {
    SearchFilterBar
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, default: null },
    open: { type: Boolean, required: true },
    from: { type: String, default: '' },
    to: { type: String, default: '' },
    onChange: { type: Function, default: null }
  },
  data() {
    return {
      selecting: false,
      fromAgg: this.from,
      toAgg: this.to
    }
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    },
    sortedAggregations() {
      const allValues = Object.values(this.facet.rangeList)
      const aggs = Object.keys(this.aggregations)
      let sorted = []
      allValues.forEach(value => {
        if (aggs.indexOf(value) !== -1) {
          sorted.push({ name: value, value: this.aggregations[value] })
        }
      })
      return sorted
    },
    sortedIndexes() {
      return this.sortedAggregations.map(agg => agg.name)
    },
    indexFrom() {
      if (this.fromAgg === '') return -1
      let index = this.sortedIndexes.indexOf(this.fromAgg)
      if (index === -1) return 0 // the from value is out of bounds of the visible facets
      return index
    },
    indexTo() {
      if (this.toAgg === '') return -1
      let index = this.sortedIndexes.indexOf(this.toAgg)
      if (index === -1) return this.sortedIndexes.length - 1 // the to value is out of bounds of the visible facets
      return index
    },
    range() {
      return [this.indexFrom, this.indexTo]
    },
    selectedNames() {
      return this.sortedAggregations
        .filter(
          (agg, index) => index <= this.indexTo && index >= this.indexFrom
        )
        .map(element => element.name)
    }
  },
  methods: {
    hasSelectedClasses(name) {
      if (this.indexFrom === -1) return ''
      const nameIndex = this.sortedIndexes.indexOf(name)
      const classNames = []
      let from = this.indexFrom
      let to = this.indexTo
      if (from > to) {
        from = this.indexTo
        to = this.indexFrom
      }
      if (from === nameIndex) classNames.push('start')
      if (to === nameIndex) classNames.push('end')
      if (to > nameIndex && from < nameIndex) classNames.push('middle')
      return classNames.join(' ')
    },
    isFromTo(name) {
      return this.fromAgg === name || this.toAgg === name
    },
    clearSelection() {
      this.fromAgg = ''
      this.toAgg = ''
    },
    checkFromTo() {
      if (this.indexFrom > this.indexTo) {
        const temp = this.fromAgg
        this.fromAgg = this.toAgg
        this.toAgg = temp
      }
    },
    stopSelection() {
      this.selecting = false
      this.checkFromTo()
      if (this.onChange) this.onChange(this)
    },
    mouseoverHandler(e) {
      e.stopPropagation()
      if (this.selecting) {
        this.toAgg = e.target.dataset.name
      }
    },
    mousedownHandler(e) {
      e.stopPropagation()
      const name = e.target.dataset.name
      this.clearSelection()
      this.selecting = true
      this.fromAgg = name
      this.toAgg = name
    },
    mouseupHandler(e) {
      e.stopPropagation()
      if (this.selecting) {
        this.toAgg = e.target.dataset.name
        this.stopSelection()
      }
    },
    cancelHandler(e) {
      e.stopPropagation()
      if (this.selecting) {
        this.stopSelection()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.explainer {
  margin-left: 0.25rem;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0.25rem;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.facet {
  cursor: pointer;
  margin-bottom: 0;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
}
.range {
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
}
.start,
.middle,
.end {
  border-left: 1px solid $global-alert-color;
  border-right: 1px solid $global-alert-color;
}
.start {
  border-top: 1px solid $global-alert-color;
}
.end {
  border-bottom: 1px solid $global-alert-color;
}
.label {
  position: absolute;
  right: 0.25rem;
  top: 0.25rem;
}
input {
  margin-right: 0.5rem;
}
</style>
