<template>
  <div>
    <BrowserDetect />
    <nuxt />
  </div>
</template>

<script>
import BrowserDetect from '~/components/BrowserDetect'

export default {
  components: {
    BrowserDetect,
  },
}
</script>

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
  flex-shrink: 0;
  font-size: 1rem;
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
/* COLLAPSIBLE PANES */
.collapsible {
  flex-basis: 100%;
  overflow-x: hidden;
  position: relative;
  transition: all 0.2s ease-out;

  .scroller {
    bottom: 0;
    left: 0;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-overflow-scrolling: touch;
  }

  .square-button {
    position: absolute;
    right: 0;
    top: 0;
  }

  &.collapsed {
    display: flex;
    flex-basis: 1.5rem;
    flex-direction: column;
    flex-shrink: 0;

    h1 {
      font-size: 1rem;
      line-height: 0.8;
      margin-top: 2rem;
      white-space: nowrap;
      writing-mode: vertical-lr;
    }
  }

  @media all and (orientation: portrait) {
    border-bottom: 1px solid $global-border-color;

    &.collapsed {
      overflow-y: hidden !important;

      h1 {
        line-height: 0.4;
        margin-top: 0;
        writing-mode: unset;
      }
    }
  }
}
</style>
