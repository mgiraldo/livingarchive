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
  font-size: 14px;
  font-weight: 300;
  scrollbar-color: darken($global-text-color, 10%)
    lighten($global-background-color, 10%);
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar-track {
  background-color: lighten($global-background-color, 10%);
}
::-webkit-scrollbar {
  background-color: lighten($global-background-color, 10%);
  border-radius: 0.5rem;
  width: 0.5rem;
}
::-webkit-scrollbar-thumb {
  background-color: darken($global-text-color, 10%);
  border-radius: 0.5rem;

  &:hover {
    background-color: darken($global-text-color, 30%);
  }
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  color: $global-link-color;

  &:hover {
    text-decoration: none;
  }
}
.link-button {
  background: none;
  border: none;
  text-decoration: underline;
  color: $global-link-color;
  cursor: pointer;
  font: inherit;
  margin-bottom: 1rem;
  padding: 0;

  &:hover {
    text-decoration: none;
  }
}
</style>
