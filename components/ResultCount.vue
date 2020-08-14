<template>
  <div>
    <h1>{{ individualCount }} individuals</h1>
  </div>
</template>

<script>
export default {
  computed: {
    individualCount() {
      return this.$store.getters.individualCount
    },
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 2rem;
}
</style>
