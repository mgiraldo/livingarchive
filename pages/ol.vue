<template>
  <no-ssr>
    <vl-map
      ref="map"
      class="map"
      data-projection="EPSG:4326"
      renderer="webgl"
      @mounted="mapMounted"
      @click="mapClick"
    >
      <vl-view ref="view" :zoom.sync="zoom" :center.sync="center"></vl-view>
      <vl-feature ref="pointShape" @update:properties="fitMap">
        <vl-geom-multi-point :coordinates="points" />
      </vl-feature>
      <vl-layer-tile>
        <vl-source-xyz
          cross-origin="Anonymous"
          :url="
            'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=' + key
          "
          :attributions="'Hello'"
        ></vl-source-xyz>
      </vl-layer-tile>
    </vl-map>
  </no-ssr>
</template>

<script>
import { AGES_COLORS, SEXES_COLORS } from '~/utils/constants'

export default {
  data() {
    return {
      zoom: 17,
      center: [-73.958128, 40.788184],
      rotation: 0,
      key: process.env.MAPTILER_KEY
    }
  },
  computed: {
    individuals() {
      return this.$store.getters.displayedIndividuals
    },
    legendType() {
      return this.$store.state.legendType
    },
    points() {
      let points = []
      for (let key in this.$store.getters.displayedIndividuals) {
        const individual = this.$store.getters.displayedIndividuals[key]
        const data = {
          ageColor: AGES_COLORS.values[individual.age],
          sexColor: SEXES_COLORS.values[individual.sex],
          point: individual.point
        }
        points.push(data.point.coordinates)
      }
      return points
    }
  },
  methods: {
    mapInited(map) {
      // console.log('inited', map)
    },
    mapMounted(map) {
      console.log('loaded', map)
      this.checkPointsObject()
    },
    checkPointsObject() {
      this.checkPoints = setInterval(() => {
        if (this.$refs.pointShape) {
          clearInterval(this.checkPoints)
          this.fitMap()
        }
      }, 100)
    },
    fitMap() {
      console.log('fit', this.$refs.pointShape)
      this.$refs.view.fit(this.$refs.pointShape.getGeometry())
    },
    mapClick(event) {
      console.log('click', event.pixel, event.coordinate)
      this.$refs.map.forEachFeatureAtPixel(event.pixel, feature => {
        const closest = feature.getGeometry().getClosestPoint(event.coordinate)
        // console.log('closest', closest, fromLonLat(closest, 'EPSG:4326'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  height: 100vh;
}
</style>
