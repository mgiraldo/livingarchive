<template>
  <div class="map-overlay legend">
    <ResultsMapOverlayTitle
      :text="'Legend: ' + type"
      :open="open"
      @click="toggle"
    />
    <transition-group
      v-show="open"
      name="legend-list"
      class="legend-list"
      tag="ul"
    >
      <li
        v-for="(color, name, index) in legend"
        :key="index + name"
        class="legend-list-item"
      >
        <FilterColorItem :name="name" :color="color" />
      </li>
    </transition-group>
    <button v-show="open" class="filter-button" @click="toggleLegend">
      color by {{ type === 'sex' ? 'age' : 'sex' }}
    </button>
  </div>
</template>

<script>
import { FILTER_PARAMS_TO_NAMES } from '~/utils/constants'

import FilterColorItem from '~/components/FilterColorItem'
import ResultsMapOverlayTitle from '~/components/ResultsMapOverlayTitle'

export default {
  components: {
    FilterColorItem,
    ResultsMapOverlayTitle,
  },
  data() {
    return { open: false }
  },
  computed: {
    type() {
      return this.$store.state.legendType
    },
    legend() {
      if (this.$store.state.legendType === 'age') {
        return FILTER_PARAMS_TO_NAMES.a.colors
      } else {
        return FILTER_PARAMS_TO_NAMES.s.colors
      }
    },
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    toggleLegend() {
      this.$store.commit('toggledLegend')
      this.$emit('toggled')
    },
  },
}
</script>

<style lang="scss" scoped>
.legend {
  align-items: flex-start;
  bottom: 0;
  display: flex;
  flex-direction: column-reverse;
  left: 0;
  list-style-type: none;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 3rem;

  .legend-list {
    list-style-type: none;
    margin: 0.5rem 0;
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
}
</style>
