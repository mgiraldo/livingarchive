<template>
  <div class="icon-child" :style="markerColor"></div>
</template>

<script>
export default {
  props: {
    type: { type: String, required: true },
    individual: { type: Object, required: true }
  },
  computed: {
    markerColor() {
      let style = 'background-color: '
      if (this.type === 'sex') {
        style += Object.values(this.$store.state.sexes)[
          Object.keys(this.$store.state.sexes).indexOf(this.individual.sex)
        ]
      } else {
        style += Object.values(this.$store.state.ages)[
          Object.keys(this.$store.state.ages).indexOf(this.individual.age)
        ]
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-child {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
</style>
