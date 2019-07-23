<template>
  <section ref="pane" class="map">
    <div v-if="!showMap" class="no-map">
      There are too many results to display.<br />Apply filters to reduce the
      amount of results.
    </div>
    <no-ssr>
      <!-- <l-map
        v-if="showMap"
        ref="map"
        @overlayadd="overlayAdded"
        @overlayremove="overlayRemoved"
      >
        <l-tile-layer
          v-for="(layer, index) in tilelayers"
          :key="'layer-' + index"
          :url="layer.url"
          :attribution="layer.attribution"
          :name="layer.name"
          :options="layer.options"
        ></l-tile-layer>
        <l-control-scale
          position="topright"
          :imperial="false"
          :metric="true"
        ></l-control-scale>
        <l-control-layers position="topright"></l-control-layers>
        <l-geo-json
          layer-type="overlay"
          name="Spaces"
          :geojson="spacesGeoJSON"
          :options-style="spaceOptions"
        >
        </l-geo-json>
        <l-geo-json
          layer-type="overlay"
          name="Buildings"
          :geojson="buildingsGeoJSON"
          :options-style="buildingOptions"
        >
        </l-geo-json>
        <l-layer-group layer-type="overlay" name="Individuals">
          <l-marker
            v-for="(individual, index) in individuals"
            :key="'ind-' + index"
            :ref="individual.identifier"
            :data-identifier="individual.identifier"
            :lat-lng="individual.point.coordinates"
          >
            <l-icon class-name="icon">
              <map-marker :type="legendType" :individual="individual" />
            </l-icon>
            <l-popup max-width="15rem" class="popup">
              <dl>
                <dt>Identifier</dt>
                <dd>
                  <nuxt-link
                    :to="`/skeleton/${individual.identifier}`"
                    target="_blank"
                    >{{ individual.identifier }}</nuxt-link
                  >
                </dd>
                <dt>Skeleton</dt>
                <dd class="bones">
                  <bones-find-view :shape="individual.skeleton" />
                </dd>
                <dt>Sex</dt>
                <dd
                  class="bordered"
                  :style="'border-color:' + sexColors[individual.sex]"
                >
                  {{ individual.sex }}
                </dd>
                <dt>Age</dt>
                <dd
                  class="bordered"
                  :style="'border-color:' + ageColors[individual.age]"
                >
                  {{ individual.age }}
                </dd>
                <dt>Phase</dt>
                <dd>
                  {{ individual.phase }}
                </dd>
                <dt>Level</dt>
                <dd>
                  {{ individual.level }}
                </dd>
              </dl>
            </l-popup>
          </l-marker>
        </l-layer-group>
        <l-control class-name="legend" position="bottomleft">
          <div class="legend">
            <strong>{{ legendType }}</strong>
            <transition-group name="legend-list" class="legend-list" tag="ul">
              <li
                v-for="(color, name, index) in legend"
                :key="index + name"
                class="legend-list-item"
              >
                <filter-color-item :name="name" :color="color" />
              </li>
            </transition-group>
            <button
              v-if="legendType === 'sex'"
              class="filter-button"
              @click="toggleLegend"
            >
              color by age
            </button>
            <button
              v-if="legendType === 'age'"
              class="filter-button"
              @click="toggleLegend"
            >
              color by sex
            </button>
          </div>
        </l-control>
      </l-map> -->
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
        <div class="map-overlay layer-switcher">
          <div class="map-overlay__title">Layers</div>
          <ul class="layer-switcher__list">
            <li class="layer-switcher__checkbox">
              <input
                id="ch-individuals"
                type="checkbox"
                value="individuals"
                checked="checked"
                @change="toggleLayer('individuals', $event.target.checked)"
              />
              <label for="ch-individuals">
                Individuals
              </label>
            </li>
            <li class="layer-switcher__checkbox">
              <input
                id="ch-spaces"
                type="checkbox"
                value="spaces"
                checked="checked"
                @change="toggleLayer('spaces', $event.target.checked)"
              />
              <label for="ch-spaces">
                Spaces
              </label>
            </li>
            <li class="layer-switcher__checkbox">
              <input
                id="ch-buildings"
                type="checkbox"
                value="buildings"
                checked="checked"
                @change="toggleLayer('buildings', $event.target.checked)"
              />
              <label for="ch-buildings">
                Buildings
              </label>
            </li>
          </ul>
        </div>
        <div ref="legend" class="map-overlay legend">
          <div class="map-overlay__title">{{ legendType }}</div>
          <transition-group name="legend-list" class="legend-list" tag="ul">
            <li
              v-for="(color, name, index) in legend"
              :key="index + name"
              class="legend-list-item"
            >
              <filter-color-item :name="name" :color="color" />
            </li>
          </transition-group>
          <button class="filter-button" @click="toggleLegend">
            color by {{ legendType === 'sex' ? 'age' : 'sex' }}
          </button>
        </div>
      </div>
    </no-ssr>
  </section>
</template>

<script>
import {
  TILELAYERS,
  BUILDING_COLOR,
  SPACE_COLOR,
  FILTER_PARAMS_TO_NAMES
} from '~/utils/constants'
import { getBuilding, getSpace } from '~/utils/rdf'

import MapMarker from '~/components/MapMarker'
import FilterColorItem from '~/components/FilterColorItem'
import BonesFindView from '~/components/BonesFindView'

export default {
  components: {
    MapMarker,
    FilterColorItem,
    BonesFindView
  },
  props: {},
  data() {
    return {
      tilelayers: TILELAYERS,
      polygons: [],
      displayLimit: 600,
      ageColors: FILTER_PARAMS_TO_NAMES.a.colors,
      sexColors: FILTER_PARAMS_TO_NAMES.s.colors,
      buildingsShown: true,
      spacesShown: true,
      map: null,
      polygonLayer: null
    }
  },
  computed: {
    showMap() {
      return this.$store.state.displayedIdentifiers.size <= this.displayLimit
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
    individuals() {
      return this.$store.getters.displayedIndividuals
    },
    legend() {
      if (this.$store.state.legendType === 'age') {
        return FILTER_PARAMS_TO_NAMES.a.colors
      } else {
        return FILTER_PARAMS_TO_NAMES.s.colors
      }
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
    toggleLayer(e) {
      console.log(e)
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
            base: 1.75,
            stops: [[12, 2], [22, 12]]
          },
          // color circles by legend type, using a match expression
          // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
          'circle-color': colors
        }
      })
      this.fitMap()
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
    selectMarker(who) {
      this.$refs[who.identifier][0].mapObject.openPopup()
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
    toggleLegend() {
      this.$store.commit('toggledLegend')
      this.drawPoints()
    },
    fitMap() {
      if (!this.map) return
      const points = this.$store.state.points
      const xValues = points.map(point => point[0])
      const yValues = points.map(point => point[1])
      // console.log('points', points)
      let minX = Math.min(...xValues)
      let minY = Math.min(...yValues)
      let maxX = Math.max(...xValues)
      let maxY = Math.max(...yValues)
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
.map-overlay {
  background-color: transparentize($global-background-color, 0.35);
  border-radius: 0.25rem;
  font-size: 0.9rem;
  overflow: auto;
  padding: 0.25rem 0.5rem;
  position: absolute;
}
.map-overlay__title {
  font-weight: bold;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}
.layer-switcher {
  margin-left: 0.5rem;
  margin-top: 3rem;
  left: 0;
  top: 0;
}
.layer-switcher__list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.layer-switcher__checkbox {
  @include custom-checkbox;
}
.legend {
  bottom: 0;
  left: 0;
  list-style-type: none;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 3rem;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .legend-list-item {
    display: inline-block;
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    transition: all 0.5s;
  }

  .legend-list-item:last-child {
    margin-bottom: 0;
  }

  .legend-list-enter,
  .legend-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .legend-list-leave-active {
    position: absolute;
  }

  .dot {
    border-radius: 50%;
    height: 1rem;
    margin-right: 0.25rem;
    width: 1rem;
  }
}
.popup {
  .bordered {
    border-left: 0.75rem solid transparent;
    padding-left: 0.25rem;
  }
  dt {
    color: $global-secondary-text-color;
  }
  dd {
    margin-bottom: 0.5rem;
  }
  .bones {
    height: 15rem;
    width: 15rem;
  }
  .discussion {
    max-height: 5rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
<style lang="scss">
/* overriding/customising leaflet css is unscoped */
.icon {
  border-radius: 50%;
  box-shadow: 0 0 0.1rem $global-background-color;
}
.leaflet-popup-content-wrapper {
  background-color: $global-background-color;
  color: $global-text-color;

  a {
    color: $global-link-color;
  }
}
.leaflet-popup-tip {
  background-color: $global-background-color;
}
</style>
