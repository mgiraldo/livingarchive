<template>
  <form class="controls">
    <label for="ageSelect">
      Age:
      <select id="ageSelect" v-model="selectedAge">
        <option value>Any</option>
        <option v-for="(age,index) in ages" :key="index" :value="index">{{ age }}</option>
      </select>
    </label>
    <label for="sexSelect">
      Sex:
      <select id="sexSelect" v-model="selectedSex">
        <option value>Any</option>
        <option v-for="(sex,index) in sexes" :key="index" :value="index">{{ sex }}</option>
      </select>
    </label>
  </form>
</template>

<script>
export default {
  props: {
    ages: { type: Array },
    sexes: { type: Array }
  },
  data() {
    return {
      selectedAge: '',
      selectedSex: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.controls {
  padding: 0.5rem;
}
</style>
