<template>
  <tr
    :key="individual.identifier"
    class="row"
    :identifier="individual.identifier"
  >
    <td class="individual" @click="cellClick(individual)">
      {{ individual.individual }}
    </td>
    <td class="age" @click="cellClick(individual)">{{ individual.age }}</td>
    <td class="sex" @click="cellClick(individual)">{{ individual.sex }}</td>
    <td class="discussion" @click="cellClick(individual)">
      {{ individual.discussion }}
    </td>
    <td>
      <nuxt-link :to="`/skeleton/${individual.identifier}`" target="_blank"
        >skeleton</nuxt-link
      >
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    individual: { type: Object, required: true },
    vars: { type: Array, required: true },
    cellClick: { type: Function, required: true }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.row {
  &:hover {
    background-color: lighten($color: $global-background-color, $amount: 10%);
  }
  td {
    vertical-align: top;
  }
}
.discussion {
  display: flex;
  margin-bottom: 1rem;
  max-height: 10rem;
  overflow-y: auto;
}
</style>
