<template>
  <ul v-show="open">
    <li v-for="(value, name, index) in aggregations" :key="index" class="facet">
      <span class="label">{{ name }}</span>
      <search-filter-bar
        class="bar"
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
  computed: {
    total() {
      return this.$store.getters.individualCount
    }
  },
  methods: {}
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
  display: none;
  right: 0;
  position: absolute;
}
input {
  margin-right: 0.5rem;
}
</style>
