<template>
  <section>
    <search-filter-title
      :click-handler="toggle"
      :controls="'facet_' + facet.name + '_toggle'"
      :open="open"
      :text="facet.name"
    />
    <div :id="'facet_' + facet.name + '_toggle'">
      <skeleton-aggregations-viewer
        v-show="open"
        :key="$route.fullPath"
        :aggregations="fixedAggregations"
      />
      <div>
        <button
          v-show="open"
          class="bones-toggle link-button no-underline"
          :aria-controls="facet.name + '_bones'"
          @click="toggleBones"
        >
          <disclosure-icon :open="bonesOpen" label="" class="icon" />
          {{ bonesOpen ? 'Hide' : 'Show' }} bones
        </button>

        <ul v-if="open && bonesOpen" :id="facet.name + '_bones'">
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
  </section>
</template>

<script>
import SearchFilterTitle from '~/components/SearchFilterTitle'
import SearchFilterBar from '~/components/SearchFilterBar'
import SkeletonAggregationsViewer from '~/components/SkeletonAggregationsViewer'
import DisclosureIcon from '~/components/DisclosureIcon'

export default {
  components: {
    SkeletonAggregationsViewer,
    SearchFilterBar,
    DisclosureIcon,
    SearchFilterTitle
  },
  props: {
    facet: { type: Object, required: true },
    aggregations: { type: Object, default: null }
  },
  data() {
    return { open: false, bonesOpen: false }
  },
  computed: {
    total() {
      return this.$store.getters.individualCount
    },
    fixedAggregations() {
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
    toggleBones(e) {
      e.preventDefault()
      this.bonesOpen = !this.bonesOpen
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.facet {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}
label {
  cursor: pointer;
  display: flex;
  margin-bottom: 0.25rem;
}
.bone-label {
  margin-bottom: 0.25rem;
}
.bones-toggle {
  display: flex;
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
}
.icon {
  margin-right: 0.25rem;
}
</style>
