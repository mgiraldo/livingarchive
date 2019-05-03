<template>
  <form class="controls">
    <label for="ageSelect">
      Age:
      <select id="ageSelect" v-model="selectedAge">
        <option v-for="(age,index) in ages" :key="index" :value="index">{{ age }}</option>
      </select>
    </label>
    <label for="sexSelect">
      Sex:
      <select id="sexSelect" v-model="selectedSex">
        <option v-for="(sex,index) in sexes" :key="index" :value="index">{{ sex }}</option>
      </select>
    </label>
  </form>
</template>

<script>
export default {
  computed: {
    ages() {
      return this.$store.state.ages
    },
    sexes() {
      return this.$store.state.sexes
    },
    selectedAge: {
      get: function() {
        return this.$store.state.selectedAge
      },
      set: function(newValue) {
        this.$store.commit('selectedAge', newValue)
        this.$store.dispatch('fetchIndividuals')
      }
    },
    selectedSex: {
      get: function() {
        return this.$store.state.selectedSex
      },
      set: function(newValue) {
        this.$store.commit('selectedSex', newValue)
        this.$store.dispatch('fetchIndividuals')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.controls {
  padding: 0.5rem;
}
</style>
