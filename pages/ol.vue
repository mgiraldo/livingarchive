<template>
  <no-ssr>
    <vl-map
      ref="map"
      class="map"
      data-projection="EPSG:4326"
      renderer="webgl"
      @mounted="mapLoaded"
      @click="mapClick"
    >
      <vl-view ref="view" :zoom.sync="zoom" :center.sync="center"></vl-view>
      <vl-feature>
        <vl-geom-multi-point :coordinates="points" />
        <!-- <vl-style-box>
          <vl-style-icon :src="png" :scale="1.0" :anchor="[0.5, 1]" />
        </vl-style-box> -->
        <!-- <l-popup max-width="15rem" class="popup">
          <dl>
            <dt>Identifier</dt>
            <dd>
              <nuxt-link
                :to="`/skeleton/${individual.identifier}`"
                target="_blank"
                >{{ individual.identifier }}</nuxt-link
              >
            </dd>
            <dt>Skeleton</dt>
            <dd class="bones">
              <bones-find-view :shape="individual.skeleton" />
            </dd>
            <dt>Sex</dt>
            <dd>
              {{ individual.sex }}
              <button type="button" :value="individual.sex" @click="onlySex">
                ONLY
              </button>
            </dd>
            <dt>Age</dt>
            <dd>
              {{ individual.age }}
              <button type="button" :value="individual.age" @click="onlyAge">
                ONLY
              </button>
            </dd>
          </dl>
        </l-popup> -->
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
// import { fromLonLat } from 'ol/proj'

export default {
  data() {
    return {
      zoom: 17,
      center: [32.826886, 37.668639],
      rotation: 0,
      key: process.env.MAPTILER_KEY
    }
  },
  computed: {
    individuals() {
      return this.$store.getters.displayedIndividuals
    },
    points() {
      return this.$store.state.points
    }
  },
  methods: {
    mapInited(map) {
      console.log('inited', map)
    },
    mapLoaded(map) {
      console.log('loaded', map)
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
