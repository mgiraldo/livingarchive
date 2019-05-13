<template>
  <span class="color-item-container">
    <span class="dot" :style="`background-color:${color}`"></span>
    <span class="text">{{ name }}</span>
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
  align-items: center;
  display: flex;
}
.dot {
  border-radius: 50%;
  margin-right: 0.5em;
  min-height: 1em;
  min-width: 1em;
}
.text {
}
</style>
