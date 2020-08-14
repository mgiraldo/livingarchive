<template>
  <SkeletonFront id="skeleton-control" class="skeleton" />
</template>

<script>
import { BONE_FILL_COLOR } from '~/utils/constants'

import SkeletonFront from '~/assets/skeleton-front.svg'

export default {
  components: { SkeletonFront },
  props: {
    aggregations: { type: Object, default: null },
  },
  computed: {
    fixedAggregations() {
      let fixedAggregations = {}
      for (const aggregation in this.aggregations) {
        const bone = this.cleanBone(aggregation)
        if (fixedAggregations[bone]) {
          fixedAggregations[bone] += this.aggregations[aggregation]
        } else {
          fixedAggregations[bone] = this.aggregations[aggregation]
        }
      }
      return fixedAggregations
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateSkeleton()
    })
  },
  methods: {
    cleanBone(bone) {
      let index = bone.lastIndexOf('-')
      index = index === -1 ? bone.length : index
      return bone.substring(0, index)
    },
    resetBones() {
      let skeletonElement = document.querySelector('#skeleton-control')
      skeletonElement.querySelectorAll('path').forEach((elem) => {
        elem.style.fill = 'white'
        elem.style.opacity = 0.0075
      })
    },
    updateSkeleton() {
      this.resetBones()
      let prefix = '#skeleton-front-'
      for (let bone in this.fixedAggregations) {
        let boneElem = document.querySelector(prefix + bone)
        if (boneElem) {
          boneElem.querySelectorAll('path').forEach((elem) => {
            const value = this.fixedAggregations[bone]
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
    },
  },
}
</script>

<style lang="scss" scoped>
.skeleton {
  width: 100%;
}
</style>
