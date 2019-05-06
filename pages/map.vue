<template>
  <div class="container">
    <search-controls/>
    <section class="results">
      <h1>Individuals</h1>
      <p>Filtered by: Age: {{ageFilter}} and Sex: {{sexFilter}}</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Individual</th>
            <th scope="col">Age</th>
            <th scope="col">Sex</th>
            <th scope="col">Discussion</th>
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
          <l-control class-name="legend" position="bottomleft">
            <div class="legend">
              <strong>{{legendType}}</strong>
              <ul>
                <li v-for="(color,name,index) in legend" :key="index">
                  <span class="dot" :style="`background-color:${color}`"></span>
                  {{name}}
                </li>
              </ul>
              <span
                class="legend-toggle"
                @click="toggleLegend"
                v-if="legendType === 'sex'"
              >color by age</span>
              <span
                class="legend-toggle"
                @click="toggleLegend"
                v-if="legendType === 'age'"
              >color by sex</span>
            </div>
          </l-control>
          <l-marker
            v-for="(individual, index) in individuals"
            :key="index"
            :lat-lng="individual.point.coordinates"
          >
            <l-icon class-name="icon">
              <map-marker :type="legendType" :individual="individual"/>
            </l-icon>
            <l-popup>
              <dl class="popup">
                <dt>Identifier</dt>
                <dd>{{individual.identifier}}</dd>
                <dt>Discussion</dt>
                <dd class="discussion">{{individual.discussion}}</dd>
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
import MapMarker from '~/components/MapMarker'

export default {
  head() {
    return { title: 'map' }
  },
  fetch: async function({ store, params }) {
    // TODO: make limit dynamic
    await store.dispatch('fetchIndividuals')
  },
  components: { SearchControls, ResultCell, MapMarker },
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
    },
    ageFilter() {
      return Object.keys(this.$store.state.ages)[this.$store.state.selectedAge]
    },
    sexFilter() {
      return Object.keys(this.$store.state.sexes)[this.$store.state.selectedSex]
    },
    legendType() {
      return this.$store.state.legendType
    },
    legend() {
      if (this.$store.state.legendType === 'age') {
        let ages = JSON.parse(JSON.stringify(this.$store.state.ages))
        delete ages.Any
        return ages
      } else {
        let sexes = JSON.parse(JSON.stringify(this.$store.state.sexes))
        delete sexes.Any
        return sexes
      }
    }
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'fetchedIndividuals') {
        this.fitMap()
      }
    })
    this.checkMapObject()
  },
  asyncData: async function() {
    return { tilelayers: TILELAYERS }
  },
  methods: {
    toggleLegend() {
      this.$store.commit('toggledLegend')
    },
    fitMap() {
      if (this.$refs.myMap && this.$store.state.points.length > 0) {
        this.$refs.myMap.fitBounds(this.$store.state.points)
      }
    },
    checkMapObject() {
      this.checkMap = setInterval(() => {
        if (this.$refs.myMap) {
          clearInterval(this.checkMap)
          this.fitMap()
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 3rem 1fr;
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
  border-radius: 50%;
}
.legend {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  list-style-type: none;
  padding: 0.25rem;

  ul {
    margin: 0.5rem 0;
    padding: 0;
  }

  li {
    display: flex;
    margin-bottom: 0.5rem;
  }

  li:last-child {
    margin-bottom: 0;
  }

  .dot {
    border-radius: 50%;
    height: 1rem;
    margin-right: 0.25rem;
    width: 1rem;
  }
}
.popup {
  dt {
    font-weight: bold;
  }
  dd {
    margin-bottom: 0.5rem;
  }
  .discussion {
    max-height: 5rem;
    overflow-y: auto;
  }
}
</style>
