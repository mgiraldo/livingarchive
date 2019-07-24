import { parseParams } from '../utils/params'
import { FILTER_PARAMS_TO_NAMES } from '../utils/constants'
import { getAllIndividuals } from '../utils/elastic'

export default async (req, res, next) => {
  console.log(req.path)

  let path = req.path.replace('/', '')

  let params

  if (path.length) params = parseParams({ state: path })

  const state = createState(params)
  const filters = createFilters(state)

  console.log(filters)

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

  res.send(results)
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
