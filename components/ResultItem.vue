<template>
  <li
    :key="individual.identifier"
    class="list-item"
    :identifier="individual.identifier"
  >
    <IndividualInfo :individual="individual" />
    <div class="actions-wrapper">
      <button class="link-button" @click="$emit('show', individual)">
        Highlight on map
      </button>
    </div>
  </li>
</template>

<script>
import IndividualInfo from '~/components/IndividualInfo'

export default {
  components: {
    IndividualInfo,
  },
  props: {
    individual: { type: Object, required: true },
  },
  data() {
    return {
      controlsToggled: false,
    }
  },
  methods: {
    toggleControls() {
      this.controlsToggled = !this.controlsToggled
    },
  },
}
</script>

<style lang="scss" scoped>
.list-item {
  background-color: $lighter-background-color;
  margin-bottom: 1rem;
  padding: 0 0.25rem 1.5rem;
}
.actions-wrapper {
  align-items: center;
  display: flex;
  line-height: 1;
  padding: 0.2rem 0 0 0;
}
.actions-toggle {
  margin-right: 0.25rem;
  min-height: 1rem;
}
.actions {
  display: flex;
}
.separator {
  margin: 0 0.2rem;
}
</style>
