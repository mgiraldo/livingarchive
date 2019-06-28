<template>
  <fragment>
    <div
      ref="item"
      :class="`grid-item ` + (expanded ? 'expanded' : '')"
      @click="click"
    >
      <bones-find-view :shape="individual.skeleton" />
    </div>
    <div
      v-if="expanded"
      ref="expansion"
      :class="`expansion ` + (expanded ? 'open' : '')"
      :style="row ? `grid-row-start:` + row : ''"
    >
      <individual-info :individual="individual" />
    </div>
  </fragment>
</template>

<script>
import IndividualInfo from '~/components/IndividualInfo'
import BonesFindView from '~/components/BonesFindView'

export default {
  components: {
    BonesFindView,
    IndividualInfo
  },
  props: {
    individual: { type: Object, required: true },
    showClick: { type: Function, required: true },
    expanded: { type: Boolean, required: true },
    row: { type: Number, default: null }
  },
  methods: {
    click() {
      this.showClick(this)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-item {
  cursor: pointer;
  height: 10rem;
  width: 10rem;
}
.expanded {
  position: relative;
}
.expanded:after {
  display: block;
  position: absolute;
  content: '';
  border: 1rem solid transparent;
  border-bottom: none;
  border-top-color: $grid-expansion-color;
  bottom: -1rem;
  left: 50%;
  margin-left: -1rem;
}
.expansion {
  color: $global-text-color;
  display: flex;
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: -1;
  grid-row-start: 1;
  padding: 1rem 0.5rem;
}
.expansion.open {
}
</style>
