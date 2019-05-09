<template>
  <div ref="bones" class="bones"></div>
  <!-- <div class="map-wrapper"> -->
  <!-- <no-ssr>
      <l-map ref="myMap"></l-map>
    </no-ssr> -->
  <!-- </div> -->
</template>

<script>
import wellknown from 'wellknown'
import bbox from '@turf/bbox'
import * as d3 from 'd3-geo'

import { reprojectGeoJson } from '~/utils/geo'

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
    // this.checkMapObject()
  },
  methods: {
    plotBonesD3() {
      // console.log('plotting', this.shape)
      let features = []
      this.shape.forEach(wkt => {
        const parsed = wellknown.parse(wkt)
        if (parsed.type !== 'Point') {
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
      console.log(minX, minY, maxX, maxY, svgWidth, svgHeight)

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
      console.log(BONE_FILL_COLOR, this.$d3.color(BONE_STROKE_COLOR))
    },
    plotBones() {
      let map = this.$refs.myMap.mapObject
      let bounds
      this.shape.forEach(wkt => {
        const parsed = wellknown.parse(wkt)
        if (parsed.type !== 'Point') {
          const json = reprojectGeoJson(parsed)
          const geo = L.geoJSON(json, {
            pointToLayer: function(geoJsonPoint, latlng) {
              return L.circle(latlng, { radius: 0.001 })
            },
            style: function() {
              return {
                color: BONE_STROKE_COLOR,
                weight: 0.5,
                fillColor: BONE_FILL_COLOR,
                fillOpacity: 0.75
              }
            }
          }).addTo(map)
          if (!bounds) {
            bounds = L.latLngBounds(geo.getBounds())
          } else {
            bounds.extend(geo.getBounds())
          }
        }
      })
      map.zoomControl.remove()
      map.attributionControl.remove()
      map.fitBounds(bounds.pad(0.01))
      map.dragging.disable()
    },
    checkMapObject() {
      this.checkMap = setInterval(() => {
        if (this.$refs.myMap) {
          clearInterval(this.checkMap)
          this.plotBones()
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.bones {
  background: #fafafa;
  border-radius: 50%;
  height: 100%;
  padding: 15%;
  width: 100%;
}
.map-wrapper {
  height: 100%;
  width: 100%;
}
.leaflet-container {
  background: #fafafa;
  border-radius: 50%;
}
</style>
