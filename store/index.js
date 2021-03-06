import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'
import { getAllIndividuals, getFilteredIndividuals } from '~/utils/elastic'
import { getAllBuildings, getAllSpaces } from '~/utils/rdf'

const isFiltered = (state) => {
  for (let param in FILTER_PARAMS_TO_NAMES) {
    const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
    if (state['checked' + storeName].size !== 0) return true
  }

  return false
}

export const state = () => ({
  viewMode: 'map',
  individuals: {},
  buildings: [],
  spaces: [],
  count: 0,
  displayedIdentifiers: new Set(),
  aggs: {},
  points: [],
  checkedAges: new Set(),
  checkedSexes: new Set(),
  checkedLevels: new Set(),
  checkedPhases: new Set(),
  checkedSkeleton: new Set(),
  legendType: 'age',
  filtered: false,
})

export const getters = {
  filterIsChecked: (state) => ({ filter, name }) => {
    // console.log('store has', filter, name)
    return state['checked' + filter] && state['checked' + filter].has(name)
  },
  individualCount(state) {
    return state.count
  },
  displayedCount(state) {
    if (state.displayedIdentifiers.size === 0) return state.count
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
  },
}

export const mutations = {
  firstLoadComplete(state, newState) {
    state.buildings = newState.buildings
    state.spaces = newState.spaces
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
    state.individuals = newState.individuals || state.individuals
    state.points = newState.points || state.points
  },
  toggleViewMode(state, mode) {
    state.viewMode = mode
  },
  toggledLegend(state) {
    state.legendType = state.legendType === 'age' ? 'sex' : 'age'
  },
  checkedFilter(state, { filter, name, value }) {
    // console.log('checkedFilter', filter, name, value)
    if (value === false) {
      state['checked' + filter].delete(name)
    } else {
      state['checked' + filter].add(name)
    }
    state.filtered = isFiltered(state)
  },
  resetFilter(state, { filter, values }) {
    state['checked' + filter] = new Set(values)
    state.filtered = isFiltered(state)
  },
  clearFilters(state) {
    for (let param in FILTER_PARAMS_TO_NAMES) {
      const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
      state['checked' + storeName] = new Set()
    }
    state.filtered = false
  },
  setFilters(state, { params }) {
    for (let param in FILTER_PARAMS_TO_NAMES) {
      const agg = FILTER_PARAMS_TO_NAMES[param].agg
      const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
      const [paramArray] = params
        .filter((filter) => Object.prototype.hasOwnProperty.call(filter, agg))
        .map((item) => item[agg])
      let checked
      if (paramArray) checked = new Set(paramArray)
      if (checked && state['checked' + storeName] !== checked) {
        state['checked' + storeName] = checked
      }
    }

    state.filtered = isFiltered(state)
  },
}

export const actions = {
  async nuxtServerInit({ commit }, { route }) {
    if (route.name !== 'map-state' && route.name !== 'grid-state') return // no need to load the data

    const filters = createFilters(state)

    const { individuals, points, aggs, count } = await getBaseIndividuals({
      filters,
    })

    const spaces = await getAllSpaces()
    const buildings = await getAllBuildings()

    let newState = {
      spaces,
      buildings,
      individuals,
      points,
      filtered: false,
      aggs,
      count,
    }

    for (let param in FILTER_PARAMS_TO_NAMES) {
      const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
      newState['checked' + storeName] = new Set(state['checked' + storeName])
    }

    commit('firstLoadComplete', newState)
  },
  async fetchIndividuals({ commit, state }) {
    const filters = createFilters(state)

    const { identifiers, aggs, count } = await getFilteredIndividuals({
      filters: filters,
    })

    let newState = {
      displayedIdentifiers: new Set(identifiers),
      aggs,
      count,
    }

    for (let param in FILTER_PARAMS_TO_NAMES) {
      const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
      newState['checked' + storeName] = state['checked' + storeName]
    }

    // check to see if nothing is there
    if (!state.individuals || Object.keys(state.individuals).length === 0) {
      let { individuals, points, aggs, count } = await getBaseIndividuals({
        filters,
      })
      newState.individuals = individuals
      newState.points = points
      newState.aggs = aggs
      newState.count = count
    }

    commit('fetchedIndividuals', newState)
  },
}

const createFilters = (state) => {
  const filters = {}
  for (let param in FILTER_PARAMS_TO_NAMES) {
    const agg = FILTER_PARAMS_TO_NAMES[param].agg
    const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
    filters[agg] = state['checked' + storeName]
  }
  return filters
}

const getBaseIndividuals = async ({ filters }) => {
  const { individuals, points, aggs, count } = await getAllIndividuals({
    filters,
  })
  return { individuals, points, aggs, count }
}
