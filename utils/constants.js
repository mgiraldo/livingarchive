export const RDF_URL =
  'http://lac.catalhoyuk.com:8080/rdf4j-server/repositories/catalhoyuk'
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
      maxZoom: 26
    }
  }
]
