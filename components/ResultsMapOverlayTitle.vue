<template>
  <div class="title">{{ text }}</div>
</template>

<script>
export default {
  props: {
    text: { type: String, required: true }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: bold;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}
</style>
