<template>
  <div ref="item" class="grid-item" @click="click">
    <h1 class="item-title">{{ individual.individual }}</h1>
    <bones-find-view :shape="individual.skeleton" />
  </div>
</template>

<script>
import BonesFindView from '~/components/BonesFindView'

export default {
  components: {
    BonesFindView
  },
  props: {
    individual: { type: Object, required: true },
    showClick: { type: Function, required: true }
  },
  methods: {
    click() {
      this.showClick({ element: this.$refs.item, data: this.individual })
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
</style>
