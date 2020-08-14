<template>
  <div>
    <header>
      <section class="intro">
        <h1 class="title">Living Archive</h1>

        <h2 class="subtitle">
          An experimental interface to the<br />
          <a href="http://catalhoyuk.com/">
            Çatalhöyük Research Project
          </a>
        </h2>
        <p class="description">
          Application developed to explore the possibilities of visualizing
          linked data and geospatial data.
        </p>
        <nuxt-link to="/map" class="button">Enter</nuxt-link>
        <div class="screenshot-container">
          <nuxt-link to="/map"
            ><img
              src="/screenshot.png"
              class="screenshot"
              alt="A screenshot of the Living Archive application"
          /></nuxt-link>
        </div>
      </section>
    </header>
    <section class="credits">
      <h1>Credits</h1>
      <dl>
        <dt>Stanford Archaeology Center</dt>
        <dd>Dominik Lukas</dd>
        <dt>Digital Research Architect</dt>
        <dd>Nicole Coleman</dd>
        <dt>Designer & Developer</dt>
        <dd>
          Mauricio Giraldo Arteaga -
          <a href="https://twitter.com/mgiraldo">@mgiraldo</a>
        </dd>
      </dl>
      <p class="github">
        Code
        <a href="https://github.com/mgiraldo/livingarchive/">
          available on Github
        </a>
      </p>
    </section>
  </div>
</template>

<script>
export default {
  head() {
    return { title: 'Living Archive' }
  },
}
</script>

<style lang="scss">
/* overriding default.vue scss */
body {
  background-color: lighten($global-background-color, 10%);
}
</style>
<style lang="scss" scoped>
header {
  background-color: $global-background-color;
  margin: auto;
  min-height: 100vh;
  padding: 2rem 0 10rem;
}

.intro {
  display: grid;
  grid-template-columns: 1fr 0.5fr 1fr 6rem 6rem;
  grid-template-rows: 1fr 5rem 1fr auto auto auto;
  grid-gap: 1rem;
  margin: 0 auto;
  width: 60vw;

  @media screen and (max-width: 820px) {
    display: flex;
    flex-direction: column;
    width: 80vw;
  }
}

.title {
  align-self: end;
  font-size: 6rem;
  font-weight: normal;
  grid-column: 1/6;
  grid-row: 4/5;

  @media screen and (max-width: 820px) {
    align-self: start;
    font-size: 4rem;
  }
}

.subtitle {
  font-weight: normal;
  grid-column: 3/6;
  grid-row: 5/6;

  @media screen and (min-width: 1300px) {
    grid-column: 2/5;
  }
}

.description {
  font-size: 1rem;
  grid-column: 3/5;
  grid-row: 6/7;

  @media screen and (min-width: 1300px) {
    grid-column: 2/4;
  }
}

.screenshot-container {
  grid-column: 1/5;
  grid-row: 1/4;

  @media screen and (max-width: 820px) {
    margin-bottom: 1rem;
  }

  .screenshot {
    border-bottom: 0.5rem solid $global-link-color;
    filter: grayscale(1);
    max-width: 100%;
    object-fit: cover;
    opacity: 0.7;
    transition: all 0.2s;

    &:hover {
      filter: grayscale(0);
    }
  }
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
  padding: 1rem 0;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s;
  z-index: 1;

  &:hover {
    background-color: $filter-button-color;
    color: $global-text-color;
  }
}

.credits {
  padding: 3rem 0 10rem;

  h1 {
    font-size: 3rem;
    font-weight: normal;
    margin-bottom: 2rem;
  }

  .github {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    width: 60vw;

    @media screen and (max-width: 820px) {
      width: 80vw;
    }
  }

  h1,
  dl {
    margin-left: auto;
    margin-right: auto;
    width: 60vw;

    @media screen and (max-width: 820px) {
      width: 80vw;
    }
  }

  dl {
    margin-bottom: 2rem;
  }

  dt,
  dd {
    display: inline-block;
    margin-bottom: 2rem;

    @media screen and (max-width: 820px) {
      display: block;
    }
  }

  dt {
    margin-left: 20%;
    width: 30%;

    @media screen and (max-width: 820px) {
      margin: auto;
      width: auto;
    }
  }

  dd {
    font-weight: bold;
    width: 40%;

    @media screen and (max-width: 820px) {
      width: auto;
    }
  }
}
</style>
