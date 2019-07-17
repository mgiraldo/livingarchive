<template>
  <li class="facet">
    <input
      :id="'ch-' + name"
      type="checkbox"
      :value="value"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
    />
    <label :for="'ch-' + name">
      <filter-color-item :name="name" :color="color" />
    </label>
    <search-filter-bar :total="total" :value="value" />
  </li>
</template>

<script>
import FilterColorItem from '~/components/FilterColorItem'
import SearchFilterBar from '~/components/SearchFilterBar'

export default {
  components: {
    FilterColorItem,
    SearchFilterBar
  },
  props: {
    name: { type: String, required: true },
    color: { type: String, default: null },
    value: { type: Number, required: true },
    total: { type: Number, required: true },
    checked: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.facet {
  @include custom-checkbox;

  margin-bottom: 1rem;
}
</style>
