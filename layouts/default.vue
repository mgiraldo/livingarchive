<template>
  <nuxt />
</template>

<style lang="scss">
html {
  background-color: $global-background-color;
  box-sizing: border-box;
  color: $global-text-color;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  font-weight: 300;
  scrollbar-color: darken($global-text-color, 10%)
    lighten($global-background-color, 10%);
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  color: $global-link-color;
}
</style>
