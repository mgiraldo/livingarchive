import bodybuilder from 'bodybuilder'
import axios from 'axios'
import https from 'https'
import wellknown from 'wellknown'

import { FILTER_PARAMS_TO_NAMES, EMPTY_LONLAT } from './constants'
import { reprojectGeoJson } from './geo'
import { cleanString } from './stringUtils'

const querySize = 6000

const filterPath =
  'filter_path=aggregations.*.buckets,hits.hits._source,hits.total.value'

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
    process.env.ELASTIC_URL + '/individuals/_search?' + filterPath,
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
  const elasticAggs = Object.values(FILTER_PARAMS_TO_NAMES)
  let query = bodybuilder()
  query = query.size(600)
  if (params.source) query = query.rawOption('_source', params.source)
  query = query.query('match_all', {})
  if (params.filters) {
    for (let param in FILTER_PARAMS_TO_NAMES) {
      const agg = FILTER_PARAMS_TO_NAMES[param]
      const filter = params.filters[agg.agg]
        ? Array.from(params.filters[agg.agg])
        : []
      if (filter.length) {
        switch (agg.queryType) {
          case 'keyword': {
            query = query.filter('terms', agg.agg + '.' + agg.queryType, filter)
            break
          }
          case 'range': {
            /*
            NOTE:
            Range accepts `filter=from` or `filter=from,to`.
            It also assumes that `agg.aggType` is 'keyword'
            */
            let from = filter[0]
            let to = filter[0]
            if (filter.length > 1) {
              to = filter[1]
            }
            const sortedValues = Object.values(agg.rangeList)
            let fromIndex = sortedValues.indexOf(from)
            let toIndex = sortedValues.indexOf(to)
            if (fromIndex === -1 || toIndex === -1) break
            if (fromIndex > toIndex) {
              let temp = toIndex
              toIndex = fromIndex
              fromIndex = temp
            }
            const rangeArray = sortedValues.slice(fromIndex, toIndex + 1)

            query = query.filter(
              'terms',
              agg.agg + '.' + agg.aggType,
              rangeArray
            )
            break
          }
          case 'starts_with': {
            filter.forEach(term => {
              query = query.filter(
                'match_phrase_prefix',
                agg.agg,
                agg.startsWithPrefix + term
              )
            })
            break
          }
        }
      }
    }
  }
  // query = query.filter('exists', 'field', 'spatial_list') // obligating spatial for now
  elasticAggs.forEach(agg => {
    query = query.agg('terms', agg.agg + '.' + agg.aggType, { size: querySize })
  })
  return query.build()
}

/**
 * Get a compacted version of the individuals that we then compared to the store
 * @param {*} param0 the filters to apply
 * @returns {object} the results in form `{ identifiers, aggs, count }`
 */
export const getFilteredIndividuals = async ({ filters }) => {
  const source = 'individual'

  let query = buildQuery({
    source: [source],
    filters
  })

  const { results, aggs, count } = await performESQuery(query)

  let identifiers = results.map(hit => cleanString(hit._source[source]))

  return { identifiers, aggs, count }
}

/**
 * Get a compacted version of the individuals that we then compared to the store
 * @param {*} param0 the filters to apply
 * @returns {object} the results in form `{ count, individuals, points, aggs }`
 */
export const getAllIndividuals = async ({ filters }) => {
  const sources = [
    'level',
    'phase',
    'identifier',
    'description',
    'sex',
    'wkt_point',
    'age',
    'individual',
    'unit'
  ]

  let query = buildQuery({
    source: sources,
    filters
  })

  const { results, aggs, count } = await performESQuery(query)

  let individuals = {}
  let points = []
  results.forEach(hit => {
    let individual = {}
    sources.forEach(source => {
      individual[source] = cleanString(hit._source[source])
    })
    let identifier = individual.individual
    individuals[identifier] = individual
    let point = wellknown.parse(EMPTY_LONLAT)
    if (individual.wkt_point) {
      let parsed = wellknown.parse(individual.wkt_point)
      // TODO: this is sketchy but reprojection is freaking out *only* in wkt_point (not polygons)
      if (parsed) {
        let [x, y] = parsed.coordinates
        parsed.coordinates[0] = y
        parsed.coordinates[1] = x
      }
      // END TODO
      let projected = reprojectGeoJson(parsed)
      if (projected && projected.type === 'Point') {
        point = projected
      }
    }
    individuals[identifier].point = point
    points.push(point.coordinates)
  })

  return { count, individuals, points, aggs }
}

const getAggregations = aggs => {
  let result = {}
  const elasticAggs = Object.values(FILTER_PARAMS_TO_NAMES)
  elasticAggs.forEach(agg => {
    result[agg.agg] = {}
    aggs['agg_terms_' + agg.agg + '.' + agg.aggType].buckets.forEach(item => {
      result[agg.agg][cleanString(item.key)] = item.doc_count
    })
  })
  // console.log(result)
  return result
}
