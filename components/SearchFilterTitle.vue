<template>
  <h1 :aria-controls="controls" @click="$emit('click')">
    <DisclosureIcon :open="open" class="icon" label="Toggle facet" />
    {{ text }}
  </h1>
</template>

<script>
import DisclosureIcon from '~/components/DisclosureIcon'

export default {
  components: {
    DisclosureIcon,
  },
  props: {
    controls: { type: String, required: true },
    open: { type: Boolean, required: true },
    text: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
h1 {
  cursor: pointer;
  display: flex;
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}
.icon {
  margin-right: 0.25rem;
}
</style>
