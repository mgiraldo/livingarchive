<template>
  <section class="filter">
    <h1 :aria-controls="'facet_' + facet.name + '_toggle'" @click="toggle">
      <disclosure-icon :open="open" label="Toggle facet" />
      {{ facet.name }}
    </h1>
    <transition name="fade">
      <div :id="'facet_' + facet.name + '_toggle'">
        <ul v-if="type !== 'skeleton'" v-show="open">
          <li
            v-for="(color, name, index) in presentFacets"
            :key="index"
            class="facet"
          >
            <label :for="`${name}_${index}`">
              <input
                :id="`${name}_${index}`"
                type="checkbox"
                :value="index"
                :checked="inStore(facet.name, name)"
                @change="toggled(facet.name, name, $event.target.checked)"
              />
              <filter-color-item :name="name" :color="color" />
            </label>
            <search-filter-bar :total="total" :value="aggregations[name]" />
          </li>
        </ul>
        <skeleton-aggregations
          v-if="type === 'skeleton'"
          v-show="open"
          :key="$route.fullPath"
          :aggregations="fixedAggregations"
        />
        <div v-if="type === 'skeleton'">
          <button
            v-show="open"
            class="bones-toggle link-button no-underline"
            aria-controls="bones"
            @click="toggleBones"
          >
            <disclosure-icon :open="bonesOpen" label="" />
            {{ bonesOpen ? 'Hide' : 'Show' }} bones
          </button>

          <ul v-if="bonesOpen" id="bones">
            <li
              v-for="(value, aggregation, index) in fixedAggregations"
              :key="index"
              class="facet"
            >
              <div class="bone-label">
                {{ aggregation }}
              </div>
              <search-filter-bar :total="total" :value="value" />
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
import DisclosureIcon from '~/components/DisclosureIcon'

export default {
  components: {
    FilterColorItem,
    SkeletonAggregations,
    SearchFilterBar,
    DisclosureIcon
  },
  props: {
    facet: { type: Object, required: true },
    type: { type: String, default: 'list' },
    aggregations: { type: Object, default: null }
  },
  data() {
    return { open: false, bonesOpen: false }
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    },
    presentFacets() {
      if (this.type === 'skeleton') return null
      let facets = {}
      let aggs = Object.keys(this.aggregations)
      aggs.forEach(agg => {
        facets[agg] = this.facet.values[agg]
      })
      return facets
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
    },
    toggleBones(e) {
      e.preventDefault()
      this.bonesOpen = !this.bonesOpen
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
    display: flex;
    font-size: 1.25rem;
    font-weight: normal;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
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
.bones-toggle {
  display: flex;
}
</style>
