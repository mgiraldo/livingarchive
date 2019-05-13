<template>
  <form class="controls">
    <button
      v-if="filtered"
      class="filter-button"
      type="button"
      @click="clearFilters"
    >
      Clear filters
    </button>
    <section class="section">
      <h1>Age</h1>
      <ul>
        <li v-for="(color, age, index) in ages" :key="index">
          <label :for="`ch_${index}`">
            <input
              :id="`ch_${index}`"
              type="checkbox"
              :value="index"
              :checked="inStore('Ages', index)"
              @change="toggled('age', index, $event.target.checked)"
            />
            <filter-color-item :name="age" :color="color" />
          </label>
        </li>
      </ul>
    </section>
    <section class="section">
      <h1>Sex</h1>
      <ul>
        <li v-for="(color, sex, index) in sexes" :key="index">
          <label :for="`ch_${index}`">
            <input
              :id="`ch_${index}`"
              type="checkbox"
              :value="index"
              :checked="inStore('Sexes', index)"
              @change="toggled('sex', index, $event.target.checked)"
            />
            <filter-color-item :name="sex" :color="color" />
          </label>
        </li>
      </ul>
    </section>
  </form>
</template>

<script>
import FilterColorItem from '~/components/FilterColorItem'

export default {
  components: { FilterColorItem },
  data() {
    return {
      ages: this.$store.state.ages,
      sexes: this.$store.state.sexes
    }
  },
  computed: {
    filtered() {
      return this.$store.state.filtered
    }
  },
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'checkedFilter' || mutation.type === 'onlyProp') {
        this.updateFilters()
      }
    })
  },
  methods: {
    clearFilters() {
      this.$store.commit('clearFilters')
      this.$store.dispatch('fetchIndividuals')
    },
    updateFilters() {
      this.ages = this.$store.state.ages
      this.sexes = this.$store.state.sexes
    },
    toggled(type, index, value) {
      this.$store.commit('checkedFilter', { type, index, value })
      this.$store.dispatch('fetchIndividuals')
    },
    inStore(filter, index) {
      return this.$store.state['checked' + filter].has(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.controls {
  font-size: 0.8rem;
  padding: 0.5rem;
}
.section {
  h1 {
    font-size: 1.5rem;
    font-weight: normal;
    margin-bottom: 0.5rem;
  }
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
label {
  display: flex;
  margin-bottom: 0.5rem;
}
input {
  margin-right: 0.5rem;
}
</style>
