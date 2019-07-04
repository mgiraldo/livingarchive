<template>
  <ul v-show="open">
    <li
      v-for="(value, name, index) in aggregations"
      :ref="name"
      :key="index"
      class="facet"
      :data-name="name"
      @mouseover="mouseoverHandler"
      @mouseout="mouseoutHandler"
      @mousedown="mousedownHandler"
    >
      <span class="label">{{ name }}: {{ value }}</span>
      <search-filter-bar :total="total" :value="value" :show-text="false" />
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
    return { selectedItems: [] }
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    }
  },
  methods: {
    mouseoverHandler(e) {
      // console.log('over', e)
    },
    mouseoutHandler(e) {
      // console.log('out', e)
    },
    mousedownHandler(e) {
      // console.log('down', e)
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

  &:last-child {
    margin-bottom: 0;
  }

  &:hover .label {
    display: block;
  }
}
.label {
  pointer-events: none;
  display: none;
  right: 0;
  position: absolute;
}
input {
  margin-right: 0.5rem;
}
</style>
