import wellknown from 'wellknown'
import center from '@turf/center'

import { RDF_AGES, RDF_SEXES } from '~/utils/constants'
import { getIndividuals } from '~/utils/rdf'
import { reprojectGeoJson } from '~/utils/geo'

export const state = () => ({
  vars: [],
  individuals: {},
  points: [],
  sexes: JSON.parse(JSON.stringify(RDF_SEXES)),
  ages: JSON.parse(JSON.stringify(RDF_AGES)),
  selectedSex: 0,
  selectedAge: 0
})

export const mutations = {
  fetchedIndividuals(state, newState) {
    state.vars = newState.vars
    state.individuals = newState.individuals
    state.points = newState.points
  },
  selectedSex(state, sexIndex) {
    state.selectedSex = sexIndex
  },
  selectedAge(state, ageIndex) {
    state.selectedAge = ageIndex
  }
}

export const actions = {
  async fetchIndividuals({ commit, state }) {
    // TODO: fix limit magic number
    let rdfIndividuals = await getIndividuals({
      limit: 100,
      age: state.selectedAge,
      sex: state.selectedSex
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

    let newState = {
      vars: { individuals: rdfIndividuals.vars },
      individuals: individuals,
      points: points
    }
    commit('fetchedIndividuals', newState)
  }
}
