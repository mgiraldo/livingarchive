import { RDF_AGES, RDF_SEXES, RDF_PHASES, RDF_LEVELS } from '~/utils/constants'
import {
  getAllIndividuals as getIndividualsES,
  getFilteredIndividuals
} from '~/utils/elastic'

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
  count: 0,
  displayedIdentifiers: new Set(),
  aggs: {},
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

export const getters = {
  individualCount(state) {
    return state.count
  },
  displayedCount(state) {
    if (state.displayedIdentifiers.size === 0)
      return state.getters.individualCount
    return state.displayedIdentifiers.size
  },
  displayedIndividuals(state) {
    if (state.displayedIdentifiers.size === 0) return state.individuals

    let displayed = {}

    for (let i = 0; i < state.displayedIdentifiers.size; i++) {
      const identifier = [...state.displayedIdentifiers][i]
      if (state.individuals[identifier])
        displayed[identifier] = state.individuals[identifier]
    }

    return displayed
  },
  displayedIndividualsWithBonesCount(state, getters) {
    return getters.displayedIndividualsWithBones.length
  },
  displayedIndividualsWithBones(state) {
    let individuals = []

    for (let i = 0; i < state.displayedIdentifiers.size; i++) {
      const identifier = [...state.displayedIdentifiers][i]
      const individual = state.individuals[identifier]
      if (individual && individual.skeleton && individual.skeleton.size > 0) {
        individuals.push(individual)
      }
    }

    individuals.sort((a, b) => b.skeleton.size - a.skeleton.size)
    return individuals
  }
}

export const mutations = {
  firstLoadComplete(state, newState) {
    state.vars = newState.vars
    state.individuals = newState.individuals
    state.points = newState.points
    state.aggs = newState.aggs
    state.count = newState.count
    state.filtered = isFiltered(newState)
  },
  fetchedIndividuals(state, newState) {
    state.displayedIdentifiers = newState.displayedIdentifiers
    state.aggs = newState.aggs
    state.count = newState.count
    state.filtered = isFiltered(newState)
    state.vars = newState.vars || state.vars
    state.individuals = newState.individuals || state.individuals
    state.points = newState.points || state.points
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
    // console.log(filter, index, value)
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
  async nuxtServerInit({ commit }, { route }) {
    if (
      route.name !== 'ol' &&
      route.name !== 'map-state' &&
      route.name !== 'grid-state'
    )
      return // no need to load the data

    const filters = { ages: state.checkedAges, sexes: state.checkedSexes }

    // TODO: fix limit magic number
    // let { vars, individuals, count, points } = await getIndividualsRDF({
    //   limit: 500,
    //   filters: filters
    // })

    const { vars, individuals, points, aggs, count } = await getBaseIndividuals(
      {
        filters
      }
    )

    const newState = {
      vars: { individuals: vars },
      checkedAges: new Set(state.checkedAges),
      checkedSexes: new Set(state.checkedSexes),
      individuals,
      points,
      filtered: false,
      aggs
    }
    commit('firstLoadComplete', newState)
  },
  async fetchIndividuals({ commit, state }) {
    const filters = { ages: state.checkedAges, sexes: state.checkedSexes }

    const { identifiers, aggs, count } = await getFilteredIndividuals({
      filters: filters
    })

    let newState = {
      checkedAges: state.checkedAges,
      checkedSexes: state.checkedSexes,
      displayedIdentifiers: new Set(identifiers),
      aggs,
      count
    }

    // check to see if nothing is there
    if (!state.individuals || Object.keys(state.individuals).length === 0) {
      let { vars, individuals, points, aggs, count } = await getBaseIndividuals(
        {
          filters
        }
      )
      newState.vars = vars
      newState.individuals = individuals
      newState.points = points
      newState.aggs = aggs
      newState.count = count
    }

    commit('fetchedIndividuals', newState)
  }
}

const getBaseIndividuals = async ({ filters }) => {
  const { vars, individuals, points, aggs, count } = await getIndividualsES({
    filters
  })
  return { vars, individuals, points, aggs, count }
}
