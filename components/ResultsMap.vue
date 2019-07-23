<template>
  <section ref="pane" class="map">
    <div v-if="!showMap" class="no-map">
      There are too many results to display.<br />Apply filters to reduce the
      amount of results.
    </div>
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
  FILTER_PARAMS_TO_NAMES
} from '~/utils/constants'
import { getBuilding, getSpace } from '~/utils/rdf'

import ResultsMapLegend from '~/components/ResultsMapLegend'
import ResultsMapLayerSwitcher from '~/components/ResultsMapLayerSwitcher'
import BonesFindView from '~/components/BonesFindView'
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
      displayLimit: 600,
      buildingsShown: true,
      spacesShown: true,
      map: null,
      popup: null,
      polygonLayer: null
    }
  },
  computed: {
    showMap() {
      return true //this.$store.state.displayedIdentifiers.size <= this.displayLimit
    },
    buildingsGeoJSON() {
      return this.createGeoJSON(this.$store.state.buildings)
    },
    buildingOptions() {
      return {
        weight: 0.5,
        zIndex: 10,
        color: BUILDING_COLOR,
        fillColor: BUILDING_COLOR,
        fillOpacity: 1
      }
    },
    spacesGeoJSON() {
      return this.createGeoJSON(this.$store.state.spaces)
    },
    spaceOptions() {
      return {
        weight: 0.5,
        zIndex: 11,
        color: SPACE_COLOR,
        fillColor: SPACE_COLOR,
        fillOpacity: 1
      }
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
    individuals() {
      return this.$store.getters.displayedIndividuals
    }
  },
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'fetchedIndividuals') {
        this.updateMapPoints()
      }
    })
    this.checkMapObject()
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
    toggleLayer(e, visible) {
      console.log(e, visible)
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
        id: 'spaces',
        type: 'fill',
        source: 'spaces',
        paint: { 'fill-color': SPACE_COLOR }
      })
      this.drawPoints()
      this.fitMap()
    },
    updateMapPoints() {
      if (this.map)
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

      this.map.on('mouseleave', 'individuals', e => {
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
    overlayAdded(e) {
      const overlay = e.name
      if (overlay === 'Buildings') this.buildingsShown = true
      if (overlay === 'Spaces') this.spacesShown = true
    },
    overlayRemoved(e) {
      const overlay = e.name
      if (overlay === 'Buildings') this.buildingsShown = false
      if (overlay === 'Spaces') this.spacesShown = false
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
    showPopup(who) {
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
      if (this.popup) this.popup.remove()
      this.popup = new mapboxgl.Popup()
        .setLngLat(who.point.coordinates)
        .setHTML('<div id="vue-popup-content"></div>')
        .addTo(this.map)
      let Popup = Vue.extend(ResultsMapPopup)
      new Popup({
        router: this.$router, // CRITICAL or else crash on undefined
        propsData: {
          individual: who
        }
      }).$mount('#vue-popup-content')
    },
    async showBuilding(who) {
      if (this.polygonLayer)
        this.$refs.map.mapObject.removeLayer(this.polygonLayer)
      // get the building
      const building = await getBuilding(who.identifier)
      this.polygons = building
      this.updatePolygonLayer()
    },
    async showSpace(who) {
      if (this.polygonLayer)
        this.$refs.map.mapObject.removeLayer(this.polygonLayer)
      // get the space
      const space = await getSpace(who.identifier)
      this.polygons = space
      this.updatePolygonLayer()
    },
    updatePolygonLayer() {
      if (this.polygons.length > 0) {
        this.polygonLayer = this.$L.geoJSON(this.polygons, this.buildingOptions)
        this.$refs.map.mapObject.addLayer(this.polygonLayer)
        this.$refs.map.mapObject.fitBounds(this.polygonLayer.getBounds())
      } else {
        this.fitMap()
      }
    },
    resizePane(pct) {
      this.$refs.pane.style.flexBasis = pct
      if (this.map) this.map.resize()
    },
    onLegendToggled() {
      this.drawPoints()
    },
    onLayerSwitched(e) {
      console.log(e)
      const layer = e.name
      const visible = e.toggled ? 'visible' : 'none'
      if (!this.map.getLayer(layer)) return
      this.map.setLayoutProperty(layer, 'visibility', visible)
    },
    fitMap() {
      if (!this.map) return
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
    },
    checkMapObject() {
      this.checkMap = setInterval(() => {
        if (this.$refs.map) {
          clearInterval(this.checkMap)
          this.fitMap()
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.no-map {
  display: grid;
  font-size: 2rem;
  height: 100%;
  place-content: center;
  text-align: center;
}
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
  padding: 0.25rem 0.5rem;
  position: absolute;
}
</style>
