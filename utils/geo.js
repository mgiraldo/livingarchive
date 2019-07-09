import proj4 from 'proj4'

import { PROJ4_DEFS } from '~/utils/constants'

export const reprojectGeoJson = geoJson => {
  let newGeoJson = JSON.parse(JSON.stringify(geoJson))
  if (!newGeoJson) return
  switch (newGeoJson.type) {
    case 'Point':
      newGeoJson.coordinates = reprojectPoint(newGeoJson.coordinates)
      return newGeoJson
    case 'MultiPolygon':
    case 'Polygon':
      newGeoJson.coordinates = reprojectArray(
        newGeoJson.coordinates,
        newGeoJson.type === 'Polygon' ? 1 : 2
      )
      return newGeoJson
  }
}
export const reprojectPoint = coords => {
  proj4.defs(PROJ4_DEFS)
  return proj4('catalhoyuk', 'EPSG:4326', coords)
}
export const reprojectArray = (coords, levelsDeep) => {
  // based on https://github.com/Leaflet/Leaflet/blob/61e49eef24a3ba98c187248628a4584fd4e0a5b7/src/layer/GeoJSON.js
  let coordinates = []
  for (let i = 0, len = coords.length, latlng; i < len; i++) {
    latlng = levelsDeep
      ? reprojectArray(coords[i], levelsDeep - 1)
      : reprojectPoint(coords[i])
    coordinates.push(latlng)
  }
  return coordinates
}
