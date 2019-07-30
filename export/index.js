const csvjson = require('csvjson')

import { parseParams } from '../utils/params'
import { FILTER_PARAMS_TO_NAMES } from '../utils/constants'
import { getAllIndividuals } from '../utils/elastic'

export default async (req, res, next) => {
  // console.log('originalUrl', req.originalUrl)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  let path = req.originalUrl.replace('/export', '')

  let csv = path.startsWith('/csv')
  let json = path.startsWith('/json')
  let geojson = path.startsWith('/geojson')

  if (!csv && !json && !geojson) {
    res.end('Invalid')
  }

  let queryString = path
    .replace('/csv', '')
    .replace('/json', '')
    .replace('/geojson', '')

  if (queryString.startsWith('/')) queryString = queryString.substring(1)

  let params

  if (queryString.length) params = parseParams({ state: queryString })

  const state = createState(params)
  const filters = createFilters(state)

  const { individuals } = await getBaseIndividuals({
    filters
  })

  let results = Object.values(individuals).map(i => {
    if (i.point.coordinates) {
      i.latitude = i.point.coordinates[1]
      i.longitude = i.point.coordinates[0]
    }
    delete i.point
    return i
  })

  if (json) {
    res.end(JSON.stringify(results))
  }
  if (geojson) {
    let resultsGeo = createGeoJSON(results)
    res.end(JSON.stringify(resultsGeo))
  }
  if (csv) {
    res.end(
      csvjson.toCSV(results, {
        headers: 'key',
        delimiter: ',',
        wrap: false
      })
    )
  }
}

const createState = params => {
  let state = {}
  for (let param in FILTER_PARAMS_TO_NAMES) {
    const agg = FILTER_PARAMS_TO_NAMES[param].agg
    const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
    const [paramArray] = params
      ? params
          .filter(filter => filter.hasOwnProperty(agg))
          .map(item => item[agg])
      : []
    state['checked' + storeName] = paramArray
  }
  return state
}

const createFilters = state => {
  const filters = {}
  for (let param in FILTER_PARAMS_TO_NAMES) {
    const agg = FILTER_PARAMS_TO_NAMES[param].agg
    const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
    filters[agg] = state['checked' + storeName]
  }
  return filters
}

const getBaseIndividuals = async ({ filters }) => {
  const { individuals, points, aggs, count } = await getAllIndividuals({
    filters
  })
  return { individuals, points, aggs, count }
}

const createGeoJSON = results => {
  let geoJSON = {
    type: 'FeatureCollection',
    features: []
  }
  if (results.length > 0) {
    results.forEach(item => {
      let latitude = item.latitude
      let longitude = item.longitude
      delete item.latitude
      delete item.longitude
      let feature = {
        type: 'Feature',
        properties: item,
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      }
      geoJSON.features.push(feature)
    })
  }
  return geoJSON
}
