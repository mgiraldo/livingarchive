import bodybuilder from 'bodybuilder'
import axios from 'axios'
import https from 'https'
import wellknown from 'wellknown'
import center from '@turf/center'

import {
  RDF_SEXES,
  RDF_AGES,
  FILTER_PARAMS_TO_NAMES,
  EMPTY_LONLAT
} from './constants'
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

  let aggs = getAggregations(results.data.aggregations)

  return {
    results: results.data.hits.hits,
    count: results.data.hits.total.value,
    aggs
  }
}

const buildQuery = params => {
  const elasticAggs = Object.values(FILTER_PARAMS_TO_NAMES).map(
    param => param.agg
  )
  let query = bodybuilder()
  query = query.size(600)
  if (params.source) query = query.rawOption('_source', params.source)
  query = query.query('match_all', {})
  if (params.filters) {
    params.filters.forEach(filter => {
      query = query.filter('terms', filter.type, filter.value)
    })
  }
  // query = query.filter('exists', 'field', 'spatial_list') // obligating spatial for now
  elasticAggs.forEach(agg => {
    query = query.agg('terms', agg + '.keyword', { size: querySize })
  })
  return query.build()
}

const parseFilters = filters => {
  // console.log('elastic:', filters)
  let esFilters = []

  for (let param in FILTER_PARAMS_TO_NAMES) {
    const agg = FILTER_PARAMS_TO_NAMES[param].agg
    const filter = filters[agg] ? Array.from(filters[agg]) : []
    if (filter.length) esFilters.push({ type: agg + '.keyword', value: filter })
  }

  return esFilters
}

/**
 * Get a compacted version of the individuals that we then compared to the store
 * @param {*} param0 the filters to apply
 * @returns {object} the results in form `{ identifiers, aggs, count }`
 */
export const getFilteredIndividuals = async ({ filters }) => {
  const source = 'individual'
  const esFilters = parseFilters(filters)

  let query = buildQuery({
    source: [source],
    filters: esFilters
  })

  const { results, aggs, count } = await performESQuery(query)

  let identifiers = results.map(hit => cleanString(hit._source[source]))

  return { identifiers, aggs, count }
}

/**
 * Get a compacted version of the individuals that we then compared to the store
 * @param {*} param0 the filters to apply
 * @returns {object} the results in form `{ count, individuals, vars: sources, points, aggs }`
 */
export const getAllIndividuals = async ({ filters }) => {
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

  const esFilters = parseFilters(filters)

  let query = buildQuery({
    source: sources,
    filters: esFilters
  })

  const { results, aggs, count } = await performESQuery(query)

  let temp = results.map(hit => {
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
    let identifier = element.individual
    if (individuals[identifier] === undefined) {
      individuals[identifier] = element
      individuals[identifier].skeleton = new Set()
      let point = wellknown.parse(EMPTY_LONLAT)
      individuals[identifier].point = point
      // create a point for the bones in the first spatial
      if (element.spatial_list && element.spatial_list.length > 0) {
        point = reprojectGeoJson(wellknown.parse(element.spatial_list[0]))
        if (point.type !== 'Point') {
          point = center(point).geometry
        }
        for (let bone of element.spatial_list) {
          individuals[identifier].skeleton.add(bone)
        }
        individuals[identifier].point = JSON.parse(JSON.stringify(point))
      }
      points.push(point.coordinates)
    } else {
      for (let bone of element.spatial_list) {
        individuals[identifier].skeleton.add(bone)
      }
    }
  })

  return { count, individuals, vars: sources, points, aggs }
}

const getAggregations = aggs => {
  let result = {}
  const elasticAggs = Object.values(FILTER_PARAMS_TO_NAMES).map(
    param => param.agg
  )
  elasticAggs.forEach(agg => {
    result[agg] = {}
    aggs['agg_terms_' + agg + '.keyword'].buckets.forEach(item => {
      result[agg][cleanString(item.key)] = item.doc_count
    })
  })
  // console.log(result)
  return result
}
