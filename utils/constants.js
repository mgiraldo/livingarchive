import { SORTED_LEVELS } from './sortedLevels'

export const RDF_PLACEHOLDER =
  'http://www.semanticweb.org/dlukas/ontologies/2017/1/catalhoyuk#'

export const RDF_PREFIXES = `PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl:    <http://www.w3.org/2002/07/owl#>
PREFIX catalhoyuk:    <${RDF_PLACEHOLDER}>
PREFIX : <${RDF_PLACEHOLDER}>
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
`

export const RDF_TIMEOUT = 20000

export const MAX_TEXT_LENGTH = 80 // for truncation behind More...
export const PAGE_SIZE = 20 // for infinte scroll
export const INFINITE_SCROLL_BUFFER = 200 // pixels

export const BONE_FILL_COLOR = 'hsla(42, 81%, 75%, 0.95)'
export const BONE_FILL_PARTIAL_COLOR = 'hsla(42, 81%, 90%, 0.95)'
export const BONE_STROKE_COLOR = 'hsla(33, 35%, 44%, 1)'
export const BUILDING_COLOR = 'hsla(33, 35%, 44%, 0.5)'
export const BUILDING_TEXT_COLOR = 'rgb(33, 33, 33)'
export const SPACE_COLOR = 'hsla(19, 35%, 44%, 0.5)'
export const SPACE_TEXT_COLOR = 'rgba(232, 232, 232, 0.5)'

/**
 * # `FILTER_PARAMS_TO_NAMES` is the basis of the structure of the application
 * The key corresponds to the URL parameter of the facet (eg: `a` for age)
 * Each sub-object is built according to the facet it represents in ElasticSearch:
 *
 * - `name`: name of the facet, displayed in the search controls pane (usually plural)
 * - `agg`: aggregation name in ElasticSearch
 * - `aggType`: the type of aggregation in ElasticSearch. Supported value: 'keyword'
 * - `queryType`: the type of query to be performed in ElasticSearch. Supported values: 'keyword', 'starts_with', 'range' ('range' value is a “fake” range implemented for Levels that is built from a start and end level)
 * - `storeName`: name of the Vuex store object the application will put facet data in (will be prefixed with 'checked' in the Vuex store)
 * - `explainedName`: displayed in `components/ResultsExplained.vue` (below the search result count)
 * - `colors`: (optional) the name-value color pairs for each of the facet's values
 * - `rangeList`: (`queryType='range'` only) a sorted index-value object containing the discrete values of the facet (for long lists a separate constants file is recommended, as is used here for Levels)
 *
 * These parameters are parsed on each request in `utils/params.js` to build the required state of the application.
 *
 */
export const FILTER_PARAMS_TO_NAMES = {
  a: {
    name: 'Ages',
    agg: 'age',
    aggType: 'keyword',
    queryType: 'keyword',
    storeName: 'Ages',
    explainedName: 'Age',
    colors: {
      'Age not determinable': '#ccc',
      'Prenatal (pre-fullterm)': '#a6cee3',
      'neonate (birth - 2 months)': '#6AB0E4',
      'infant (2 months - 3 years)': '#2D88E4',
      'child (3-12)': '#0052C6',
      'adolescent(12-20)': '#002D87',
      'Adult (20+)': '#E6FFDE',
      'YA (20-35)': '#b2df8a',
      'MA (35-50)': '#77DA3E',
      'OA (50+)': '#2A870A',
    },
  },
  s: {
    name: 'Sexes',
    agg: 'sex',
    aggType: 'keyword',
    queryType: 'keyword',
    storeName: 'Sexes',
    explainedName: 'Sex',
    colors: {
      '?': '#aaa',
      'too young to determine': '#aaa',
      female: '#fc8d62',
      'female?': '#FDC5AE',
      male: '#8da0cb',
      'male?': '#B0C8FF',
    },
  },
  p: {
    name: 'Phases',
    agg: 'phase',
    aggType: 'keyword',
    queryType: 'keyword',
    storeName: 'Phases',
    explainedName: 'Phase',
    colors: null,
  },
  b: {
    name: 'Skeleton',
    agg: 'bones.bone',
    aggType: 'keyword',
    queryType: 'starts_with',
    startsWithPrefix: RDF_PLACEHOLDER,
    storeName: 'Skeleton',
    explainedName: 'Bone',
    colors: null,
  },
  l: {
    name: 'Levels',
    agg: 'level',
    aggType: 'keyword',
    queryType: 'range', // a fake range for KEYWORD types
    rangeList: SORTED_LEVELS,
    storeName: 'Levels',
    explainedName: 'Level',
    colors: null,
  },
}
export const EMPTY_LONLAT = 'Point (32.826886 37.668639)'

export const PROJ4_DEFS = [
  ['EPSG:32636', '+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs'],
  [
    'catalhoyuk',
    '+proj=tmerc +lat_0=1 +lon_0=40 +x_0=219545.552792 +y_0=-3524458.034545 +ellps=GRS80 +towgs84=0,0,0,-0.04396543,-0.04396543,0,0 +units=m +no_defs',
  ],
  [
    'catalhoyuk2',
    '+proj=tmerc +lat_0=0 +lon_0=36 +k=0.837564 +x_0=235345.552792 +y_0=-3496198.034545 +ellps=GRS80 +towgs84=0,0,0,-0.04396543,-0.04396543,0,0 +units=m +no_defs',
  ],
  [
    'catalhoyuk3',
    '+proj=tmerc +lat_0=32 +lon_0=37 +x_0=369184.729 +y_0=-635779.0741 +ellps=GRS80 +towgs84=0,0,0,-0.04396543,-0.04396543,0,0 +units=m +no_defs',
  ],
]

export const TILELAYERS = [
  {
    url:
      'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=' +
      process.env.MAPTILER_KEY,
    options: {
      name: 'Maptiler',
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
      minZoom: 0,
      maxNativeZoom: 22,
      maxZoom: 26,
    },
  },
  {
    url:
      'https://api.maptiler.com/maps/darkmatter/style.json?key=' +
      process.env.MAPTILER_KEY,
    options: {
      name: 'Maptiler',
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
    },
  },
]
