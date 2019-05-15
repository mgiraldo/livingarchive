import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'

export const parseParams = params => {
  let state = params.state.split('|')
  let filters = []
  state.forEach(filter => {
    filters.push(parseFilter(filter))
  })
  return filters
}

/* receives a string of type key:value1,value2,value3 and returns {key:[value1,value2,value3]}  */
const parseFilter = filterStr => {
  // empty stuff nothing to see
  if (filterStr.length === 0) return false
  // only the key with no values
  if (filterStr.indexOf(':') === -1)
    return { [FILTER_PARAMS_TO_NAMES[filterStr]]: [] }
  let [key, valuesStr] = filterStr.split(':')
  return {
    [FILTER_PARAMS_TO_NAMES[key]]: valuesStr
      .split(',')
      .filter(v => v.trim() !== '')
      .map(v => Number(v))
  }
}
