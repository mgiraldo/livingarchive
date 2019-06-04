export const updateRouter = ({ store, router }) => {
  let ages = ['a', [...store.state.checkedAges].sort().join(',')].join(':')
  let sexes = ['s', [...store.state.checkedSexes].sort().join(',')].join(':')
  router.push({
    name: 'map-state',
    params: { state: [ages, sexes].join('|') }
  })
}