<template>
  <span class="wrapper"
    ><span :class="'toggle ' + (open ? 'open' : '')" :aria-label="label"
      >✕</span
    ></span
  >
</template>

<script>
export default {
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
  height: 1em;
  width: 1.5em;
}
.toggle {
  text-align: center;
  transform: rotate(-45deg);
  transition: transform 0.1s ease-in;
  line-height: 0;

  &.open {
    transform: rotate(0deg);
  }
}
</style>
