<template>
  <ul v-show="open">
    <li
      v-for="(agg, index) in sortedAggregations"
      :ref="agg.name"
      :key="index"
      :class="'facet ' + (isSelected(agg.name) ? selectedType(agg.name) : '')"
      :data-name="agg.name"
      @mouseover="mouseoverHandler"
      @mouseout="mouseoutHandler"
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
import { updateRouter } from '~/utils/router'

import SearchFilterBar from '~/components/SearchFilterBar'

export default {
  components: {
    SearchFilterBar
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, default: null },
    open: { type: Boolean, required: true }
  },
  data() {
    return { selectedItems: [], from: '', to: '', selecting: false }
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
      sorted = sorted.sort((a, b) => a.name - a.name)
      return sorted
    }
  },
  methods: {
    isSelected(name) {
      return this.selectedItems.indexOf(name) !== -1
    },
    selectedType(name) {
      return 'selected'
    },
    isFromTo(name) {
      return this.from === name || this.to === name
    },
    updateSelection(name) {
      const items = this.sortedAggregations.map(agg => agg.name)
      items.forEach(item => {})
      console.log(items)
    },
    mouseoverHandler(e) {
      e.stopPropagation()
      if (this.selecting) {
        this.to = e.target.dataset.name
        this.updateSelection()
      }
    },
    mouseoutHandler(e) {
      e.stopPropagation()
      // console.log('out', e.target.dataset.name)
    },
    mousedownHandler(e) {
      e.stopPropagation()
      this.selecting = true
      this.from = e.target.dataset.name
    },
    mouseupHandler(e) {
      e.stopPropagation()
      this.selecting = false
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.facet {
  margin-bottom: 0;
  position: relative;

  &.selected {
    border: 1px solid $global-alert-color;
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
