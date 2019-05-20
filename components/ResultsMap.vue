<template>
  <section ref="pane" class="map">
    <no-ssr>
      <l-map ref="map">
        <l-tile-layer
          v-for="(layer, index) in tilelayers"
          :key="index"
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
                :key="index"
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
          :key="index"
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
              <dd>
                {{ individual.sex }}
                <button type="button" :value="individual.sex" @click="onlySex">
                  ONLY
                </button>
              </dd>
              <dt>Age</dt>
              <dd>
                {{ individual.age }}
                <button type="button" :value="individual.age" @click="onlyAge">
                  ONLY
                </button>
              </dd>
            </dl>
          </l-popup>
        </l-marker>
      </l-map>
    </no-ssr>
  </section>
</template>

<script>
import { TILELAYERS } from '~/utils/constants'

import { updateRouter } from '~/utils/router'

import MapMarker from '~/components/MapMarker'
import FilterColorItem from '~/components/FilterColorItem'
import BonesFindView from '~/components/BonesFindView'

export default {
  components: {
    MapMarker,
    FilterColorItem,
    BonesFindView
  },
  props: {
    individuals: { type: Object, required: true }
  },
  data() {
    return {
      tilelayers: TILELAYERS
    }
  },
  computed: {
    legendType() {
      return this.$store.state.legendType
    },
    legend() {
      if (this.$store.state.legendType === 'age') {
        return this.$store.state.ages
      } else {
        return this.$store.state.sexes
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
    resizePane(pct) {
      this.$refs.pane.style.flexBasis = pct
      this.$refs.map.mapObject.invalidateSize()
    },
    onlySex(event) {
      this.onlyProp('sex', event.target.value)
    },
    onlyAge(event) {
      this.onlyProp('age', event.target.value)
    },
    onlyProp(prop, value) {
      this.$store.commit('onlyProp', { prop, value })
      updateRouter({ router: this.$router, store: this.$store })
      this.$store.dispatch('fetchIndividuals')
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
.map {
  flex-basis: 50%;
}
.legend {
  background-color: transparentize($global-background-color, 0.25);
  border-radius: 0.5rem;
  list-style-type: none;
  padding: 0.25rem;
  text-transform: uppercase;

  ul {
    list-style-type: none;
    margin: 0.5rem 0;
    padding: 0;
  }

  .legend-list-item {
    margin-bottom: 0.5rem;
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
  dt {
    font-weight: bold;
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
