<template>
  <section class="filter">
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
                :disabled="aggPercent(aggregations[name]) === 0"
                @change="toggled(facet.name, name, $event.target.checked)"
              />
              <filter-color-item :name="name" :color="color" />
            </label>
            <search-filter-bar
              :percent="aggPercent(aggregations[name])"
              :value="aggregations[name]"
            />
          </li>
        </ul>
        <skeleton-aggregations
          v-if="type === 'skeleton'"
          v-show="open"
          :key="$route.fullPath"
          :aggregations="fixedAggregations"
        />
        <div v-if="type === 'skeleton' && open">
          <ul>
            <li
              v-for="(value, aggregation, index) in fixedAggregations"
              :key="index"
              class="facet"
            >
              <div class="bone-label">
                {{ aggregation }}
              </div>
              <search-filter-bar :percent="aggPercent(value)" :value="value" />
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { updateRouter } from '~/utils/router'

import FilterColorItem from '~/components/FilterColorItem'
import SearchFilterBar from '~/components/SearchFilterBar'
import SkeletonAggregations from '~/components/SkeletonAggregations'

export default {
  components: { FilterColorItem, SkeletonAggregations, SearchFilterBar },
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
        if (this.aggPercent(this.aggregations[facet]) > 0)
          nonEmpty[facet] = this.facet.values[facet]
      }
      return nonEmpty
    },
    totalResults() {
      return Object.keys(this.$store.state.individuals).length
    },
    fixedAggregations() {
      if (this.type !== 'skeleton') return this.aggregations
      let fixedAggregations = {}
      for (const aggregation in this.aggregations) {
        const bone = this.cleanBone(aggregation)
        if (fixedAggregations[bone]) {
          fixedAggregations[bone] += this.aggregations[aggregation]
        } else {
          fixedAggregations[bone] = this.aggregations[aggregation]
        }
      }
      return fixedAggregations
    }
  },
  methods: {
    cleanBone(bone) {
      return bone.substring(0, bone.lastIndexOf('-'))
    },
    aggPercent(value) {
      if (!value) return 0
      const pct = Math.round(
        (value / this.$store.getters.individualCount) * 100
      )
      return pct <= 100 ? pct : 100
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
.filter {
  border-bottom: 0.1rem solid $global-border-color;
  margin-bottom: 1rem;

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
  border-bottom: 0.1rem solid $global-border-color;
  margin-bottom: 1rem;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
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
.skeleton {
  margin-bottom: 1rem;
}
.bone-label {
  margin-bottom: 0.25rem;
}
</style>
