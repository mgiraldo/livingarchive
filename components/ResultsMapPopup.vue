<template>
  <div class="popup">
    <dl>
      <dt>Identifier</dt>
      <dd>
        <nuxt-link :to="`/skeleton/${individual.identifier}`" target="_blank">{{
          individual.identifier
        }}</nuxt-link>
      </dd>
      <BonesFindView
        v-if="shape.length !== 0"
        :shape="shape"
        class="bones-view"
      />
      <dt>Sex</dt>
      <dd class="bordered" :style="'border-color:' + sexColors[individual.sex]">
        {{ individual.sex }}
      </dd>
      <dt>Age</dt>
      <dd class="bordered" :style="'border-color:' + ageColors[individual.age]">
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
  </div>
</template>

<script>
import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'

import BonesFindView from '~/components/BonesFindView'

export default {
  components: { BonesFindView },
  props: {
    individual: { type: Object, required: true },
    shape: { type: Array, default: () => [] },
  },
  data() {
    return {
      ageColors: FILTER_PARAMS_TO_NAMES.a.colors,
      sexColors: FILTER_PARAMS_TO_NAMES.s.colors,
    }
  },
}
</script>

<style lang="scss" scoped>
.popup {
  max-width: 15rem;

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
  .bones-view {
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
.mapboxgl-popup-content {
  background-color: $global-background-color;
  color: $global-text-color;

  a {
    color: $global-link-color;
  }
}
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  border-top-color: $global-background-color;
}
.mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  border-right-color: $global-background-color;
}
.mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
  border-left-color: $global-background-color;
}
.mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  border-bottom-color: $global-background-color;
}
.mapboxgl-popup-close-button {
  color: $global-text-color;
}
</style>
