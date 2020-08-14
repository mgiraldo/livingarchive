<template>
  <div class="toggle-wrapper">
    <button class="link-button" @click="$emit('click')">
      {{ text }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
.toggle-wrapper {
  margin: 1rem 0 2rem 0;
}
</style>
