<template>
  <section ref="pane" class="map">
    <no-ssr>
      <div ref="map" class="map-wrapper">
        <mapbox
          ref="mapbox"
          access-token=""
          :map-options="{
            style: tilelayers[1].url,
            center: [32.826886, 37.668639],
            zoom: 16
          }"
          :scale-control="{
            show: true,
            position: 'top-left'
          }"
          @map-init="mapInited"
          @map-load="mapLoaded"
        >
        </mapbox>
        <results-map-layer-switcher @change="onLayerSwitched" />
        <results-map-legend @toggled="onLegendToggled" />
      </div>
    </no-ssr>
  </section>
</template>

<script>
import Vue from 'vue'

import {
  TILELAYERS,
  BUILDING_COLOR,
  SPACE_COLOR,
  BUILDING_TEXT_COLOR,
  SPACE_TEXT_COLOR,
  FILTER_PARAMS_TO_NAMES
} from '~/utils/constants'
import { getShape } from '~/utils/rdf'

import ResultsMapLegend from '~/components/ResultsMapLegend'
import ResultsMapLayerSwitcher from '~/components/ResultsMapLayerSwitcher'
import ResultsMapPopup from '~/components/ResultsMapPopup'

export default {
  components: {
    ResultsMapLegend,
    ResultsMapLayerSwitcher
  },
  props: {},
  data() {
    return {
      tilelayers: TILELAYERS,
      polygons: [],
      map: null,
      popup: null,
      polygonLayer: null,
      unsubscribe: null,
      buildingOptions: {
        weight: 0.5,
        zIndex: 10,
        color: BUILDING_COLOR,
        fillColor: BUILDING_COLOR,
        fillOpacity: 1
      },
      spaceOptions: {
        weight: 0.5,
        zIndex: 11,
        color: SPACE_COLOR,
        fillColor: SPACE_COLOR,
        fillOpacity: 1
      }
    }
  },
  computed: {
    buildingsGeoJSON() {
      return this.createGeoJSON(this.$store.state.buildings)
    },
    spacesGeoJSON() {
      return this.createGeoJSON(this.$store.state.spaces)
    },
    legendType() {
      return this.$store.state.legendType
    },
    legend() {
      if (this.$store.state.legendType === 'age') {
        return FILTER_PARAMS_TO_NAMES.a.colors
      } else {
        return FILTER_PARAMS_TO_NAMES.s.colors
      }
    },
    individualCount() {
      return Object.keys(this.$store.getters.displayedIndividuals).length
    },
    individuals() {
      return this.$store.getters.displayedIndividuals
    }
  },
  mounted() {
    this.unsubscribe = this.$store.subscribe(mutation => {
      if (mutation.type === 'fetchedIndividuals') {
        this.updateMapPoints()
      }
    })
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    points() {
      const points = Object.values(this.individuals).map(i => {
        return {
          age: i.age,
          point: i.point,
          sex: i.sex,
          individual: i.individual,
          identifier: i.identifier
        }
      })
      return points
    },
    pointsGeoJSON() {
      const geo = this.points().map(p => {
        return { type: 'Feature', properties: p, geometry: p.point }
      })
      return this.createGeoJSON(geo)
    },
    mapInited(map) {
      // console.log('inited', map)
      this.map = map
    },
    mapLoaded(map) {
      this.map = map
      this.map.addSource('individuals', {
        type: 'geojson',
        data: this.pointsGeoJSON()
      })
      this.map.addSource('buildings', {
        type: 'geojson',
        data: this.buildingsGeoJSON
      })
      this.map.addSource('spaces', {
        type: 'geojson',
        data: this.spacesGeoJSON
      })
      this.map.addLayer({
        id: 'buildings',
        type: 'fill',
        source: 'buildings',
        paint: { 'fill-color': BUILDING_COLOR }
      })
      this.map.addLayer({
        id: 'buildings-labels',
        type: 'symbol',
        source: 'buildings',
        layout: {
          'text-field': ['get', 'id'],
          'text-variable-anchor': ['center'],
          'text-radial-offset': 0.5,
          'text-justify': 'auto',
          'text-size': ['interpolate', ['linear'], ['zoom'], 14, 0, 22, 12]
        },
        paint: {
          'text-color': BUILDING_TEXT_COLOR,
          'text-halo-color': BUILDING_COLOR
        }
      })
      this.map.addLayer({
        id: 'spaces',
        type: 'fill',
        source: 'spaces',
        paint: { 'fill-color': SPACE_COLOR }
      })
      this.map.addLayer({
        id: 'spaces-labels',
        type: 'symbol',
        source: 'spaces',
        layout: {
          'text-field': ['get', 'id'],
          'text-variable-anchor': ['top'],
          'text-radial-offset': 0.5,
          'text-justify': 'auto',
          'text-size': ['interpolate', ['linear'], ['zoom'], 14, 0, 22, 12]
        },
        paint: {
          'text-color': SPACE_TEXT_COLOR,
          'text-halo-color': SPACE_COLOR
        }
      })
      this.drawPoints()
      this.fitMap()
    },
    updateMapPoints() {
      if (!this.map) return
      if (this.popup) this.popup.remove()
      this.map.getSource('individuals').setData(this.pointsGeoJSON())
      this.fitMap()
    },
    drawPoints() {
      this.map.removeLayer('individuals')

      const colors = ['match', ['get', this.$store.state.legendType]]
      Object.keys(this.legend).forEach(key => {
        colors.push(key, this.legend[key])
      })
      colors.push('#aaa') // null color

      this.map.addLayer({
        id: 'individuals',
        type: 'circle',
        source: 'individuals',
        paint: {
          // make circles larger as the user zooms from z12 to z22
          'circle-radius': {
            base: 1.5,
            stops: [[12, 1.75], [22, 12]]
          },
          // color circles by legend type, using a match expression
          // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
          'circle-color': colors
        }
      })

      this.map.on('mouseenter', 'individuals', e => {
        if (e.features.length > 0) {
          this.map.getCanvas().style.cursor = 'pointer'
        }
      })

      this.map.on('mouseleave', 'individuals', () => {
        this.map.getCanvas().style.cursor = ''
      })

      this.map.on('click', e => {
        let features = this.map.queryRenderedFeatures(e.point, {
          layers: ['individuals']
        })

        if (!features.length) return

        // place it on the first one you find
        let feature = features[0]
        // Populate the popup and set its coordinates
        // based on the feature found.
        let individual = this.$store.state.individuals[
          feature.properties.individual
        ]
        this.showPopup(individual)
      })
    },
    createGeoJSON(geoArray) {
      let geoJSON = {
        type: 'FeatureCollection',
        features: []
      }
      if (geoArray.length > 0) {
        geoArray.forEach(feature => {
          geoJSON.features.push(feature)
        })
      }
      return geoJSON
    },
    highlightIndividual(who) {
      this.showPopup(who)
    },
    async showPopup(who) {
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl')

      if (this.popup) this.popup.remove()

      this.map.flyTo({ center: who.point.coordinates })

      this.popup = new mapboxgl.Popup()
        .setLngLat(who.point.coordinates)
        .setHTML('<div id="vue-popup-content">Loading...</div>')
        .addTo(this.map)

      // get bones
      let shape = await getShape(who.identifier)

      let Popup = Vue.extend(ResultsMapPopup)
      let popupInstance = new Popup({
        router: this.$router, // CRITICAL or else crash on undefined
        propsData: {
          individual: who,
          shape
        }
      })
      popupInstance.$mount('#vue-popup-content')
    },
    resizePane(pct) {
      if (pct) this.$refs.pane.style.flexBasis = pct
      if (this.map) this.map.resize()
    },
    onLegendToggled() {
      this.drawPoints()
    },
    onLayerSwitched(e) {
      const layer = e.name
      const visible = e.toggled ? 'visible' : 'none'
      if (!this.map.getLayer(layer)) return
      this.map.setLayoutProperty(layer, 'visibility', visible)
      this.map.setLayoutProperty(layer + '-labels', 'visibility', visible)
    },
    fitMap() {
      if (!this.map) return
      this.map.resize()
      const points = this.$store.state.points
      const xValues = points.map(point => point[0])
      const yValues = points.map(point => point[1])
      let minX = Math.min(...xValues)
      let minY = Math.min(...yValues)
      let maxX = Math.max(...xValues)
      let maxY = Math.max(...yValues)
      // console.log('bounds', minX, minY, maxX, maxY)
      this.map.fitBounds([[minX, minY], [maxX, maxY]], {
        padding: { top: 25, bottom: 25, left: 25, right: 25 }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  flex-basis: 50%;
}
.map-wrapper,
.mapboxgl-map {
  height: 100%;
  width: 100%;
}
.map-wrapper {
  position: relative;
}
</style>
<style lang="scss">
/* overriding/customising leaflet css is unscoped */
/* for overlays that are outside this scope */
.map-overlay {
  background-color: $global-background-color;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  overflow: auto;
  padding: 0.5rem;
  position: absolute;
}
</style>
