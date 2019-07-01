<template>
  <section class="section">
    <h1 :aria-controls="'facet_' + facet.name + '_toggle'" @click="toggle">
      <span class="toggle">{{ open ? '-' : '+' }}</span>
      {{ facet.name }}
    </h1>
    <transition name="fade">
      <div :id="'facet_' + facet.name + '_toggle'">
        <ul v-if="type !== 'skeleton'" v-show="open">
          <li
            v-for="(color, name, index) in nonEmptyFacets"
            :key="index"
            class="facet"
          >
            <label :for="`${name}_${index}`">
              <input
                :id="`${name}_${index}`"
                type="checkbox"
                :value="index"
                :checked="inStore(facet.name, name)"
                :disabled="
                  aggPercent(aggregations[name]) === 0 ||
                    aggPercent(aggregations[name]) === 'None'
                "
                @change="toggled(facet.name, name, $event.target.checked)"
              />
              <filter-color-item :name="name" :color="color" />
            </label>
            <div :class="'aggregation agg-' + aggPercent(aggregations[name])">
              {{ aggPercent(aggregations[name]) }}
            </div>
          </li>
        </ul>
        <skeleton-front
          v-if="type === 'skeleton'"
          v-show="open"
          id="skeleton-control"
          class="skeleton"
        />
        <div v-if="type === 'skeleton' && open">
          <!-- <ul>
            <li
              v-for="(value, aggregation, index) in aggregations"
              :key="index"
              class="facet"
            >
              <div :class="'aggregation agg-' + aggPercent(value)">
                {{ cleanBone(aggregation) }} {{ value }}
              </div>
            </li>
          </ul> -->
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { updateRouter } from '~/utils/router'

import FilterColorItem from '~/components/FilterColorItem'
import SkeletonFront from '~/assets/skeleton-front.svg'

export default {
  components: { FilterColorItem, SkeletonFront },
  props: {
    facet: { type: Object, required: true },
    type: { type: String, default: 'list' },
    aggregations: { type: Object, default: null }
  },
  data() {
    return { open: false }
  },
  computed: {
    nonEmptyFacets() {
      let nonEmpty = {}
      for (const facet in this.facet.values) {
        if (
          this.aggPercent(this.aggregations[facet]) > 0 &&
          this.aggPercent(this.aggregations[facet]) !== 'None'
        )
          nonEmpty[facet] = this.facet.values[facet]
      }
      return nonEmpty
    },
    totalResults() {
      return this.$store.state.individualCount
    }
  },
  methods: {
    cleanBone(bone) {
      return bone.substring(0, bone.lastIndexOf('-'))
    },
    aggPercent(value) {
      if (!value) return 'None'
      return Math.round((value / this.$store.state.individualCount) * 100)
    },
    toggle() {
      this.open = !this.open
    },
    toggled(filter, name, value) {
      const index = Object.keys(this.facet.values).indexOf(name)
      this.$store.commit('checkedFilter', { filter, index, value })
      updateRouter({ router: this.$router, store: this.$store })
    },
    inStore(filter, name) {
      const index = Object.keys(this.facet.values).indexOf(name)
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
.facet {
  margin-bottom: 1rem;
}
.aggregation {
  border-bottom: 0.05rem solid $global-border-color;
  display: flex;
  padding-bottom: 0.125rem;
  padding-left: 0.125rem;
}
@for $i from 0 through 100 {
  .agg-#{$i} {
    background: linear-gradient(
        to right,
        $aggregation-bar-color 0%,
        $aggregation-bar-color #{$i + '%'},
        $aggregation-bar-background-color #{$i + '%'},
        $aggregation-bar-background-color
      )
      100%;
  }
}
label {
  cursor: pointer;
  display: flex;
  margin-bottom: 0.25rem;
}
input {
  margin-right: 0.5rem;
}
</style>
