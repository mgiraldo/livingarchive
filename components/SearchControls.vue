<template>
  <form class="controls">
    <fieldset>
      <legend>
        <button type="button" @click="toggleAge">Age</button>
      </legend>
      <dialog v-if="ageVisible" v-on-clickaway="dismiss" class="dialog" open>
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
    </fieldset>
    <fieldset>
      <legend>
        <button type="button" @click="toggleSex">Sex</button>
      </legend>
      <dialog v-if="sexVisible" v-on-clickaway="dismiss" class="dialog" open>
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
    </fieldset>
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
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'checkedFilter') {
        this.updateFilters()
      }
    })
  },
  methods: {
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
fieldset {
  border: none;
}
.dialog {
  display: flex;
  flex-direction: column;
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
