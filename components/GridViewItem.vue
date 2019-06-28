<template>
  <fragment>
    <div
      ref="item"
      :class="`grid-item ` + (expanded ? 'expanded' : '')"
      @click="click"
    >
      <h1 class="item-title">{{ individual.individual }}</h1>
      <bones-find-view :shape="individual.skeleton" />
    </div>
    <div
      v-if="expanded"
      ref="expansion"
      :class="`expansion ` + (expanded ? 'open' : '')"
      :style="row ? `grid-row-start:` + row : ''"
    >
      <div class="expansion-contents">
        <p v-if="individual.individual">
          {{ individual.individual }}
        </p>
        <p v-if="individual.identifier">
          {{ individual.identifier }}
        </p>
        <p v-if="individual.age">
          {{ individual.age }}
        </p>
        <p v-if="individual.sex">
          {{ individual.sex }}
        </p>
        <p v-if="individual.discussion">
          {{ individual.discussion }}
        </p>
      </div>
    </div>
  </fragment>
</template>

<script>
import BonesFindView from '~/components/BonesFindView'

export default {
  components: {
    BonesFindView
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
  height: 10rem;
  // margin: 0.5rem;
  position: relative;
  width: 10rem;
}
.item-title {
  font-size: 1rem;
  font-weight: normal;
  left: 0.2rem;
  position: absolute;
  top: 0.2rem;
}
.expanded {
  position: relative;
}
.expanded:after {
  display: block;
  position: absolute;
  content: '';
  border: 1rem solid transparent;
  border-bottom-color: $grid-expansion-color;
  border-top: none;
  bottom: -1rem;
  left: 50%;
  margin-left: -1rem;
}
.expansion {
  background-color: $grid-expansion-color;
  color: $global-text-color;
  display: flex;
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: -1;
  grid-row-start: 1;
  max-height: 0;
  overflow: hidden;
  padding: 0;
}
.expansion-contents {
  padding: 1rem 0.5rem;
}
.expansion.open {
  max-height: 30rem;
  overflow-y: auto;
}
</style>
