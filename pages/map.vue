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
        <l-map ref="myMap" :max-zoom="25">
          <l-tile-layer
            v-for="(layer,index) in tilelayers"
            :key="index"
            :url="layer.url"
            :attribution="layer.options.attribution"
          ></l-tile-layer>
          <l-marker
            v-for="(individual, index) in individuals"
            :key="index"
            :lat-lng="individual.point.coordinates"
          >
            <l-icon class-name="icon">
              <div>💀</div>
            </l-icon>
            <l-popup>
              <dl class="popup">
                <dt>Identifier</dt>
                <dd>{{individual.identifier}}</dd>
                <dt>Sex</dt>
                <dd>{{individual.sex}}</dd>
                <dt>Age</dt>
                <dd>{{individual.age}}</dd>
              </dl>
            </l-popup>
          </l-marker>
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
    let individuals = {}
    rdfIndividuals.results.forEach(element => {
      if (!individuals[element.identifier]) {
        individuals[element.identifier] = element
        individuals[element.identifier].point = []
        individuals[element.identifier].skeleton = []
      } else {
        individuals[element.identifier].skeleton.push(element.coordinates)
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
    checkMapObject() {
      let points = []
      Object.keys(this.individuals).forEach(identifier => {
        this.individuals[identifier].point = this.reprojectGeoJson(
          wellknown.parse(this.individuals[identifier].coordinates)
        )
        points.push(this.individuals[identifier].point.coordinates)
      })
      this.checkMap = setInterval(() => {
        if (this.$refs.myMap) {
          this.$refs.myMap.fitBounds(points)
          clearInterval(this.checkMap)
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
.coordinates,
.skeleton {
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
