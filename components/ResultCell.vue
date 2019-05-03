<template>
  <tr class="row" :key="individual.identifier" :identifier="individual.identifier">
    <td :class="col" v-for="(col,index) in vars" :key="index" @click="hover">{{individual[col]}}</td>
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
.coordinates,
.skeleton {
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
