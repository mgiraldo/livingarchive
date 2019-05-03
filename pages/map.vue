<template>
  <div class="container">
    <search-controls/>
    <section class="results">
      <h1>Individuals</h1>
      <table>
        <thead>
          <tr>
            <th v-for="(col,index) in vars" :key="index" scope="col">{{col}}</th>
            <th scope="col">💀</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(individual) in individuals"
            :key="individual.identifier"
            is="result-cell"
            :individual="individual"
            :vars="vars"
          ></tr>
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
            :options="layer.options"
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
import { getIndividuals, getGeometry } from '~/utils/rdf'
import { TILELAYERS } from '~/utils/constants'

import SearchControls from '~/components/SearchControls'
import ResultCell from '~/components/ResultCell'

export default {
  head() {
    return { title: 'map' }
  },
  fetch: async function({ store, params }) {
    await store.dispatch('fetchIndividuals', { limit: 100 }) // TODO: make limit dynamic
  },
  computed: {
    vars() {
      return this.$store.state.vars.individuals
    },
    individuals() {
      return this.$store.state.individuals
    },
    ages() {
      return this.$store.state.ages
    },
    sexes() {
      return this.$store.state.sexes
    }
  },
  mounted() {
    this.checkMapObject()
  },
  asyncData: async function() {
    return { tilelayers: TILELAYERS }
  },
  components: { SearchControls, ResultCell },
  methods: {
    checkMapObject() {
      this.checkMap = setInterval(() => {
        if (this.$refs.myMap) {
          this.$refs.myMap.fitBounds(this.$store.state.points)
          clearInterval(this.checkMap)
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(3rem, auto);
  grid-template-areas:
    'controls controls'
    'results map';
  height: 100vh;
}
.controls {
  grid-area: controls;
}
.results {
  grid-area: results;
  overflow-y: scroll;
  padding: 0.5rem;

  table {
    border-collapse: collapse;
  }
}
.map {
  grid-area: map;
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
</style>
