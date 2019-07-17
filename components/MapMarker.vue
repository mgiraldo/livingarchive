<template>
  <div class="icon-child" :style="markerColor"></div>
</template>

<script>
import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'
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
        value = Object.values(FILTER_PARAMS_TO_NAMES.s.colors)[
          Object.keys(FILTER_PARAMS_TO_NAMES.s.colors).indexOf(
            this.individual.sex
          )
        ]
      } else {
        value = Object.values(FILTER_PARAMS_TO_NAMES.a.colors)[
          Object.keys(FILTER_PARAMS_TO_NAMES.a.colors).indexOf(
            this.individual.age
          )
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
