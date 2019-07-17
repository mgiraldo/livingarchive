<template>
  <span class="wrapper">
    <plus :class="'toggle ' + (open ? 'open' : '')" :aria-label="label" />
  </span>
</template>

<script>
import Plus from '~/assets/plus-white.svg'

export default {
  components: { Plus },
  props: {
    open: { type: Boolean, required: true },
    label: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
}
.toggle {
  height: 0.6em;
  transform: rotate(0deg);
  transition: transform 0.1s ease-out;
  width: 0.6em;

  &.open {
    transform: rotate(45deg);
  }
}
</style>
