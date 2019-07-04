<template>
  <no-ssr>
    <mapbox
      ref="map"
      access-token=""
      :map-options="{
        center: [-122.420679, 37.772537],
        zoom: 13,
        style: {
          sources: {
            maptiler: {
              type: 'vector',
              tiles: [
                'https://api.maptiler.com/maps/basic/style.json?key=' + key
              ]
            },
            mapillary: {
              type: 'vector',
              tiles: [
                'https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt'
              ],
              minzoom: 6,
              maxzoom: 14
            },
            stamen: {
              type: 'raster',
              tiles: ['http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'],
              tileSize: 256,
              attribution: `Map tiles by <a target='_top' rel='noopener' href='http://stamen.com'>Stamen Design</a>, under <a target='_top' rel='noopener' href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a target='_top' rel='noopener' href='http://openstreetmap.org'>OpenStreetMap</a>, under <a target='_top' rel='noopener' href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>`
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'stamen',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        }
      }"
      @map-init="mapInited"
      @map-load="mapLoaded"
    >
    </mapbox>
  </no-ssr>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'

export default {
  head: {
    script: [
      { src: 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.0/mapbox-gl.js' }
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.0/mapbox-gl.css'
      }
    ]
  },
  components: { Mapbox },
  data() {
    return {
      key: process.env.MAPTILER_KEY
    }
  },
  methods: {
    mapInited(map) {
      // console.log('inited', map)
    },
    mapLoaded(map) {
      // console.log('loaded', map)
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  height: 100vh;
}
</style>
