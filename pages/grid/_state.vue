<template>
  <div class="container">
    <search-controls class="controls" />
    <section ref="resultsPane" class="results">
      <h1>{{ individualCount }} individuals</h1>
      <p>
        Showing first {{ displayedIndividuals }} sorted by shape count and
        filtered by: Age: {{ ageFilter }} and Sex: {{ sexFilter }}
      </p>
      <p>
        <button class="link-button" @click="toggleMap">
          View map
        </button>
      </p>
      <ul class="results-list">
        <li
          v-for="individual in individuals"
          :key="individual.identifier"
          class="results-list-item"
        >
          <bones-find-view :shape="individual.skeleton" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'
import { updateRouter } from '~/utils/router'

import SearchControls from '~/components/SearchControls'
import BonesFindView from '~/components/BonesFindView'

export default {
  head() {
    return { title: 'map' }
  },
  key: '_map',
  components: {
    SearchControls,
    BonesFindView
  },
  data() {
    return {
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
      let individuals = []
      for (const identifier in this.$store.state.individuals) {
        const individual = this.$store.state.individuals[identifier]
        if (individual.skeleton && individual.skeleton.length > 0) {
          individuals.push(individual)
        }
      }
      individuals.sort((a, b) => b.skeleton.length - a.skeleton.length)
      return individuals
    },
    displayedIndividuals() {
      return this.individuals.length
    }
  },
  beforeRouteUpdate(to, from, next) {
    // console.log('route change', to, from, next)
    next()
  },
  fetch: async function({ store, params }) {
    // console.log('fetch')
    if (params.state) {
      // console.log('ssr map.fetch', params)
      let parsedParams = parseParams(params)
      store.commit('setFilters', { params: parsedParams })
    }
    await store.dispatch('fetchIndividuals')
  },
  created() {},
  mounted() {
    this.$store.subscribe(mutation => {
      if (
        mutation.type === 'setFilters' ||
        mutation.type === 'clearFilters' ||
        mutation.type === 'checkedFilter' ||
        mutation.type === 'onlyProp'
      ) {
        this.updateFilters()
      }
    })
  },
  methods: {
    updateFilters() {
      this.ageFilter = [...this.$store.state.checkedAges]
      this.sexFilter = [...this.$store.state.checkedSexes]
    },
    disableSelect() {
      this.pane.style['-moz-user-select'] = 'none'
      this.pane.style['-webkit-user-select'] = 'none'
      this.pane.style['-ms-user-select'] = 'none'
      this.pane.style.userSelect = 'none'
    },
    enableSelect() {
      this.pane.style['-moz-user-select'] = ''
      this.pane.style['-webkit-user-select'] = ''
      this.pane.style['-ms-user-select'] = ''
      this.pane.style.userSelect = ''
    },
    toggleMap() {
      this.$store.commit('toggleViewMode', 'map')
      updateRouter({ router: this.$router, store: this.$store })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
}
.controls {
  flex: 0 0 15rem;
  overflow-wrap: anywhere;
  overflow-y: auto;
  width: 15rem;
}
.splitview {
  display: flex;
  flex: 1;
}
.results {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0.5rem;

  h1 {
    font-size: 2rem;
  }

  h1,
  p {
    margin-left: 0.2rem;
  }
}
.results-list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
}
.results-list-item {
  height: 10rem;
  margin: 0.5rem;
  width: 10rem;
}
</style>
