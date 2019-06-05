<template>
  <div>
    <bubble-component :start="start" />
  </div>
</template>

<script>
import BubbleComponent from '~/components/BubbleComponent'
export default {
  components: { BubbleComponent },
  asyncData({ params }) {
    let start = params.start ? 'catalhoyuk#' + params.start : 'catalhoyuk#Unit'
    return { start: start }
  },
  head() {
    return { title: 'bubbles' }
  }
}
</script>

<style lang="scss" scoped></style>
