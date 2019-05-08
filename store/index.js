import wellknown from 'wellknown'
import center from '@turf/center'

import { RDF_AGES, RDF_SEXES } from '~/utils/constants'
import { getIndividuals, countIndividuals } from '~/utils/rdf'
import { reprojectGeoJson } from '~/utils/geo'

export const state = () => ({
  vars: [],
  individuals: {},
  individualCount: 0,
  points: [],
  sexes: RDF_SEXES,
  ages: RDF_AGES,
  checkedAges: new Set(Object.keys(RDF_AGES).map((key, index) => index)),
  checkedSexes: new Set(Object.keys(RDF_SEXES).map((key, index) => index)),
  legendType: 'sex'
})

export const mutations = {
  fetchedIndividuals(state, newState) {
    state.vars = newState.vars
    state.individuals = newState.individuals
    state.points = newState.points
    state.individualCount = newState.individualCount
  },
  toggledLegend(state) {
    state.legendType = state.legendType === 'age' ? 'sex' : 'age'
  },
  checkedFilter(state, { type, index, value }) {
    let filter = type === 'age' ? 'Ages' : 'Sexes'
    if (value === false) {
      state['checked' + filter].delete(index)
    } else {
      state['checked' + filter].add(index)
    }
  }
}

export const actions = {
  async fetchIndividuals({ commit, state }) {
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
      individuals: individuals,
      individualCount: count,
      points: points
    }
    commit('fetchedIndividuals', newState)
  }
}
