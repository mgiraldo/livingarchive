import axios from 'axios'
import https from 'https'
import wellknown from 'wellknown'
import center from '@turf/center'

import { RDF_PREFIXES, RDF_TIMEOUT, FILTER_PARAMS_TO_NAMES } from './constants'
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

  return { skeleton: skeleton, shape: new Set(geoShape) }
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

export const getSpace = async identifier => {
  // Assumes input: SkSOMENUMBER.SUFFIX
  // and SOMENUMBER is the unit identifier
  let numberPart = identifier.replace('Sk', '')
  numberPart = numberPart.substring(0, numberPart.indexOf('.'))

  let query = `
  SELECT ?shape WHERE {
    ?unit catalhoyuk:hasIdentifier ${numberPart} .
    ?unit a catalhoyuk:Unit .
    ?unit :isSpatiallyRelatedTo ?space .
    ?space a catalhoyuk:Space .
    ?space :hasGeometry ?geom_space .
    ?geom_space :hasSerialization ?shape .
  }`

  const data = await performRdfQuery(query)

  const results = data.data.results.bindings.map(item => item.shape.value)
  return results
}

export const getAllSpaces = async identifier => {
  let query = `
  SELECT ?space ?shape WHERE {
    ?space a catalhoyuk:Space . 
    ?space :hasGeometry ?geom .
    ?geom :hasSerialization ?shape
  }`

  const data = await performRdfQuery(query)

  const results = data.data.results.bindings.map(item => {
    return { id: cleanString(item.space.value), shape: item.shape.value }
  })
  return results
}

export const getAllBuildings = async identifier => {
  let query = `
  SELECT ?space ?shape WHERE {
    ?space a catalhoyuk:Building . 
    ?space :hasGeometry ?geom .
    ?geom :hasSerialization ?shape
  }`

  const data = await performRdfQuery(query)

  const results = data.data.results.bindings.map(item => {
    return { id: cleanString(item.space.value), shape: item.shape.value }
  })
  return results
}
