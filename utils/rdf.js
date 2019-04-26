import axios from 'axios'

import { RDF_PREFIXES, RDF_URL, RDF_PLACEHOLDER } from './constants'

const cleanString = (str, extra) => {
  str = str.replace(RDF_PLACEHOLDER, '')
  str = extra ? str.replace(extra, '') : str
  return str
}

const performRdfQuery = async query => {
  const instance = axios.create({
    timeout: 5000,
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

export const getIndividuals = async (limit = 0) => {
  let limitStr = !isNaN(limit) && limit > 0 ? `LIMIT ${limit}` : ''
  let query = `
  SELECT DISTINCT ?individual ?identifier ?coordinates
  WHERE {
      ?individual a catalhoyuk:Individual .
      ?individual catalhoyuk:hasIdentifier ?identifier .
      ?individial catalhoyuk:hasGeometry ?geometry .
      ?geometry catalhoyuk:hasSerialization ?coordinates .
  } ${limitStr}`

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
    	?pred = catalhoyuk:preservedA ||
    	?pred = catalhoyuk:partiallyPreservedA ||
    	?pred = catalhoyuk:fullyPreservedA
    )

  } ORDER BY ?obj`

  const data = await performRdfQuery(query)

  const skeleton = data.data.results.bindings.map(item => {
    const preserved = cleanString(item.pred.value)
    const bone = cleanString(item.obj.value, '-' + identifier.replace('Sk', ''))
    return { preserved, bone }
  })

  return skeleton
}

export const getGeometry = async () => {
  let query = `
  SELECT * WHERE {
    ?unit a catalhoyuk:Unit	.
    ?unit catalhoyuk:hasGeometry ?geo	.
    ?geo catalhoyuk:hasSerialization ?coordinates .
    ?unit catalhoyuk:hasIdentifier 16230 .
  }`

  const data = await performRdfQuery(query)

  return data.data
}
