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
body {
  overflow: hidden;
}
a {
  color: $global-link-color;

  &:hover {
    text-decoration: none;
  }
}
.not-interactive {
  pointer-events: none;
}
.filter-button {
  border: none;
  background-color: $filter-button-color;
  color: $global-text-color;
  border-radius: 0.25rem;
  border-width: 0.1rem;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 1rem 1rem 1rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: $global-text-color;
    color: lighten($color: $global-background-color, $amount: 20%);
  }
}
.link-button {
  align-items: center;
  background: none;
  border: none;
  color: $global-link-color;
  cursor: pointer;
  display: flex;
  font: inherit;
  padding: 0;
  text-decoration: underline;

  &.no-underline {
    text-decoration: none;
  }

  &:hover {
    text-decoration: none;
  }
}
</style>
