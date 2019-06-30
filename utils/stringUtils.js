import { RDF_PLACEHOLDER } from './constants'

export const cleanString = (str, extra) => {
  if (typeof str !== 'string') return str
  str = str.replace(RDF_PLACEHOLDER, '')
  str = extra ? str.replace(extra, '') : str
  return str
}
