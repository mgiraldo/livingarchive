<template>
  <tr class="row" :key="individual.identifier" :identifier="individual.identifier">
    <td class="individual" @click="hover">{{individual.individual}}</td>
    <td class="age" @click="hover">{{individual.age}}</td>
    <td class="sex" @click="hover">{{individual.sex}}</td>
    <td class="discussion" @click="hover">{{individual.discussion}}</td>
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
  td {
    vertical-align: top;
  }
}
.discussion {
  display: flex;
  margin-bottom: 1rem;
  max-height: 10rem;
  overflow-y: scroll;
}
</style>
