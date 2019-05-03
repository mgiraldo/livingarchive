<template>
  <div class="container">
    <search-controls/>
    <section class="results">
      <h1>Individuals</h1>
      <p>Filtered by: Age: {{ages[ageFilter]}} and Sex: {{sexes[sexFilter]}}</p>
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

export default {
  head() {
    return { title: 'map' }
  },
  fetch: async function({ store, params }) {
    // TODO: make limit dynamic
    await store.dispatch('fetchIndividuals')
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
    },
    ageFilter() {
      return this.$store.state.selectedAge
    },
    sexFilter() {
      return this.$store.state.selectedSex
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
  components: { SearchControls, ResultCell },
  methods: {
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

<style lang="scss">
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
  font-size: 1.5rem;
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
