<template>
  <div class="viewer">
    <section class="list">
      <h1 class="label">Individual: {{identifier}}</h1>
      <ul>
        <li v-for="(preserved, bone, index) in skeleton" :key="index">{{bone}} ({{preserved}})</li>
      </ul>
    </section>
    <section class="skeleton-container">
      <skeleton-front id="skeleton"/>
    </section>
    <section class="map-container">
      <no-ssr>
        <l-map ref="myMap"></l-map>
      </no-ssr>
    </section>
  </div>
</template>

<script>
import wellknown from 'wellknown'

import SkeletonFront from '~/assets/skeleton-front.svg'
import { getSkeleton } from '~/utils/rdf'
import { reprojectGeoJson } from '~/utils/geo'
import { TILELAYERS, BONE_COLOR } from '~/utils/constants'

export default {
  components: { SkeletonFront },
  head() {
    return { title: 'skeleton' }
  },
  validate({ params }) {
    return /^[a-zA-Z\d\.]+$/.test(params.id)
  },
  async asyncData({ params }) {
    let { skeleton, shape } = await getSkeleton(params.id)
    return {
      identifier: params.id,
      skeleton: skeleton,
      shape: shape,
      tilelayers: TILELAYERS
    }
  },
  mounted() {
    let prefix = '#skeleton-front-'
    let skeletonElement = document.querySelector('#skeleton')
    skeletonElement.querySelectorAll('path').forEach(elem => {
      elem.style.fill = 'white'
    })
    for (let boneName in this.skeleton) {
      let boneElem = document.querySelector(prefix + boneName)
      if (boneElem) {
        boneElem.querySelectorAll('path').forEach(elem => {
          elem.style.fill = BONE_COLOR
        })
      }
    }
    this.checkMapObject()
  },
  methods: {
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
            style: function(feature) {
              return { stroke: false, color: BONE_COLOR, fillOpacity: 0.75 }
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
      map.fitBounds(bounds)
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

<style scoped>
.viewer {
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr 1fr 20rem 10rem;
  grid-template-rows: 1fr 20rem 1fr;
  padding: 1rem;
}
.list {
  overflow-y: scroll;
  grid-column: 1 / 2;
  grid-row: 1 / 4;
}
.skeleton-container {
  grid-column: 2 / 3;
  grid-row: 1 / 4;
}
#skeleton {
  height: 100%;
  width: 100%;
}
.map-container {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}
.leaflet-container {
  background: #fafafa;
  border-radius: 50%;
}
</style>

