<template>
  <form class="controls">
    <fieldset>
      <legend @click="toggleAge">Age</legend>
      <dialog v-if="ageVisible" class="dialog" v-on-clickaway="dismiss" open>
        <label v-for="(color,age,index) in ages" :key="index" :for="`ch_${index}`">
          <input
            :id="`ch_${index}`"
            type="checkbox"
            :value="index"
            :checked="inStore('Ages',index)"
            @change="toggled('age',index,$event.target.checked)"
          >
          <filter-color-item :name="age" :color="color"/>
        </label>
      </dialog>
    </fieldset>
    <fieldset>
      <legend @click="toggleSex">Sex</legend>
      <dialog v-if="sexVisible" class="dialog" v-on-clickaway="dismiss" open>
        <label v-for="(color,sex,index) in sexes" :key="index" :for="`ch_${index}`">
          <input
            :id="`ch_${index}`"
            type="checkbox"
            :value="index"
            :checked="inStore('Sexes',index)"
            @change="toggled('sex',index,$event.target.checked)"
          >
          <filter-color-item :name="sex" :color="color"/>
        </label>
      </dialog>
    </fieldset>
  </form>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'

import FilterColorItem from '~/components/FilterColorItem'

export default {
  data() {
    return { ageVisible: false, sexVisible: false }
  },
  components: { FilterColorItem },
  directives: {
    onClickaway: onClickaway
  },
  methods: {
    toggleAge() {
      this.sexVisible = false
      this.ageVisible = !this.ageVisible
    },
    toggleSex() {
      this.ageVisible = false
      this.sexVisible = !this.sexVisible
    },
    dismiss(e) {
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
  },
  computed: {
    ages() {
      return this.$store.state.ages
    },
    sexes() {
      return this.$store.state.sexes
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
label {
  display: flex;
}
input {
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
}
</style>
