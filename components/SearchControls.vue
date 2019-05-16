<template>
  <form class="controls">
    <transition name="button-slide-fade">
      <button
        v-show="filtered()"
        class="filter-button"
        type="button"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </transition>
    <section class="section">
      <h1>Age</h1>
      <ul>
        <li v-for="(color, age, index) in ages" :key="index">
          <label :for="`age_${index}`">
            <input
              :id="`age_${index}`"
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
          <label :for="`sex_${index}`">
            <input
              :id="`sex_${index}`"
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
    <section class="section">
      <h1>Skeleton</h1>
      <skeleton-front id="skeleton-control" class="skeleton" />
    </section>
  </form>
</template>

<script>
import FilterColorItem from '~/components/FilterColorItem'
import SkeletonFront from '~/assets/skeleton-front.svg'

export default {
  components: { FilterColorItem, SkeletonFront },
  data() {
    return {
      ages: this.$store.state.ages,
      sexes: this.$store.state.sexes
    }
  },
  computed: {},
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'checkedFilter' || mutation.type === 'onlyProp') {
        this.updateFilters()
      }
    })
  },
  methods: {
    filtered() {
      return this.$store.state.filtered
    },
    clearFilters() {
      this.$store.commit('clearFilters')
      this.updateRouter()
    },
    updateFilters() {
      this.ages = this.$store.state.ages
      this.sexes = this.$store.state.sexes
    },
    toggled(type, index, value) {
      this.$store.commit('checkedFilter', { type, index, value })
      this.updateRouter()
    },
    updateRouter() {
      let ages = [
        'a',
        [...this.$store.state.checkedAges].sort().join(',')
      ].join(':')
      let sexes = [
        's',
        [...this.$store.state.checkedSexes].sort().join(',')
      ].join(':')
      this.$router.push({
        name: 'map-state',
        params: { state: [ages, sexes].join('|') }
      })
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
.filter-button {
  border: none;
  background-color: lighten($color: $global-background-color, $amount: 20%);
  color: $global-text-color;
  border-radius: 0.25rem;
  border-width: 0.1rem;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: $global-text-color;
    color: lighten($color: $global-background-color, $amount: 20%);
  }
}
.button-slide-fade-enter-active,
.button-slide-fade-leave-active {
  transition: all 0.3s ease;
}
.button-slide-fade-enter,
.button-slide-fade-leave-to {
  transform: translateY(-2rem);
  opacity: 0;
}
.section {
  h1 {
    font-size: 1.25rem;
    font-weight: normal;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
label {
  cursor: pointer;
  display: flex;
  margin-bottom: 0.5rem;
}
input {
  margin-right: 0.5rem;
}
</style>
