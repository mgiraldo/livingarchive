<template>
  <div class="container">
    <search-controls />
    <section class="results">
      <h1>{{ individualCount }} individuals</h1>
      <p>Filtered by: Age: {{ ageFilter }} and Sex: {{ sexFilter }}</p>
      <p>
        <nuxt-link :to="{ params: { state: 'a:1,2,3|s:2,3' } }"
          >map a</nuxt-link
        >
        <nuxt-link :to="{ params: { state: 'a:1,2,3,4|s:2,3,4,5' } }"
          >map b</nuxt-link
        >
        <nuxt-link :to="{ params: { state: 'a|s:1,2,3,4,5' } }"
          >map c</nuxt-link
        >
      </p>
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
            is="result-cell"
            v-for="individual in individuals"
            :key="individual.identifier"
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
            v-for="(layer, index) in tilelayers"
            :key="index"
            :url="layer.url"
            :options="layer.options"
          ></l-tile-layer>
          <l-control-scale
            position="topright"
            :imperial="false"
            :metric="true"
          ></l-control-scale>
          <l-control class-name="legend" position="bottomleft">
            <div class="legend">
              <strong>{{ legendType }}</strong>
              <ul>
                <li v-for="(color, name, index) in legend" :key="index">
                  <filter-color-item :name="name" :color="color" />
                </li>
              </ul>
              <button
                v-if="legendType === 'sex'"
                class="legend-toggle"
                @click="toggleLegend"
              >
                color by age
              </button>
              <button
                v-if="legendType === 'age'"
                class="legend-toggle"
                @click="toggleLegend"
              >
                color by sex
              </button>
            </div>
          </l-control>
          <l-marker
            v-for="(individual, index) in individuals"
            :key="index"
            :lat-lng="individual.point.coordinates"
          >
            <l-icon class-name="icon">
              <map-marker :type="legendType" :individual="individual" />
            </l-icon>
            <l-popup>
              <dl class="popup">
                <dt>Identifier</dt>
                <dd>{{ individual.identifier }}</dd>
                <dt>Sex</dt>
                <dd>
                  {{ individual.sex }}
                  <button @click="andSex">AND</button>
                  <button @click="orSex">OR</button>
                </dd>
                <dt>Age</dt>
                <dd>
                  {{ individual.age }}
                  <button @click="andAge">AND</button>
                  <button @click="orAge">OR</button>
                </dd>
              </dl>
            </l-popup>
          </l-marker>
        </l-map>
      </no-ssr>
    </section>
  </div>
</template>

<script>
import { TILELAYERS } from '~/utils/constants'

import SearchControls from '~/components/SearchControls'
import ResultCell from '~/components/ResultCell'
import MapMarker from '~/components/MapMarker'
import FilterColorItem from '~/components/FilterColorItem'

export default {
  head() {
    return { title: 'map' }
  },
  key: '_map',
  components: { SearchControls, ResultCell, MapMarker, FilterColorItem },
  data() {
    return {
      tilelayers: TILELAYERS,
      ageFilter: [...this.$store.state.checkedAges],
      sexFilter: [...this.$store.state.checkedSexes]
    }
  },
  computed: {
    individualCount() {
      return this.$store.state.individualCount
    },
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
    legendType() {
      return this.$store.state.legendType
    },
    legend() {
      if (this.$store.state.legendType === 'age') {
        return this.$store.state.ages
      } else {
        return this.$store.state.sexes
      }
    }
  },
  // beforeRouteUpdate(to, from, next) {
  //   console.log('route change', to, from, next)
  // },
  fetch: async function({ store }) {
    // TODO: make limit dynamic
    await store.dispatch('fetchIndividuals')
  },
  created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted')
    this.$store.subscribe(mutation => {
      if (mutation.type === 'fetchedIndividuals') {
        this.fitMap()
      }
      if (mutation.type === 'checkedFilter') {
        this.updateFilters()
      }
    })
    this.checkMapObject()
  },
  methods: {
    updateFilters() {
      this.ageFilter = [...this.$store.state.checkedAges]
      this.sexFilter = [...this.$store.state.checkedSexes]
    },
    andSex(event) {
      this.andProp('sex', event.target.value)
    },
    orSex(event) {
      this.orProp('sex', event.target.value)
    },
    andAge(event) {
      this.andProp('age', event.target.value)
    },
    orAge(event) {
      this.orProp('age', event.target.value)
    },
    orProp(prop, value) {
      console.log('or', prop, value)
    },
    andProp(prop, value) {
      console.log('and', prop, value)
    },
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
    list-style-type: none;
    margin: 0.5rem 0;
    padding: 0;
  }

  li {
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
