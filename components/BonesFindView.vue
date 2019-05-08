<template>
  <div class="map-wrapper">
    <no-ssr>
      <!-- <div id="map"></div> -->
      <l-map ref="myMap"></l-map>
    </no-ssr>
  </div>
</template>

<script>
import wellknown from 'wellknown'

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
    // this.plotBonesD3()
    this.checkMapObject()
  },
  methods: {
    plotBonesD3() {
      let d3 = this.$d3
      let width = '100%'
      let height = '100%'
      let map = this.$d3
        .select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
      this.shape.forEach(wkt => {
        const parsed = wellknown.parse(wkt)
        if (parsed.type !== 'Point') {
          const json = reprojectGeoJson(parsed)
          let center = d3.geo.centroid(json)
          let sc = 150
          let off = [width / 2, height / 2]
          let projection = d3.geo
            .mercator()
            .scale(sc)
            .center(center)
            .translate(off)

          // create the path
          let path = d3.geo.path().projection(projection)

          // using the path determine the bounds of the current map and use
          // these to determine better values for the scale and translation
          let bounds = path.bounds(json)
          let hscale = (scale * width) / (bounds[1][0] - bounds[0][0])
          let vscale = (scale * height) / (bounds[1][1] - bounds[0][1])
          let scale = hscale < vscale ? hscale : vscale
          let offset = [
            width - (bounds[0][0] + bounds[1][0]) / 2,
            height - (bounds[0][1] + bounds[1][1]) / 2
          ]

          // new projection
          projection = d3.geo
            .mercator()
            .center(center)
            .scale(scale)
            .translate(offset)
          path = path.projection(projection)

          // add a rectangle to see the bound of the svg
          map
            .append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('stroke', 'black')
            .style('fill', 'none')

          map
            .selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', 'red')
            .style('stroke-width', '1')
            .style('stroke', 'black')
        }
      })
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
.map-wrapper {
  height: 100%;
  width: 100%;
}
.leaflet-container {
  background: #fafafa;
  border-radius: 50%;
}
</style>
