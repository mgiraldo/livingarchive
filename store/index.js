import wellknown from 'wellknown'

import { getIndividuals, getAges } from '~/utils/rdf'
import { reprojectGeoJson } from '~/utils/geo'

export const state = () => ({
  vars: [],
  individuals: {},
  points: [],
  ages: []
})

export const mutations = {
  fetchedIndividuals(state, newState) {
    state.vars = newState.vars
    state.individuals = newState.individuals
    state.points = newState.points
  },
  fetchedAges(state, ages) {
    state.ages = ages
  }
}

export const actions = {
  async fetchIndividuals({ commit }, { limit }) {
    let rdfIndividuals = await getIndividuals(limit)
    let individuals = {}
    let points = []
    rdfIndividuals.results.forEach(element => {
      let identifier = element.identifier
      if (!individuals[identifier]) {
        let point = reprojectGeoJson(wellknown.parse(element.coordinates))
        individuals[identifier] = element
        individuals[identifier].skeleton = []
        individuals[identifier].point = JSON.parse(JSON.stringify(point))
        points.push(point.coordinates)
      } else {
        individuals[identifier].skeleton.push(element.coordinates)
      }
    })

    let newState = {
      vars: { individuals: rdfIndividuals.vars },
      individuals: individuals,
      points: points
    }
    commit('fetchedIndividuals', newState)
  },
  async fetchAges({ commit }) {
    let ages = await getAges()

    commit('fetchedAges', ages)
  }
}
