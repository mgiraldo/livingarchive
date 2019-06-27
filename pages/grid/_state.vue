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
      <div class="results-list">
        <grid-view-item
          v-for="individual in individuals"
          :key="individual.identifier"
          :individual="individual"
          :show-click="gridItemClick"
        ></grid-view-item>
        <div
          v-show="selectedIndividual !== null"
          ref="expansionElement"
          class="expansion"
        >
          <div v-if="selectedIndividual" class="expansion-contents">
            <p v-if="selectedIndividual.individual">
              {{ selectedIndividual.individual }}
            </p>
            <p v-if="selectedIndividual.identifier">
              {{ selectedIndividual.identifier }}
            </p>
            <p v-if="selectedIndividual.age">
              {{ selectedIndividual.age }}
            </p>
            <p v-if="selectedIndividual.sex">
              {{ selectedIndividual.sex }}
            </p>
            <p v-if="selectedIndividual.discussion">
              {{ selectedIndividual.discussion }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { parseParams } from '~/utils/params'
import { updateRouter } from '~/utils/router'

import SearchControls from '~/components/SearchControls'
import GridViewItem from '~/components/GridViewItem'

export default {
  head() {
    return { title: 'map' }
  },
  key: '_map',
  components: {
    SearchControls,
    GridViewItem
  },
  data() {
    return {
      expanded: null,
      selectedIndividual: null,
      currentIdentifier: '',
      currentDiscussion: '',
      currentIndividual: '',
      currentAge: '',
      currentSex: '',
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
    this.setRow()
    window.addEventListener('resize', this.setRow)
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
  beforeDestroy: function() {
    window.removeEventListener('resize', this.setRow)
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
    },
    setRow() {
      if (!this.expanded) return
      let topExpanded = this.expanded.offsetTop
      if (topExpanded === 0) {
        // first row
        this.$refs.expansionElement.style = 'grid-row-start: 1;'
        return
      }
      // not in top so we need to find what row
      let tops = [topExpanded]
      let el = this.expanded.previousElementSibling
      while (el) {
        tops.push(el.offsetTop)
        el = el.previousElementSibling
      }
      let unique = tops.filter((val, idx, array) => array.indexOf(val) === idx)
      this.$refs.expansionElement.style =
        'grid-row-start: ' + (unique.length + 1) + ';'
    },
    createExpansion(who) {
      let currentExpansion = this.$refs.expansionElement
      currentExpansion.classList.remove('open')
      setTimeout(() => {
        this.showExpansion(who)
      }, 200) // to wait until existing expansion closes
    },
    showExpansion(who) {
      let sibling = who.element
      let currentExpanded = this.expanded
      if (currentExpanded) {
        currentExpanded.classList.remove('expanded')
      }
      if (sibling === currentExpanded) {
        // just closing the existing one
        this.expanded = undefined
        return
      }
      this.selectedIndividual = who.data
      sibling.classList.add('expanded')
      this.$refs.expansionElement.classList.add('expansion', 'open')
      if (sibling.classList.contains('selected'))
        this.$refs.expansionElement.classList.add('selected')
      this.expanded = sibling
      this.setRow()
      setTimeout(() => this.$refs.expansionElement.classList.add('open'), 10)
    },
    gridItemClick(who) {
      this.createExpansion(who)
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
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem 0 0 1rem;

  h1 {
    font-size: 2rem;
  }

  h1,
  p {
    margin-left: 0.2rem;
  }
}
.results-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 10rem);
  grid-gap: 1rem;
  margin: 1rem 0 0 0;
  padding: 0;
}

/* expansion ui */
.expanded {
  position: relative;
}

.expanded:after {
  display: block;
  position: absolute;
  content: '';
  border: 1rem solid transparent;
  border-bottom-color: $grid-expansion-color;
  border-top: none;
  bottom: -1rem;
  left: 50%;
  margin-left: -1rem;
}

.expansion {
  background-color: $grid-expansion-color;
  color: $global-text-color;
  display: flex;
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: -1;
  grid-row-start: 1;
  max-height: 0;
  overflow: hidden;
  padding: 0;
  transition: all 0.2s ease-in;
}

.expansion-contents {
  padding: 1rem 0.5rem;
}

.expansion.open {
  max-height: 20vh;
  overflow-y: auto;
}
</style>
