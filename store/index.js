import { RDF_AGES, RDF_SEXES, RDF_PHASES, RDF_LEVELS } from '~/utils/constants'
import { getIndividuals as getIndividualsRDF } from '~/utils/rdf'
import { getIndividuals as getIndividualsES } from '~/utils/elastic'

const isFiltered = state => {
  return (
    Array.from(state.checkedAges).length !== 0 ||
    Array.from(state.checkedSexes).length !== 0
  )
}

export const state = () => ({
  vars: [],
  viewMode: 'map',
  individuals: {},
  aggs: {},
  individualCount: 0,
  points: [],
  sexes: RDF_SEXES.values,
  ages: RDF_AGES.values,
  levels: RDF_LEVELS.values,
  phases: RDF_PHASES.values,
  checkedAges: new Set(),
  checkedSexes: new Set(),
  checkedLevels: new Set(),
  checkedPhases: new Set(),
  legendType: 'sex',
  filtered: false
})

export const mutations = {
  fetchedIndividuals(state, newState) {
    state.vars = newState.vars
    state.individuals = newState.individuals
    state.points = newState.points
    state.individualCount = newState.individualCount
    state.aggs = newState.aggs
    state.filtered = isFiltered(newState)
  },
  toggleViewMode(state, mode) {
    state.viewMode = mode
  },
  toggledLegend(state) {
    state.legendType = state.legendType === 'age' ? 'sex' : 'age'
  },
  onlyProp(state, { prop, value }) {
    let [thisProp, thatProp, thisState, thatState] =
      prop === 'sex'
        ? [RDF_SEXES.values, RDF_AGES.values, 'checkedSexes', 'checkedAges']
        : [RDF_AGES.values, RDF_SEXES.values, 'checkedAges', 'checkedSexes']
    state[thisState] = new Set(
      Object.keys(thisProp)
        .map((key, index) => {
          if (key === value) return index
        })
        .filter(index => index !== undefined)
    )
    // state[thatState] = new Set(Object.keys(thatProp).map((key, index) => index))
    state.filtered = isFiltered(state)
  },
  checkedFilter(state, { filter, index, value }) {
    console.log(filter, index, value)
    if (value === false) {
      state['checked' + filter].delete(index)
    } else {
      state['checked' + filter].add(index)
    }
    state.filtered = isFiltered(state)
  },
  clearFilters(state) {
    state.checkedAges = new Set()
    state.checkedSexes = new Set()
    state.checkedLevels = new Set()
    state.checkedPhases = new Set()
    state.filtered = false
  },
  setFilters(state, { params }) {
    // console.log('new filters', params)
    // TODO: refactor to support N filters
    let [agesArray] = params
      .filter(filter => filter.hasOwnProperty('age'))
      .map(item => item.age)
    let [sexArray] = params
      .filter(filter => filter.hasOwnProperty('sex'))
      .map(item => item.sex)
    let checkedAges
    let checkedSexes
    if (agesArray) checkedAges = new Set(agesArray)
    if (sexArray) checkedSexes = new Set(sexArray)
    if (checkedAges && state.checkedAges !== checkedAges) {
      state.checkedAges = checkedAges
    }
    if (checkedSexes && state.checkedSexes !== checkedSexes) {
      state.checkedSexes = checkedSexes
    }
    state.filtered = isFiltered(state)
  }
}

export const actions = {
  async fetchIndividuals({ commit, state }) {
    if (process.browser) {
      window.$nuxt.$root.$loading.start()
    }
    const filters = { ages: state.checkedAges, sexes: state.checkedSexes }

    // TODO: fix limit magic number
    // let { vars, individuals, count, points } = await getIndividualsRDF({
    //   limit: 500,
    //   filters: filters
    // })

    let { vars, individuals, count, points, aggs } = await getIndividualsES({
      filters: filters
    })

    let newState = {
      vars: { individuals: vars },
      checkedAges: new Set(state.checkedAges),
      checkedSexes: new Set(state.checkedSexes),
      individuals,
      individualCount: count,
      points,
      filtered: isFiltered(state),
      aggs
    }
    if (process.browser) {
      window.$nuxt.$root.$loading.finish()
    }
    commit('fetchedIndividuals', newState)
  }
}
