<template>
  <form class="controls">
    <button class="filter-button" type="button" @click="toggleAge">
      Age filter
    </button>
    <dialog v-if="ageVisible" v-on-clickaway="dismiss" class="dialog" open>
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
    </dialog>
    <button class="filter-button" type="button" @click="toggleSex">
      Sex filter
    </button>
    <dialog v-if="sexVisible" v-on-clickaway="dismiss" class="dialog" open>
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
    </dialog>
    <button
      v-if="filtered"
      class="filter-button"
      type="button"
      @click="clearFilters"
    >
      Clear filters
    </button>
  </form>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'

import FilterColorItem from '~/components/FilterColorItem'

export default {
  components: { FilterColorItem },
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      ageVisible: false,
      sexVisible: false,
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
    toggleAge() {
      this.sexVisible = false
      this.ageVisible = !this.ageVisible
    },
    toggleSex() {
      this.ageVisible = false
      this.sexVisible = !this.sexVisible
    },
    dismiss() {
      this.sexVisible = false
      this.ageVisible = false
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
  display: flex;
  padding: 0.5rem;
}
.filter-button {
  background-color: white;
  border-color: $border_color;
  border-radius: 0.25rem;
  border-width: 0.1rem;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;
  padding: 0.25rem 0.5rem;
}
.dialog {
  border-radius: 0.25rem;
  border-width: 0.125rem;
  display: flex;
  flex-direction: column;
  margin: 0 0.5rem;

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
}
input {
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
}
</style>
