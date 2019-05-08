<template>
  <section>
    <div>
      <h1 class="title">app in {{ name }}</h1>
      <h2 class="subtitle">Living Archive</h2>
      <router-link to="/map">Map</router-link>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  }
}
</script>

<style>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
