<template>
  <span class="color-item-container">
    <span class="dot" :style="`background-color:${color}`"></span>
    {{ name }}
  </span>
</template>

<script>
export default {
  props: {
    color: { type: String, required: true },
    name: { type: String, required: true }
  }
}
</script>

<style lang="scss" scoped>
.color-item-container {
  display: flex;
}
.dot {
  border-radius: 50%;
  height: 1rem;
  margin-right: 0.25rem;
  width: 1rem;
}
</style>
