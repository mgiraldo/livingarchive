<template>
  <li
    :key="individual.identifier"
    class="list-item"
    :identifier="individual.identifier"
    @mouseenter="showControls"
    @mouseleave="hideControls"
  >
    <div class="individual">
      {{ individual.individual }}
    </div>
    <div class="basic-info">
      <div class="age" :style="'border-color:' + ageColors[individual.age]">
        {{ individual.age }}
      </div>
      <div class="sex" :style="'border-color:' + sexColors[individual.sex]">
        {{ individual.sex }}
      </div>
    </div>
    <nuxt-link
      :to="'/skeleton/' + individual.identifier"
      class="skeleton-link"
      target="_blank"
    >
      open skeleton
    </nuxt-link>
    <div :id="individual.identifier + '-more'" class="discussion">
      {{
        longDiscussion && !discussionToggled
          ? truncatedDiscussion
          : individual.discussion
      }}
      <button
        v-if="longDiscussion"
        class="link-button"
        :aria-expanded="discussionToggled ? 'true' : 'false'"
        :aria-controls="individual.identifier + '-more'"
        @click="toggleDiscussion"
      >
        {{ !discussionToggled ? 'more' : 'less' }}
      </button>
    </div>
    <div v-show="controlsToggled" class="actions">
      <button class="link-button" @click="showClick(individual)">
        show on map
      </button>
      <span class="separator">|</span>
      <button class="link-button">
        show find
      </button>
      <span class="separator">←</span>
      <button class="link-button">
        show hole
      </button>
      <span class="separator">←</span>
      <button class="link-button">
        show area
      </button>
      <span class="separator">←</span>
      <button class="link-button" @click="buildingClick(individual)">
        show building
      </button>
    </div>
  </li>
</template>

<script>
import { RDF_AGES, RDF_SEXES } from '~/utils/constants'

let maxLength = 80 // for the discussion

export default {
  props: {
    individual: { type: Object, required: true },
    vars: { type: Array, required: true },
    showClick: { type: Function, required: true },
    buildingClick: { type: Function, required: true }
  },
  data() {
    return {
      discussionToggled: false,
      controlsToggled: false,
      ageColors: RDF_AGES.values,
      sexColors: RDF_SEXES.values
    }
  },
  computed: {
    longDiscussion() {
      return this.individual.discussion.length > maxLength
    },
    truncatedDiscussion() {
      return this.individual.discussion.substring(0, maxLength).trim() + '…'
    }
  },
  methods: {
    showControls() {
      this.controlsToggled = true
    },
    hideControls() {
      this.controlsToggled = false
    },
    toggleDiscussion(e) {
      e.stopPropagation()
      this.discussionToggled = !this.discussionToggled
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  border-top: 0.05rem solid $global-text-color;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  padding: 0.2rem 0.2rem 1rem;

  &:hover {
    background-color: lighten($color: $global-background-color, $amount: 10%);
  }
}
.basic-info {
  display: flex;
  font-size: 1.5rem;
  margin: 0.25rem 0;
}
.age {
  width: 10rem;
}
.individual,
.age {
  margin-right: 1rem;
}
.age,
.sex {
  border-left: 0.75rem solid transparent;
  padding-left: 0.25rem;
}
.discussion {
  margin: 0.5rem 0;
}
.link-button {
  background: none;
  border: none;
  text-decoration: underline;
  color: $global-link-color;
  cursor: pointer;
  font: inherit;
  padding: 0;

  &:hover {
    text-decoration: none;
  }
}
.actions {
  display: flex;
}
.separator {
  margin: 0 0.2rem;
}
</style>
