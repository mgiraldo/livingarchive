<template>
  <skeleton-front id="skeleton-control" class="skeleton" />
</template>

<script>
import { BONE_FILL_COLOR } from '~/utils/constants'

import SkeletonFront from '~/assets/skeleton-front.svg'

export default {
  components: { SkeletonFront },
  props: {
    aggregations: { type: Object, default: null }
  },
  mounted() {
    this.$nextTick(() => {
      this.updateSkeleton()
    })
  },
  methods: {
    updateSkeleton() {
      let prefix = '#skeleton-front-'
      let skeletonElement = document.querySelector('#skeleton-control')
      skeletonElement.querySelectorAll('path').forEach(elem => {
        elem.style.fill = 'white'
        elem.style.opacity = 0.0075
      })
      for (let bone in this.aggregations) {
        let boneElem = document.querySelector(prefix + bone)
        if (boneElem) {
          boneElem.querySelectorAll('path').forEach(elem => {
            const value = this.aggregations[bone]
            if (value) {
              elem.style.fill = BONE_FILL_COLOR
              elem.style.opacity =
                Number(elem.style.opacity) + this.aggPercent(value)
            }
          })
        }
      }
    },
    aggPercent(value) {
      if (!value) return 0
      const pct = value / this.$store.getters.individualCount
      return pct <= 1 ? pct : 1
    }
  }
}
</script>

<style lang="scss" scoped></style>
