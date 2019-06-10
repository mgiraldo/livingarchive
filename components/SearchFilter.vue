<template>
  <section class="section">
    <h1 @click="toggle">
      <span class="toggle">{{ open ? '-' : '+' }}</span>
      {{ facet.name }}
    </h1>
    <transition name="fade">
      <ul v-show="open">
        <li v-for="(color, name, index) in facet.values" :key="index">
          <label :for="`${name}_${index}`">
            <input
              :id="`${name}_${index}`"
              type="checkbox"
              :value="index"
              :checked="inStore(facet.name, index)"
              @change="toggled(facet.name, index, $event.target.checked)"
            />
            <filter-color-item :name="name" :color="color" />
          </label>
        </li>
      </ul>
    </transition>
  </section>
</template>

<script>
import { updateRouter } from '~/utils/router'

import FilterColorItem from '~/components/FilterColorItem'

export default {
  components: { FilterColorItem },
  props: {
    facet: { type: Object, required: true }
  },
  data() {
    return { open: false }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    toggled(filter, index, value) {
      this.$store.commit('checkedFilter', { filter, index, value })
      updateRouter({ router: this.$router, store: this.$store })
    },
    inStore(filter, index) {
      return this.$store.state['checked' + filter].has(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  h1 {
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: normal;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
}
.toggle {
  display: inline-block;
  text-align: center;
  width: 1rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
