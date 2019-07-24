<template>
  <div
    :class="`grid-item ` + (expanded ? 'expanded' : '')"
    @click="$emit('click', individual)"
  >
    <bones-find-view :shape="individual.skeleton ? individual.skeleton : []" />
  </div>
</template>

<script>
import { getShape } from '~/utils/rdf'

import BonesFindView from '~/components/BonesFindView'

export default {
  components: {
    BonesFindView
  },
  props: {
    individual: { type: Object, required: true },
    expanded: { type: Boolean, default: false },
    row: { type: Number, default: null }
  },
  data() {
    return { shape: null }
  },
  mounted() {
    this.$nextTick(() => {
      this.getShape()
    })
  },
  methods: {
    async getShape() {
      this.shape = await getShape(this.individual.identifier)
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
</style>
