<template>
  <li class="grid-item">
    <h1 class="item-title">{{ individual.individual }}</h1>
    <bones-find-view :shape="individual.skeleton" />
  </li>
</template>

<script>
import BonesFindView from '~/components/BonesFindView'

export default {
  components: {
    BonesFindView
  },
  props: {
    individual: { type: Object, required: true }
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
