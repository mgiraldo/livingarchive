<template>
  <div class="title" @click="$emit('click')">
    <disclosure-icon :open="open" class="icon" label="Toggle facet" />
    {{ text }}
  </div>
</template>

<script>
import DisclosureIcon from '~/components/DisclosureIcon'
export default {
  components: {
    DisclosureIcon
  },
  props: {
    text: { type: String, required: true },
    open: { type: Boolean, default: true }
  }
}
</script>

<style lang="scss" scoped>
.title {
  cursor: pointer;
  display: flex;
  font-weight: bold;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}
.icon {
  margin-right: 0.25em;
}
</style>
