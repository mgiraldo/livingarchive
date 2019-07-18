<template>
  <div v-if="text" id="more" class="collapsible-text">
    {{ longText && !isToggled ? truncatedText : text }}
    <button
      v-if="longText"
      class="link-button more-button"
      :aria-expanded="isToggled ? 'true' : 'false'"
      aria-controls="more"
      @click="toggleText"
    >
      {{ !isToggled ? 'more' : 'less' }}
    </button>
  </div>
</template>

<script>
import { MAX_TEXT_LENGTH } from '~/utils/constants'
export default {
  props: {
    text: { type: String, default: '' }
  },
  data() {
    return { isToggled: false }
  },
  computed: {
    longText() {
      return this.text && this.text.length > MAX_TEXT_LENGTH
    },
    truncatedText() {
      return this.text.substring(0, MAX_TEXT_LENGTH).trim() + '…'
    }
  },
  methods: {
    toggleText(e) {
      e.stopPropagation()
      this.isToggled = !this.isToggled
    }
  }
}
</script>

<style lang="scss" scoped>
.collapsible-text {
  margin: 0.5rem 0;
}
.more-button {
  display: inline-block;
}
</style>
