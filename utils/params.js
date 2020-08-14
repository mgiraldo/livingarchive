import { FILTER_PARAMS_TO_NAMES } from './constants'

// TODO: properly sanitize querystring

export const parseParams = (params) => {
  // console.log(params)
  let state = decodeURIComponent(params.state).split('|')
  let filters = []
  state.forEach((filter) => {
    filters.push(parseFilter(decodeURIComponent(filter)))
  })
  return filters
}

/* receives a string of type key:value1,value2,value3 and returns {key:[value1,value2,value3]}  */
const parseFilter = (filterStr) => {
  // console.log(filterStr)
  // empty stuff nothing to see
  if (filterStr.length === 0) return false
  // only the key with no values
  if (filterStr.indexOf(':') === -1)
    return { [FILTER_PARAMS_TO_NAMES[filterStr].agg]: [] }
  let [key, valuesStr] = filterStr.split(':')
  return {
    [FILTER_PARAMS_TO_NAMES[key].agg]: valuesStr
      .split(',')
      .filter((v) => v.trim() !== ''),
  }
}
