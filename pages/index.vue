<template>
  <section class="container">
    <h1 class="title">Living Archive</h1>
    <h2 class="subtitle">
      An experimental interface to the
      <nuxt-link to="http://catalhoyuk.com/">
        Çatalhöyük Research Project
      </nuxt-link>
      data.
    </h2>
    <p class="description">
      This application was developed to explore the possibilities of visualizing
      linked data and geospatial data.
    </p>
    <div class="screenshot-container">
      <nuxt-link to="/map" class="button"
        ><img
          src="/screenshot.png"
          class="screenshot"
          alt="A screenshot of the Living Archive application"
      /></nuxt-link>
    </div>
    <nuxt-link to="/map" class="button">Enter</nuxt-link>
  </section>
</template>

<script>
export default {
  head() {
    return { title: 'Living Archive' }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  margin: 2rem auto auto;
  grid-template-columns: 1fr 1fr 1fr 6rem 6rem 0.5fr;
  grid-template-rows: 1fr 5rem 1fr 1fr 0.5fr 1fr;
  grid-gap: 1rem;
  width: 60vw;
}

.title {
  align-self: end;
  font-size: 6rem;
  font-weight: normal;
  grid-column: 1/7;
  grid-row: 4/5;
}

.subtitle {
  font-weight: normal;
  grid-column: 3/6;
  grid-row: 5/6;
}

.screenshot-container {
  grid-column: 1/5;
  grid-row: 1/4;

  .screenshot {
    border-bottom: 0.5rem solid $global-link-color;
    height: 100%;
    max-width: 100%;
    object-fit: cover;
    transition: all 0.2s;

    &:hover {
      border-bottom-color: $filter-button-color;
    }
  }
}

.description {
  font-size: 1rem;
  grid-column: 3/5;
  grid-row: 6/7;
}

.button {
  align-items: center;
  background-color: $global-link-color;
  border-radius: 0.25rem;
  color: $global-background-color;
  display: flex;
  font-size: 2rem;
  grid-column: 4/6;
  grid-row: 2/3;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover {
    background-color: $filter-button-color;
    color: $global-text-color;
  }
}
</style>
