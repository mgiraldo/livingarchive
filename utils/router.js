import { FILTER_PARAMS_TO_NAMES } from './constants'

/**
 * Builds a URL query string based on the store state
 * @param {store, router} param0 from Nuxt router
 */
export const updateRouter = ({ store, router }) => {
  let state = []
  for (let param in FILTER_PARAMS_TO_NAMES) {
    const storeName = FILTER_PARAMS_TO_NAMES[param].storeName
    state.push(
      [param, [...store.state['checked' + storeName]].join(',')].join(':')
    )
  }
  router.push({
    name: store.state.viewMode + '-state',
    params: { state: state.join('|') }
  })
}
