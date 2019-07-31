<template>
  <div class="ie11">
    <p class="copy">
      You seem to be using Internet Explorer. This website supports the recent
      versions of
      <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>,
      <a href="https://www.opera.com">Opera</a>,
      <a href="https://www.apple.com/safari/">Safari</a>, and
      <a href="https://www.google.com/chrome/">Chrome</a>.
    </p>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.ie11 {
  position: fixed;
  background-color: transparentize($global-background-color, 0.1);
  bottom: 0;
  font-size: 3rem;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1111111111;

  .copy {
    margin: 20% auto 0;
    text-align: center;
    width: 60%;
  }

  @supports (display: grid) {
    display: none;
  }
}
</style>
