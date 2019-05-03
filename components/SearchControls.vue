<template>
  <div class="container">
    Age:
    <select v-model="selectedAge">
      <option value>Any</option>
      <option v-for="(age,index) in ages" :key="index" :value="index">{{ age }}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    ages: { type: Array }
  },
  data() {
    return {
      selectedAge: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: pink;
}
</style>
