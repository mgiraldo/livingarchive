<template>
  <div ref="bones" class="bones"></div>
</template>

<script>
import wellknown from 'wellknown'
import bbox from '@turf/bbox'
import * as d3 from 'd3-geo'

import {
  BONE_FILL_COLOR,
  BONE_FILL_PARTIAL_COLOR,
  BONE_STROKE_COLOR
} from '~/utils/constants'

export default {
  props: {
    shape: { type: Array, required: true }
  },
  data() {
    return {}
  },
  mounted() {
    this.plotBonesD3()
  },
  methods: {
    plotBonesD3() {
      // console.log('plotting', this.shape)
      let features = []
      this.shape.forEach(wkt => {
        const parsed = wellknown.parse(wkt)
        if (parsed && parsed.type !== 'Point') {
          features.push(parsed)
        }
      })
      if (features.length === 0) return
      // find bounds
      let bounds = features.map(f => bbox(f))
      // console.log('bounds', bounds)
      let minX = Math.min(...bounds.map(bound => bound[0]))
      let minY = Math.min(...bounds.map(bound => bound[1]))
      let maxX = Math.max(...bounds.map(bound => bound[2]))
      let maxY = Math.max(...bounds.map(bound => bound[3]))
      let svgWidth = maxX - minX
      let svgHeight = maxY - minY

      // console.log(minX, minY, maxX, maxY, svgWidth, svgHeight)

      // create svg
      let width = '100%'
      let height = '100%'
      let svg = this.$d3
        .select(this.$refs.bones)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `${minX} ${minY} ${svgWidth} ${svgHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid')
        .append('g')

      // create the path
      let path = d3.geoPath()

      svg
        .selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', this.$d3.color(BONE_FILL_COLOR))
        .style('stroke-width', '0.001')
        .style('stroke', this.$d3.color(BONE_STROKE_COLOR))
    }
  }
}
</script>

<style lang="scss" scoped>
.bones {
  background: lighten($color: $global-background-color, $amount: 10%);
  border-radius: 5%;
  height: 100%;
  padding: 10%;
  width: 100%;
}
</style>
