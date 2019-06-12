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
      let value = ''
      if (this.type === 'sex') {
        value = Object.values(this.$store.state.sexes)[
          Object.keys(this.$store.state.sexes).indexOf(this.individual.sex)
        ]
      } else {
        value = Object.values(this.$store.state.ages)[
          Object.keys(this.$store.state.ages).indexOf(this.individual.age)
        ]
      }
      if (value) {
        style += value
      } else {
        // TODO: remove hard-coded white
        style += '#fff'
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
