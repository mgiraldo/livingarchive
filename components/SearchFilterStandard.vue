<template>
  <section>
    <SearchFilterTitle
      :controls="'facet_' + facet.name + '_toggle'"
      :open="open"
      :text="facet.name"
      @click="toggle"
    />
    <div :id="'facet_' + facet.name + '_toggle'">
      <SearchFilterList
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
    SearchFilterList,
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, required: true },
  },
  data() {
    return { open: false }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
  },
}
</script>

<style lang="scss" scoped></style>
