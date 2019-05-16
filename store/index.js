import wellknown from 'wellknown'
import center from '@turf/center'

import { RDF_AGES, RDF_SEXES } from '~/utils/constants'
import { getIndividuals, countIndividuals } from '~/utils/rdf'
import { reprojectGeoJson } from '~/utils/geo'

const isFiltered = state => {
  // console.log(
  //   'filtered',
  //   state.checkedAges,
  //   state.checkedSexes,
  //   Array.from(state.checkedAges).length,
  //   Object.keys(RDF_AGES).length,
  //   Array.from(state.checkedSexes).length,
  //   Object.keys(RDF_SEXES).length
  // )
  return (
    Array.from(state.checkedAges).length !== Object.keys(RDF_AGES).length ||
    Array.from(state.checkedSexes).length !== Object.keys(RDF_SEXES).length
  )
}

export const state = () => ({
  vars: [],
  individuals: {},
  individualCount: 0,
  points: [],
  sexes: RDF_SEXES,
  ages: RDF_AGES,
  checkedAges: new Set(Object.keys(RDF_AGES).map((key, index) => index)),
  checkedSexes: new Set(Object.keys(RDF_SEXES).map((key, index) => index)),
  legendType: 'sex',
  filtered: false
})

export const mutations = {
  fetchedIndividuals(state, newState) {
    state.vars = newState.vars
    state.individuals = newState.individuals
    state.points = newState.points
    state.individualCount = newState.individualCount
    state.filtered = isFiltered(newState)
  },
  toggledLegend(state) {
    state.legendType = state.legendType === 'age' ? 'sex' : 'age'
  },
  onlyProp(state, { prop, value }) {
    let [thisProp, thatProp, thisState, thatState] =
      prop === 'sex'
        ? [RDF_SEXES, RDF_AGES, 'checkedSexes', 'checkedAges']
        : [RDF_AGES, RDF_SEXES, 'checkedAges', 'checkedSexes']
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
  checkedFilter(state, { type, index, value }) {
    let filter = type === 'age' ? 'Ages' : 'Sexes'
    if (value === false) {
      state['checked' + filter].delete(index)
    } else {
      state['checked' + filter].add(index)
    }
    state.filtered = isFiltered(state)
  },
  clearFilters(state) {
    state.checkedAges = new Set(
      Object.keys(RDF_AGES).map((key, index) => index)
    )
    state.checkedSexes = new Set(
      Object.keys(RDF_SEXES).map((key, index) => index)
    )
    state.filtered = false
  },
  setFilters(state, { params }) {
    // console.log('new filters', params)
    // TODO: a possible refactor of this process
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
    let rdfIndividuals = await getIndividuals({
      limit: 100,
      filters: filters
    })
    let individuals = {}
    let points = []
    rdfIndividuals.results.forEach(element => {
      let identifier = element.identifier
      if (!individuals[identifier]) {
        let point = reprojectGeoJson(wellknown.parse(element.coordinates))
        if (point.type !== 'Point') point = center(point).geometry
        individuals[identifier] = element
        individuals[identifier].skeleton = []
        individuals[identifier].point = JSON.parse(JSON.stringify(point))
        points.push(point.coordinates)
      } else {
        individuals[identifier].skeleton.push(element.coordinates)
      }
    })

    let count = await countIndividuals(filters)

    let newState = {
      vars: { individuals: rdfIndividuals.vars },
      checkedAges: new Set(state.checkedAges),
      checkedSexes: new Set(state.checkedSexes),
      individuals: individuals,
      individualCount: count,
      points: points,
      filtered: isFiltered(state)
    }
    if (process.browser) {
      window.$nuxt.$root.$loading.finish()
    }
    commit('fetchedIndividuals', newState)
  }
}
