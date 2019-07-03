<template>
  <li
    :key="individual.identifier"
    class="list-item"
    :identifier="individual.identifier"
  >
    <individual-info :individual="individual" />
    <div class="actions-wrapper">
      <button
        class="link-button no-underline"
        :aria-controls="'actions-' + individual.identifier"
        @click="toggleControls"
      >
        <disclosure-icon :open="controlsToggled" label="Show controls" />
      </button>
      <div
        v-show="controlsToggled"
        :id="'actions-' + individual.identifier"
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
    </div>
  </li>
</template>

<script>
import IndividualInfo from '~/components/IndividualInfo'
import DisclosureIcon from '~/components/DisclosureIcon'

export default {
  components: {
    IndividualInfo,
    DisclosureIcon
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
  border-bottom: 0.1rem solid $global-border-color;
  margin-bottom: 1rem;
  padding: 0;
}
.actions-wrapper {
  align-items: flex-start;
  background-color: $lighter-background-color;
  display: flex;
  padding: 0.2rem 0.2rem 1rem 0.2rem;
}
.actions {
  display: flex;
}
.separator {
  margin: 0 0.2rem;
}
</style>
