<template>
  <ul v-show="open" @mouseover="cancelHandler">
    <li
      v-for="(agg, index) in sortedAggregations"
      :ref="agg.name"
      :key="index"
      :class="'facet ' + selectedType(agg.name)"
      :data-name="agg.name"
      @mouseover="mouseoverHandler"
      @mouseup="mouseupHandler"
      @mousedown="mousedownHandler"
    >
      <span
        :class="
          'label not-interactive ' + (isFromTo(agg.name) ? 'displayed' : '')
        "
        >{{ agg.name }}: {{ agg.value }}</span
      >
      <search-filter-bar
        class="not-interactive"
        :total="total"
        :value="agg.value"
        :show-text="false"
      />
    </li>
  </ul>
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
      selectedItems: [],
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
      let sorted = []
      for (let agg in this.aggregations) {
        sorted.push({ name: agg, value: this.aggregations[agg] })
      }
      sorted = sorted.sort((a, b) => (a.name > b.name ? -1 : 1))
      return sorted
    },
    sortedIndexes() {
      return this.sortedAggregations.map(agg => agg.name)
    },
    indexFrom() {
      return this.sortedIndexes.indexOf(this.fromAgg)
    },
    indexTo() {
      return this.sortedIndexes.indexOf(this.toAgg)
    }
  },
  methods: {
    selectedType(name) {
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
      if (this.fromIndex > this.toIndex) {
        const temp = this.fromAgg
        this.fromAgg = this.toAgg
        this.toAgg = temp
      }
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
        this.selecting = false
        this.checkFromTo()
        if (this.onChange) this.onChange(this)
      }
    },
    cancelHandler(e) {
      e.stopPropagation()
      this.selecting = false
      this.checkFromTo()
      if (this.onChange) this.onChange(this)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  margin-bottom: 0;
  position: relative;

  &.start,
  &.middle,
  &.end {
    border-left: 1px solid $global-alert-color;
    border-right: 1px solid $global-alert-color;
  }
  &.start {
    border-top: 1px solid $global-alert-color;
  }
  &.end {
    border-bottom: 1px solid $global-alert-color;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover .label {
    display: block;
  }
}
.label {
  display: none;
  right: 0.25rem;
  position: absolute;

  &.displayed {
    display: block;
  }
}
input {
  margin-right: 0.5rem;
}
</style>
