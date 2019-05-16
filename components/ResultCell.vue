<template>
  <tr
    :key="individual.identifier"
    class="row"
    :identifier="individual.identifier"
  >
    <td class="individual" @click="hoverClick">{{ individual.individual }}</td>
    <td class="age" @click="hoverClick">{{ individual.age }}</td>
    <td class="sex" @click="hoverClick">{{ individual.sex }}</td>
    <td class="discussion" @click="hoverClick">{{ individual.discussion }}</td>
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
    vars: { type: Array, required: true }
  },
  data() {
    return {}
  },
  methods: {
    hoverClick() {
      // console.log(this.individual)
    }
  }
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
