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
      Accept: 'application/sparql-results+json'
    }
  })

  console.log(query)

  const results = await instance.get(
    RDF_URL + '?query=' + encodeURIComponent(RDF_PREFIXES + query)
  )
  return results
}

export const countIndividuals = async filters => {
  // TODO: sanitize params
  let ages = filters.ages ? Array.from(filters.ages) : []
  let sexes = filters.sexes ? Array.from(filters.sexes) : []

  let ageStr = ages
    .map(age => (!isNaN(age) ? `"${Object.keys(RDF_AGES)[age]}"` : ''))
    .join(', ')
  ageStr = ages.length ? 'FILTER (?age IN (' + ageStr + '))' : ageStr

  let sexStr = sexes
    .map(sex => (!isNaN(sex) ? `"${Object.keys(RDF_SEXES)[sex]}"` : ''))
    .join(', ')
  sexStr = sexes.length ? 'FILTER (?sex IN(' + sexStr + '))' : sexStr

  let query = `
  SELECT (COUNT (DISTINCT ?individual) as ?count)
  WHERE {
        ?individual a catalhoyuk:Individual .
        ?individual :hasIdentifier ?identifier .
        ?individual :hasAge ?age .
        ?individual :hasSex ?sex .
        ?individual :isConstitutedBy ?skeleton .
        ?skeleton :isExcavatedIn ?find .
        ?find :hasDiscussion ?discussion .
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
    .map(age => (!isNaN(age) ? `"${Object.keys(RDF_AGES)[age]}"` : ''))
    .join(', ')
  ageStr = ages.length ? 'FILTER (?age IN (' + ageStr + '))' : ageStr

  let sexStr = sexes
    .map(sex => (!isNaN(sex) ? `"${Object.keys(RDF_SEXES)[sex]}"` : ''))
    .join(', ')
  sexStr = sexes.length ? 'FILTER (?sex IN(' + sexStr + '))' : sexStr

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

export const getBubbles = async (type = 'Unit') => {
  // TODO: sanitize params

  let query = `
  SELECT DISTINCT ?subject ?supertype
  WHERE {
      {
          ?subject a owl:Class .
  OPTIONAL { ?subject sesame:directSubClassOf
  ?supertype } .
          OPTIONAL { ?subject rdfs:label ?label }.
      }
            FILTER (
            (
              ?supertype = catalhoyuk:${type} ||
              ?subject = catalhoyuk:${type}
            ) &&
            ?subject != owl:Class &&
            ?subject != rdf:List &&
            ?subject != rdf:Property &&
            ?subject != rdfs:Class &&
            ?subject != rdfs:Datatype &&
            ?subject != rdfs:ContainerMembershipProperty &&
            ?subject != owl:DatatypeProperty &&
            ?subject != owl:NamedIndividual &&
            ?subject != owl:Ontology &&
            ?subject != ?supertype)
  } ORDER BY ?subject`

  const data = await performRdfQuery(query)

  const results = data.data.results.bindings.map(item => {
    return {
      supertype: item.supertype.value.replace(
        'http://www.semanticweb.org/dlukas/ontologies/2017/1/catalhoyuk#',
        ''
      ),
      subject: item.subject.value.replace(
        'http://www.semanticweb.org/dlukas/ontologies/2017/1/catalhoyuk#',
        ''
      )
    }
  })
  return results
}
