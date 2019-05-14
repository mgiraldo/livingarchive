// export const RDF_URL =
//   'http://lac.catalhoyuk.com:8080/rdf4j-server/repositories/catalhoyuk'
export const RDF_URL =
  'http://lac.catalhoyuk.com/blazegraph/namespace/catalhoyuk/sparql'

export const RDF_PREFIXES = `PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl:    <http://www.w3.org/2002/07/owl#>
PREFIX catalhoyuk:    <http://www.semanticweb.org/dlukas/ontologies/2017/1/catalhoyuk#>
PREFIX : <http://www.semanticweb.org/dlukas/ontologies/2017/1/catalhoyuk#>
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
`

export const RDF_TIMEOUT = 10000

export const RDF_PLACEHOLDER =
  'http://www.semanticweb.org/dlukas/ontologies/2017/1/catalhoyuk#'

export const PROJ4_DEFS = [
  ['EPSG:32636', '+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs'],
  [
    'catalhoyuk',
    '+proj=tmerc +lat_0=1 +lon_0=40 +x_0=219545.552792 +y_0=-3524458.034545 +ellps=GRS80 +towgs84=0,0,0,-0.04396543,-0.04396543,0,0 +units=m +no_defs'
  ],
  [
    'catalhoyuk2',
    '+proj=tmerc +lat_0=0 +lon_0=36 +k=0.837564 +x_0=235345.552792 +y_0=-3496198.034545 +ellps=GRS80 +towgs84=0,0,0,-0.04396543,-0.04396543,0,0 +units=m +no_defs'
  ]
]

export const TILELAYERS = [
  {
    url:
      'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=' +
      process.env.MAPTILER_KEY,
    options: {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
      minZoom: 0,
      maxNativeZoom: 22,
      maxZoom: 26
    }
  }
]

export const RDF_AGES = {
  'Age not determinable': '#ccc',
  'Prenatal (pre-fullterm)': '#a6cee3',
  'neonate (birth - 2 months)': '#6AB0E4',
  'infant (2 months - 3 years)': '#2D88E4',
  'child (3-12)': '#0052C6',
  'adolescent(12-20)': '#002D87',
  'Adult (20+)': '#E6FFDE',
  'YA (20-35)': '#b2df8a',
  'MA (35-50)': '#77DA3E',
  'OA (50+)': '#2A870A'
}

export const RDF_SEXES = {
  female: '#fc8d62',
  'female?': '#FDC5AE',
  male: '#8da0cb',
  'male?': '#B0C8FF',
  'too young to determine': '#aaa'
}

export const BONE_FILL_COLOR = 'hsla(42, 81%, 75%, 0.95)'
export const BONE_FILL_PARTIAL_COLOR = 'hsla(42, 81%, 90%, 0.95)'
export const BONE_STROKE_COLOR = 'hsla(33, 35%, 44%, 1)'
