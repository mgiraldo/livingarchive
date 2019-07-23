<template>
  <div class="map-overlay layer-switcher">
    <results-map-overlay-title text="Layers" />
    <ul class="list">
      <li class="checkbox">
        <input
          id="ch-individuals"
          type="checkbox"
          value="individuals"
          checked="checked"
          @change="
            $emit('change', {
              name: 'individuals',
              toggled: $event.target.checked
            })
          "
        />
        <label for="ch-individuals">
          Individuals
        </label>
      </li>
      <li class="checkbox">
        <input
          id="ch-spaces"
          type="checkbox"
          value="spaces"
          checked="checked"
          @change="
            $emit('change', {
              name: 'spaces',
              toggled: $event.target.checked
            })
          "
        />
        <label for="ch-spaces">
          Spaces
        </label>
      </li>
      <li class="checkbox">
        <input
          id="ch-buildings"
          type="checkbox"
          value="buildings"
          checked="checked"
          @change="
            $emit('change', {
              name: 'buildings',
              toggled: $event.target.checked
            })
          "
        />
        <label for="ch-buildings">
          Buildings
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import ResultsMapOverlayTitle from '~/components/ResultsMapOverlayTitle'

export default {
  components: {
    ResultsMapOverlayTitle
  }
}
</script>

<style lang="scss" scoped>
.layer-switcher {
  margin-left: 0.5rem;
  margin-top: 3rem;
  left: 0;
  top: 0;
}
.list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.checkbox {
  @include custom-checkbox;
}
</style>
