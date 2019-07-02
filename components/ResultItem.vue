<template>
  <li
    :key="individual.identifier"
    class="list-item"
    :identifier="individual.identifier"
  >
    <individual-info :individual="individual" />
    <button
      class="link-button"
      :aria-controls="'controls-' + individual.identifier"
      @click="toggleControls"
    >
      {{ controlsToggled ? 'hide controls' : 'show controls' }}
    </button>
    <div
      v-show="controlsToggled"
      :id="'controls-' + individual.identifier"
      class="actions"
    >
      Show:&nbsp;
      <button class="link-button" @click="showClick(individual)">
        on map
      </button>
      <span class="separator">|</span>
      <button class="link-button">
        area
      </button>
      <span class="separator">←</span>
      <button class="link-button" @click="buildingClick(individual)">
        building
      </button>
      <span class="separator">←</span>
      <button class="link-button">
        space
      </button>
      <span class="separator">←</span>
      <button class="link-button">
        feature
      </button>
      <span class="separator">←</span>
      <button class="link-button">
        unit
      </button>
    </div>
  </li>
</template>

<script>
import IndividualInfo from '~/components/IndividualInfo'

export default {
  components: {
    IndividualInfo
  },
  props: {
    individual: { type: Object, required: true },
    vars: { type: Array, required: true },
    showClick: { type: Function, required: true },
    buildingClick: { type: Function, required: true }
  },
  data() {
    return {
      controlsToggled: false
    }
  },
  methods: {
    toggleControls() {
      this.controlsToggled = !this.controlsToggled
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  border-top: 0.05rem solid $global-border-color;
  margin-bottom: 0;
  padding: 0.2rem 0.2rem 1rem;

  &:hover {
    background-color: lighten($color: $global-background-color, $amount: 10%);
  }
}
.actions {
  display: flex;
}
.separator {
  margin: 0 0.2rem;
}
</style>
