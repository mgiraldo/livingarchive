<template>
  <button
    class="square-button"
    :aria-label="label"
    @click="$emit('click', $event)"
  >
    {{ icon }}
  </button>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: '×' },
    label: { type: String, default: 'Collapse' }
  }
}
</script>

<style lang="scss" scoped>
.square-button {
  border: none;
  border-radius: 0;
  background-color: $filter-button-color;
  color: $global-text-color;
  cursor: pointer;
  display: flex;
  place-content: center;
  font-size: 1rem;
  height: 1.5rem;
  transition: all 0.2s;
  width: 1.5rem;
  z-index: 1;

  &:hover {
    background-color: $global-text-color;
    color: lighten($color: $global-background-color, $amount: 20%);
  }
}
</style>
