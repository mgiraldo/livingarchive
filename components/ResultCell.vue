<template>
  <tr class="row" :key="individual.identifier" :identifier="individual.identifier">
    <td class="individual" @click="hoverClick">{{individual.individual}}</td>
    <td class="age" @click="hoverClick">{{individual.age}}</td>
    <td class="sex" @click="hoverClick">{{individual.sex}}</td>
    <td class="discussion" @click="hoverClick">{{individual.discussion}}</td>
    <td>
      <nuxt-link :to="`skeleton/${individual.identifier}`" target="_blank">skeleton</nuxt-link>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    individual: { type: Object },
    vars: { type: Array }
  },
  data() {
    return {}
  },
  methods: {
    hoverClick(target) {
      // console.log(this.individual)
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  &:hover {
    background-color: gray;
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
