<template>
  <div class="container">
    <section class="results">
      <h1>Individuals</h1>
      <table>
        <thead>
          <tr>
            <th v-for="(col,index) in vars.individuals" :key="index" scope="col">{{col}}</th>
            <th scope="col">💀</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(individual,idx) in individuals" :key="idx">
            <td v-for="(col,index) in vars.individuals" :key="index">{{individual[col]}}</td>
            <td>
              <nuxt-link :to="`skeleton/${individual.identifier}`">skeleton</nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="map">
      <no-ssr>
        <l-map ref="myMap">
          <l-tile-layer
            v-for="(layer,index) in tilelayers"
            :key="index"
            :url="layer.url"
            :attribution="layer.options.attribution"
          ></l-tile-layer>
        </l-map>
      </no-ssr>
    </section>
  </div>
</template>

<script>
import wellknown from 'wellknown'
import proj4 from 'proj4'
import { getIndividuals, getGeometry } from '~/utils/rdf'
import { PROJ4_DEFS, TILELAYERS } from '~/utils/constants'

export default {
  head() {
    return { title: 'map' }
  },
  mounted() {
    this.checkMapObject()
  },
  asyncData: async function() {
    let rdfIndividuals = await getIndividuals(100)
    return {
      vars: { individuals: rdfIndividuals.vars },
      individuals: rdfIndividuals.results,
      tilelayers: TILELAYERS
    }
  },
  methods: {
    reproject(wkt) {
      proj4.defs(PROJ4_DEFS)
      return proj4('catalhoyuk', 'EPSG:4326', wkt)
    },
    plotData(data) {
      let map = this.$refs.myMap.mapObject
      let points = []
      const icon = L.divIcon({ html: '💀', className: 'icon' })
      data.forEach(element => {
        let pointWkt = wellknown.parse(element.coordinates)
        let pointGeo = this.reproject(pointWkt.coordinates)
        L.marker(pointGeo, { icon: icon }).addTo(map)
        points.push(pointGeo)
      })
      map.fitBounds(points)
    },
    checkMapObject() {
      this.checkMap = setInterval(() => {
        if (this.$refs.myMap) {
          clearInterval(this.checkMap)
          this.initMap()
        }
      }, 100)
    },
    initMap() {
      let map = this.$refs.myMap.mapObject
      map.setMaxZoom(25)
      map.setView(L.latLng(50.5, 10.5), 11)
      this.checkData = setInterval(() => {
        if (this.individuals.length > 0) {
          clearInterval(this.checkData)
          this.plotData(this.individuals)
        }
      }, 100)
    }
  }
}
</script>

<style>
.container {
  display: flex;
  height: 100vh;
}
.results {
  flex-basis: 50%;
  overflow-y: scroll;
}
.map {
  flex-basis: 50%;
}
.icon {
  font-size: 1.5rem;
}
</style>
