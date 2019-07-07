<template>
  <div>
    <div class="individual">
      {{ individual.individual }}
    </div>
    <div class="basic-info">
      <div
        class="basic-info-item"
        :style="'border-color:' + ageColors[individual.age]"
      >
        {{ individual.age }}
      </div>
      <div
        class="basic-info-item"
        :style="'border-color:' + sexColors[individual.sex]"
      >
        {{ individual.sex }}
      </div>
      <div class="basic-info-item">
        {{ individual.level }}
      </div>
      <div class="basic-info-item">
        {{ individual.phase }}
      </div>
    </div>
    <nuxt-link
      :to="'/skeleton/' + individual.identifier"
      class="skeleton-link"
      target="_blank"
    >
      open skeleton
    </nuxt-link>
    <div v-if="individual.description" class="description">
      Description: {{ individual.description }}
    </div>
    <div
      v-if="individual.discussion && individual.discussion !== 'NULL'"
      :id="individual.identifier + '-more'"
      class="discussion"
    >
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
  </div>
</template>

<script>
import { AGES_COLORS, SEXES_COLORS, MAX_TEXT_LENGTH } from '~/utils/constants'

export default {
  props: {
    individual: { type: Object, required: true }
  },
  data() {
    return {
      discussionToggled: false,
      ageColors: AGES_COLORS.values,
      sexColors: SEXES_COLORS.values
    }
  },
  computed: {
    longDiscussion() {
      return (
        this.individual.discussion &&
        this.individual.discussion.length > MAX_TEXT_LENGTH
      )
    },
    truncatedDiscussion() {
      return (
        this.individual.discussion.substring(0, MAX_TEXT_LENGTH).trim() + '…'
      )
    }
  },
  methods: {
    toggleDiscussion(e) {
      e.stopPropagation()
      this.discussionToggled = !this.discussionToggled
    }
  }
}
</script>

<style lang="scss" scoped>
.individual {
  margin-bottom: 0.5rem;
}
.basic-info {
  display: flex;
  flex-wrap: wrap;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.basic-info-item {
  border-left: 0.75rem solid transparent;
  flex-basis: 48%;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  padding-left: 0.25rem;
}
.skeleton-link {
  display: inline-block;
  margin-bottom: 0.25rem;
}
.description {
  margin: 0.5rem 0;
}
.discussion {
  margin: 0.5rem 0;
}
</style>
