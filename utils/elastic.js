import bodybuilder from 'bodybuilder'
import axios from 'axios'
import https from 'https'
import wellknown from 'wellknown'
import center from '@turf/center'

import { RDF_SEXES, RDF_AGES, ELASTIC_AGGS } from './constants'
import { reprojectGeoJson } from './geo'
import { cleanString } from './stringUtils'

const querySize = 6000

const performESQuery = async query => {
  const instance = axios.create({
    // this ignores self-signed https
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
    // end ignore self-signed https
    headers: {
      Accept: 'application/json'
    }
  })

  console.log(JSON.stringify(query))

  const results = await instance.get(
    process.env.ELASTIC_ENDPOINT + '/individuals/_search',
    {
      params: {
        source: query,
        source_content_type: 'application/json'
      }
    }
  )

  return results
}

const buildQuery = params => {
  let query = bodybuilder()
  query = query.size(querySize)
  if (params.source) query = query.rawOption('_source', params.source)
  query = query.query('match_all', {})
  if (params.filters) {
    params.filters.forEach(filter => {
      query = query.filter('terms', filter.type, filter.value)
    })
  }
  query = query.filter('exists', 'field', 'spatial_list') // obligating spatial for now
  ELASTIC_AGGS.forEach(agg => {
    query = query.agg('terms', agg + '.keyword')
  })
  return query.build()
}

export const getIndividuals = async ({ limit = 0, filters }) => {
  const sources = [
    'level',
    'phase',
    'identifier',
    'description',
    'sex',
    'spatial_list',
    'age',
    'discussion',
    'individual',
    'unit'
  ]

  let esFilters = []

  let ages = filters.ages ? Array.from(filters.ages) : []
  let sexes = filters.sexes ? Array.from(filters.sexes) : []

  let ageFilter = ages.map(age =>
    !isNaN(age) ? Object.keys(RDF_AGES.values)[age] : ''
  )
  if (ageFilter.length)
    esFilters.push({ type: 'age.keyword', value: ageFilter })

  let sexFilter = sexes.map(sex =>
    !isNaN(sex) ? Object.keys(RDF_SEXES.values)[sex] : ''
  )
  if (sexFilter.length)
    esFilters.push({ type: 'sex.keyword', value: sexFilter })

  let params = {
    source: sources,
    filters: esFilters
  }
  let query = buildQuery(params)
  let queryResults = await performESQuery(query)
  const count = queryResults.data.hits.total.value
  let aggs = getAggregations(queryResults.data.aggregations)
  let temp = queryResults.data.hits.hits.map(hit => {
    let individual = {}
    sources.forEach(source => {
      individual[source] = cleanString(hit._source[source])
    })
    return individual
  })

  let individuals = {}
  let points = []
  // TODO: remove extra looping
  temp.forEach(element => {
    if (!element.spatial_list || element.spatial_list.length === 0) return // NOTE: ignore individuals without latlons
    let identifier = element.identifier
    if (individuals[identifier] === undefined) {
      // create a point for the bones in the first spatial
      let point = reprojectGeoJson(wellknown.parse(element.spatial_list[0]))
      if (point.type !== 'Point') {
        point = center(point).geometry
      }
      individuals[identifier] = element
      individuals[identifier].skeleton = element.spatial_list
      individuals[identifier].point = JSON.parse(JSON.stringify(point))
      points.push(point.coordinates)
    } else {
      individuals[identifier].skeleton = individuals[
        identifier
      ].skeleton.concat(element.spatial_list)
    }
  })

  return { count, individuals, vars: sources, points, aggs }
}

const getAggregations = aggs => {
  let result = {}
  ELASTIC_AGGS.forEach(agg => {
    result[agg] = {}
    aggs['agg_terms_' + agg + '.keyword'].buckets.forEach(item => {
      result[agg][cleanString(item.key)] = item.doc_count
    })
  })
  // console.log(result)
  return result
}
