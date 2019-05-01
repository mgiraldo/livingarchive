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
            <td
              :class="col"
              v-for="(col,index) in vars.individuals"
              :key="index"
            >{{individual[col]}}</td>
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
    let ids = new Set()
    let individuals = []
    rdfIndividuals.results.forEach(element => {
      if (!ids.has(element.identifier)) {
        ids.add(element.identifier)
        individuals.push(element)
      }
    })
    return {
      vars: { individuals: rdfIndividuals.vars },
      individuals: individuals,
      tilelayers: TILELAYERS
    }
  },
  methods: {
    reprojectGeoJson(geoJson) {
      proj4.defs(PROJ4_DEFS)
      let newGeoJson = JSON.parse(JSON.stringify(geoJson))
      switch (newGeoJson.type) {
        case 'Point':
          newGeoJson.coordinates = this.reprojectPoint(newGeoJson.coordinates)
          return newGeoJson
        case 'MultiPolygon':
        case 'Polygon':
          newGeoJson.coordinates = this.reprojectArray(
            newGeoJson.coordinates,
            newGeoJson.type === 'Polygon' ? 1 : 2
          )

          return newGeoJson
      }
    },
    reprojectPoint(coords) {
      return proj4('catalhoyuk', 'EPSG:4326', coords)
    },
    reprojectArray(coords, levelsDeep) {
      // based on https://github.com/Leaflet/Leaflet/blob/61e49eef24a3ba98c187248628a4584fd4e0a5b7/src/layer/GeoJSON.js
      let coordinates = []
      for (let i = 0, len = coords.length, latlng; i < len; i++) {
        latlng = levelsDeep
          ? this.reprojectArray(coords[i], levelsDeep - 1)
          : this.reprojectPoint(coords[i])
        coordinates.push(latlng)
      }

      return coordinates
    },
    plotData(data) {
      let map = this.$refs.myMap.mapObject
      let points = []
      const icon = L.divIcon({ html: '💀', className: 'icon' })
      data.forEach((individual, index) => {
        console.log(individual.coordinates)
        let geoJson = this.reprojectGeoJson(
          wellknown.parse(individual.coordinates)
        )
        console.log(geoJson)
        if (geoJson.type === 'Point') {
          let marker = L.marker(geoJson.coordinates, { icon: icon }).addTo(map)
          points.push(geoJson.coordinates)
          marker.on('click', this.addPopup)
          marker.index = index
        } else if (geoJson.type === 'Polygon') {
          let layer = L.geoJson(geoJson).addTo(map)
          let marker = L.marker(layer.getBounds().getCenter(), {
            icon: icon
          }).addTo(map)
          points.push(layer.getBounds().getCenter())
          marker.on('click', this.addPopup)
          marker.index = index
        }
      })
      map.fitBounds(points)
    },
    addPopup(markerEvent) {
      let individual = this.individuals[markerEvent.target.index]
      let map = this.$refs.myMap.mapObject
      let popup = L.popup()
        .setLatLng(markerEvent.latlng)
        .setContent(
          `
          <dl class="popup">
          <dt>Identifier</dt>
          <dd>${individual.identifier}</dd>
          <dt>Skeleton</dt>
          <dd>${individual.skeleton}</dd>
          <dt>Sex</dt>
          <dd>${individual.sex}</dd>
          <dt>Age</dt>
          <dd>${individual.age}</dd>
          </dl>
          `
        )
        .openOn(map)
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

<style lang="scss">
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
.popup {
  dt {
    font-weight: bold;
  }
  dd {
    margin-bottom: 0.5rem;
  }
}
.coordinates {
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
