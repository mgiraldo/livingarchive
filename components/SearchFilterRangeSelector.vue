<template>
  <ul v-show="open">
    <li
      v-for="(value, name, index) in aggregations"
      :ref="name"
      :key="index"
      :class="'facet ' + (isSelected(name) ? 'selected' : '')"
      :data-name="name"
      @mouseover="mouseoverHandler"
      @mouseout="mouseoutHandler"
      @mouseup="mouseupHandler"
      @mousedown="mousedownHandler"
    >
      <span
        :class="'label not-interactive ' + (isFromTo(name) ? 'displayed' : '')"
        >{{ name }}: {{ value }}</span
      >
      <search-filter-bar
        class="not-interactive"
        :total="total"
        :value="value"
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
    return { selectedItems: [], from: '', to: '' }
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    }
  },
  methods: {
    isSelected(name) {
      return this.selectedItems.indexOf(name) !== -1
    },
    isFromTo(name) {
      return this.from === name || this.to === name
    },
    mouseoverHandler(e) {
      e.stopPropagation()
      // console.log('over', e.target.dataset.name)
    },
    mouseoutHandler(e) {
      e.stopPropagation()
      // console.log('out', e.target.dataset.name)
    },
    mousedownHandler(e) {
      e.stopPropagation()
      console.log('down', e.target.dataset.name)
      this.selectedItems = [e.target.dataset.name]
      this.from = e.target.dataset.name
    },
    mouseupHandler(e) {
      e.stopPropagation()
      // console.log('up', e.target.dataset.name)
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
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
