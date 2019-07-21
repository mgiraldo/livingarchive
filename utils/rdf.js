import axios from 'axios'
import https from 'https'
import wellknown from 'wellknown'

import { RDF_PREFIXES, RDF_TIMEOUT } from './constants'
import { cleanString } from './stringUtils'
import { reprojectGeoJson } from './geo'

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
  SELECT ?id ?wkt WHERE {
    ?id :hasIdentifier catalhoyuk:${identifier} .
    ?id :isConstitutedBy ?individual .
    ?individual :isLocatedIn ?space .
    ?unit :isLocatedIn ?space .
    ?unit :constitutes ?feature .
    ?feature a catalhoyuk:Wall .
    ?unit :hasGeometry ?geom .
    ?geom :hasSerialization ?wkt .
  }`

  const data = await performRdfQuery(query)

  const results = parseShapes(data.data.results.bindings)
  return results
}

export const getSpace = async identifier => {
  // Assumes input: SkSOMENUMBER.SUFFIX
  // and SOMENUMBER is the unit identifier
  let numberPart = identifier.replace('Sk', '')
  numberPart = numberPart.substring(0, numberPart.indexOf('.'))

  let query = `
  SELECT ?id ?wkt WHERE {
    ?id catalhoyuk:hasIdentifier ${numberPart} .
    ?id a catalhoyuk:Unit .
    ?id :isSpatiallyRelatedTo ?space .
    ?space a catalhoyuk:Space .
    ?space :hasGeometry ?geom_space .
    ?geom_space :hasSerialization ?wkt .
  }`

  const data = await performRdfQuery(query)

  const results = parseShapes(data.data.results.bindings)
  return results
}

export const getAllSpaces = async () => {
  let query = `
  SELECT ?id ?wkt WHERE {
    ?id a catalhoyuk:Space . 
    ?id :hasGeometry ?geom .
    ?geom :hasSerialization ?wkt
  }`

  const data = await performRdfQuery(query)

  const results = parseShapes(data.data.results.bindings)
  return results
}

export const getAllBuildings = async () => {
  let query = `
  SELECT ?id ?wkt WHERE {
    ?id a catalhoyuk:Building . 
    ?id :hasGeometry ?geom .
    ?geom :hasSerialization ?wkt
  }`

  const data = await performRdfQuery(query)

  const results = parseShapes(data.data.results.bindings)
  return results
}

/**
 * Produces a GeoJSON from the SparQL WKT data
 * @param {sparql-results+json} bindings The bindings as they came from SparQL
 */
const parseShapes = bindings => {
  const results = bindings
    .map(item => {
      const wkt = item.wkt.value
      let parsed
      if (wkt) parsed = wellknown.parse(wkt)
      let projected
      if (!parsed || parsed.type === 'Point') return
      projected = reprojectGeoJson(parsed)
      return {
        type: 'Feature',
        geometry: projected,
        properties: { id: cleanString(item.id.value) }
      }
    })
    .filter(item => item !== undefined)
  return results
}
