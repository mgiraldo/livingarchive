<template>
  <fragment>
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
    <span>
      <nuxt-link :to="'/skeleton/' + individual.identifier" target="_blank">
        open skeleton
      </nuxt-link>
    </span>
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
  </fragment>
</template>

<script>
import { RDF_AGES, RDF_SEXES, MAX_TEXT_LENGTH } from '~/utils/constants'

export default {
  props: {
    individual: { type: Object, required: true }
  },
  data() {
    return {
      discussionToggled: false,
      ageColors: RDF_AGES.values,
      sexColors: RDF_SEXES.values
    }
  },
  computed: {
    longDiscussion() {
      return this.individual.discussion.length > MAX_TEXT_LENGTH
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
</style>
