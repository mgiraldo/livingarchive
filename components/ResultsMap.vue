<template>
  <section ref="pane" class="map">
    <div v-if="!showMap" class="no-map">
      There are too many results to display.<br />Apply filters to reduce the
      amount of results.
    </div>
    <no-ssr>
      <l-map v-if="showMap" ref="map">
        <l-tile-layer
          v-for="(layer, index) in tilelayers"
          :key="'layer-' + index"
          :url="layer.url"
          :options="layer.options"
        ></l-tile-layer>
        <l-control-scale
          position="topright"
          :imperial="false"
          :metric="true"
        ></l-control-scale>
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
              class="legend-toggle"
              @click="toggleLegend"
            >
              color by age
            </button>
            <button
              v-if="legendType === 'age'"
              class="legend-toggle"
              @click="toggleLegend"
            >
              color by sex
            </button>
          </div>
        </l-control>
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
      </l-map>
    </no-ssr>
  </section>
</template>

<script>
import wellknown from 'wellknown'

import {
  TILELAYERS,
  BUILDING_COLOR,
  FILTER_PARAMS_TO_NAMES
} from '~/utils/constants'
import { getBuilding } from '~/utils/rdf'
import { reprojectGeoJson } from '~/utils/geo'

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
      polygonLayer: null
    }
  },
  computed: {
    showMap() {
      return this.$store.state.displayedIdentifiers.size <= this.displayLimit
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
        this.fitMap()
      }
    })
    this.checkMapObject()
  },
  methods: {
    selectMarker(who) {
      this.$refs[who.identifier][0].mapObject.openPopup()
    },
    async showBuilding(who) {
      if (this.polygonLayer)
        this.$refs.map.mapObject.removeLayer(this.polygonLayer)
      // get the building
      const building = await getBuilding(who.identifier)
      const polygons = []
      if (building && building.length) {
        building.forEach(shape => {
          let parsed = wellknown.parse(shape)
          if (parsed) {
            let projected = reprojectGeoJson(parsed)
            if (projected.type !== 'Point') {
              polygons.push(projected)
            }
          }
        })
      }
      this.polygons = polygons
      this.updatePolygonLayer()
    },
    updatePolygonLayer() {
      if (this.polygons.length > 0) {
        this.polygonLayer = L.geoJSON(this.polygons, {
          style: function() {
            return {
              weight: 1,
              color: BUILDING_COLOR,
              fillColor: BUILDING_COLOR,
              fillOpacity: 0.5
            }
          }
        })
        this.$refs.map.mapObject.addLayer(this.polygonLayer)
        this.$refs.map.mapObject.fitBounds(this.polygonLayer.getBounds())
      } else {
        this.fitMap()
      }
    },
    resizePane(pct) {
      this.$refs.pane.style.flexBasis = pct
      if (this.$refs.map) this.$refs.map.mapObject.invalidateSize()
    },
    toggleLegend() {
      this.$store.commit('toggledLegend')
    },
    fitMap() {
      if (this.$refs.map && this.$store.state.points.length > 0) {
        this.$refs.map.mapObject.fitBounds(this.$store.state.points)
      }
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
.legend {
  background-color: transparentize($global-background-color, 0.25);
  border-radius: 0.25rem;
  list-style-type: none;
  margin-right: 1rem;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;

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
