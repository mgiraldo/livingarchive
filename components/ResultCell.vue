<template>
  <tr class="row" :key="individual.identifier" :identifier="individual.identifier">
    <td :class="col" v-for="(col,index) in vars" :key="index" v-on:click="hover">{{individual[col]}}</td>
    <td>
      <nuxt-link :to="`skeleton/${individual.identifier}`">skeleton</nuxt-link>
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
    hover(target) {
      console.log(this.individual)
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  &:hover {
    background-color: gray;
  }
}
</style>
