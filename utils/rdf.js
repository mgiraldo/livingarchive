import axios from 'axios'
import https from 'https'
import wellknown from 'wellknown'
import center from '@turf/center'

import { RDF_PREFIXES, RDF_TIMEOUT, RDF_SEXES, RDF_AGES } from './constants'
import { reprojectGeoJson } from './geo'
import { cleanString } from './stringUtils'

const performRdfQuery = async query => {
  const instance = axios.create({
    // this ignores self-signed https
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
    // end ignore self-signed https
    timeout: RDF_TIMEOUT,
    headers: {
      Accept: 'application/sparql-results+json'
    }
  })

  console.log(query)

  const results = await instance.get(
    process.env.RDF_URL + '?query=' + encodeURIComponent(RDF_PREFIXES + query)
  )
  return results
}

export const countIndividuals = async filters => {
  // TODO: sanitize params
  let ages = filters.ages ? Array.from(filters.ages) : []
  let sexes = filters.sexes ? Array.from(filters.sexes) : []

  let ageStr = ages
    .map(age => (!isNaN(age) ? `"${Object.keys(RDF_AGES.values)[age]}"` : ''))
    .join(', ')
  ageStr = ages.length ? 'FILTER (?age IN (' + ageStr + '))' : ageStr

  let sexStr = sexes
    .map(sex => (!isNaN(sex) ? `"${Object.keys(RDF_SEXES.values)[sex]}"` : ''))
    .join(', ')
  sexStr = sexes.length ? 'FILTER (?sex IN(' + sexStr + '))' : sexStr

  let query = `
  SELECT (COUNT (DISTINCT ?individual) as ?count)
  WHERE {
        ?individual a catalhoyuk:Individual .
        ?individual :hasIdentifier ?identifier .
        OPTIONAL {?individual :hasAge ?age}.
        OPTIONAL {?individual :hasSex ?sex}.
        ?individual :isConstitutedBy ?skeleton .
        OPTIONAL {?skeleton :isExcavatedIn ?find}.
        OPTIONAL {?find :hasDiscussion ?discussion}.
        ${ageStr}
        ${sexStr}
  }`

  const data = await performRdfQuery(query)

  const count = Number(data.data.results.bindings[0].count.value)

  return count
}

export const getIndividuals = async ({ limit = 0, filters }) => {
  // TODO: sanitize params
  let limitStr = !isNaN(limit) && limit > 0 ? `LIMIT ${limit}` : ''
  let ages = filters.ages ? Array.from(filters.ages) : []
  let sexes = filters.sexes ? Array.from(filters.sexes) : []

  let ageStr = ages
    .map(age => (!isNaN(age) ? `"${Object.keys(RDF_AGES.values)[age]}"` : ''))
    .join(', ')
  ageStr = ages.length ? 'FILTER (?age IN (' + ageStr + '))' : ageStr

  let sexStr = sexes
    .map(sex => (!isNaN(sex) ? `"${Object.keys(RDF_SEXES.values)[sex]}"` : ''))
    .join(', ')
  sexStr = sexes.length ? 'FILTER (?sex IN(' + sexStr + '))' : sexStr

  let query = `
  SELECT ?individual ?identifier ?age ?sex ?discussion ?coordinates ?skeleton
  WHERE {
    {
      SELECT * WHERE {
        ?individual a catalhoyuk:Individual .
        ?individual :hasIdentifier ?identifier .
        OPTIONAL {?individual :hasAge ?age}.
        OPTIONAL {?individual :hasSex ?sex}.
        ?individual :isConstitutedBy ?skeleton .
        OPTIONAL {?skeleton :isExcavatedIn ?find}.
        OPTIONAL {?find :hasDiscussion ?discussion}.
        ${ageStr}
        ${sexStr}
      } ${limitStr}
    }
      ?skeleton a catalhoyuk:Skeleton .
      ?skeleton :hasGeometry ?geometry .
      ?geometry :hasSerialization ?coordinates .
  }`

  const data = await performRdfQuery(query)

  const vars = data.data.head.vars
  const results = data.data.results.bindings.map(item => {
    let newItem = {}
    vars.forEach(element => {
      newItem[element] = item[element] ? cleanString(item[element].value) : ''
    })
    return newItem
  })

  // prepare for store
  // TODO: fix limit magic number
  // TODO: remove extra looping
  let individuals = {}
  let points = []
  results.forEach(element => {
    let identifier = element.identifier
    if (!individuals[identifier]) {
      // we assume we recive a point
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

  return { vars, individuals, count, points }
}

export const getSkeleton = async identifier => {
  // first get preservation info
  let query = `
  SELECT ?pred ?obj ?bone WHERE {
    {
      SELECT ?individual WHERE {
      ?individual catalhoyuk:hasIdentifier catalhoyuk:${identifier} .
      }
    }

    ?individual ?pred ?obj .

    FILTER (
    	?pred = catalhoyuk:partiallyPreservedA ||
    	?pred = catalhoyuk:fullyPreservedA
    )

  } ORDER BY ?obj`

  const data = await performRdfQuery(query)

  let skeleton = {}
  data.data.results.bindings.forEach(item => {
    const preserved = cleanString(item.pred.value)
    const bone = cleanString(item.obj.value, '-' + identifier.replace('Sk', ''))
    if (
      !skeleton[bone] ||
      (preserved === 'fullyPreservedA' && skeleton[bone] !== preserved)
    ) {
      // fullyPreservedA overrides partiallyPreservedA
      skeleton[bone] = preserved
    }
  })

  // now get the geo shape for the skeleton
  query = `
    SELECT DISTINCT ?coordinates
    WHERE {
        ?individual a catalhoyuk:Individual .
        ?individual :hasIdentifier catalhoyuk:${identifier} .
        ?individual :isConstitutedBy ?skeleton .
        ?skeleton a catalhoyuk:Skeleton .
        ?skeleton :hasGeometry ?geometry .
        ?geometry :hasSerialization ?coordinates .
    }`

  const geoData = await performRdfQuery(query)

  let geoShape = geoData.data.results.bindings.map(
    binding => binding.coordinates.value
  )

  return { skeleton: skeleton, shape: geoShape }
}

export const getBuilding = async identifier => {
  // TODO: sanitize params

  let query = `
  SELECT ?shape WHERE {
    ?skeleton :hasIdentifier catalhoyuk:${identifier} .
    ?skeleton :isConstitutedBy ?individual .
    ?individual :isLocatedIn ?space .
    ?unit :isLocatedIn ?space .
    ?unit :constitutes ?feature .
    ?feature a catalhoyuk:Wall .
    ?unit :hasGeometry ?geom .
    ?geom :hasSerialization ?shape .
  }`

  const data = await performRdfQuery(query)

  const results = data.data.results.bindings.map(item => item.shape.value)
  return results
}
