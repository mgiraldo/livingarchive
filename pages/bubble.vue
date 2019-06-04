<template>
  <div>
    <bubble-component selected="catalhoyuk#Unit" />
  </div>
</template>

<script>
import BubbleComponent from '~/components/BubbleComponent'
export default {
  components: { BubbleComponent },
  head() {
    return { title: 'bubbles' }
  }
}
</script>

<style lang="scss" scoped></style>
