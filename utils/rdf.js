import axios from 'axios'

import {
  RDF_PREFIXES,
  RDF_URL,
  RDF_PLACEHOLDER,
  RDF_TIMEOUT,
  RDF_SEXES,
  RDF_AGES
} from './constants'

const cleanString = (str, extra) => {
  str = str.replace(RDF_PLACEHOLDER, '')
  str = extra ? str.replace(extra, '') : str
  return str
}

const performRdfQuery = async query => {
  const instance = axios.create({
    timeout: RDF_TIMEOUT,
    headers: {
      'Content-Type': 'application/sparql-query',
      Accept: 'application/sparql-results+json'
    }
  })
  const results = await instance.get(
    RDF_URL + '?query=' + encodeURIComponent(RDF_PREFIXES + query)
  )
  return results
}

export const getIndividuals = async ({ limit = 0, age, sex }) => {
  // TODO: sanitize params
  let limitStr = !isNaN(limit) && limit > 0 ? `LIMIT ${limit}` : ''
  let ageStr =
    age && !isNaN(age) ? `?individual :hasAge "${RDF_AGES[age]}" .` : ''
  let sexStr =
    sex && !isNaN(sex) ? `?individual :hasSex "${RDF_SEXES[sex]}" .` : ''
  let query = `
  SELECT ?individual ?identifier ?age ?sex ?discussion ?coordinates ?skeleton
  WHERE {
    {
      SELECT * WHERE {
        ?individual a catalhoyuk:Individual .
        ?individual :hasIdentifier ?identifier .
        ?individual :hasAge ?age .
        ?individual :hasSex ?sex .
        ?individual :isConstitutedBy ?skeleton .
        ?skeleton :isExcavatedIn ?find .
        ?find :hasDiscussion ?discussion .
        ${ageStr}
        ${sexStr}
      } ${limitStr}
    }
      ?skeleton a catalhoyuk:Skeleton .
      ?skeleton :hasGeometry ?geometry .
      ?geometry :hasSerialization ?coordinates .
  }`

  // console.log(query)

  const data = await performRdfQuery(query)

  const vars = data.data.head.vars
  const results = data.data.results.bindings.map(item => {
    let newItem = {}
    vars.forEach(element => {
      newItem[element] = cleanString(item[element].value)
    })
    return newItem
  })
  return { vars, results }
}

export const getSkeleton = async identifier => {
  let query = `
  SELECT ?pred ?obj WHERE {
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

  return skeleton
}

// export const getGeometry = async () => {
//   let query = `
//   SELECT * WHERE {
//     ?unit a catalhoyuk:Unit	.
//     ?unit catalhoyuk:hasGeometry ?geo	.
//     ?geo catalhoyuk:hasSerialization ?coordinates .
//     ?unit catalhoyuk:hasIdentifier 16230 .
//   }`

//   const data = await performRdfQuery(query)

//   return data.data
// }
