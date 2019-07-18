<template>
  <section>
    <div class="individual">
      {{ individual.individual }}
    </div>
    <ul class="basic-info">
      <li class="basic-info-item">
        <dl>
          <dt>Age</dt>
          <dd
            class="bordered"
            :style="'border-color:' + ageColors[individual.age]"
          >
            {{ individual.age }}
          </dd>
        </dl>
      </li>
      <li class="basic-info-item">
        <dl>
          <dt>Sex</dt>
          <dd
            class="bordered"
            :style="'border-color:' + sexColors[individual.sex]"
          >
            {{ individual.sex }}
          </dd>
        </dl>
      </li>
      <li class="basic-info-item">
        <dl>
          <dt>Level</dt>
          <dd>
            {{ individual.level }}
          </dd>
        </dl>
      </li>
      <li class="basic-info-item">
        <dl>
          <dt>Phase</dt>
          <dd>
            {{ individual.phase }}
          </dd>
        </dl>
      </li>
    </ul>
    <nuxt-link
      :to="'/skeleton/' + individual.identifier"
      class="skeleton-link"
      target="_blank"
    >
      open skeleton
    </nuxt-link>
    <collapsible-text :text="individual.description" />
    <collapsible-text :text="individual.discussion" />
  </section>
</template>

<script>
import { FILTER_PARAMS_TO_NAMES, MAX_TEXT_LENGTH } from '~/utils/constants'

import CollapsibleText from '~/components/CollapsibleText'

export default {
  components: { CollapsibleText },
  props: {
    individual: { type: Object, required: true }
  },
  data() {
    return {
      discussionToggled: false,
      ageColors: FILTER_PARAMS_TO_NAMES.a.colors,
      sexColors: FILTER_PARAMS_TO_NAMES.s.colors
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
section {
  padding-top: 0.25rem;
}
.individual {
  margin-bottom: 0.5rem;
}
.basic-info {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin-bottom: 0.5rem;
  padding: 0;
}
.basic-info-item {
  flex-basis: 48%;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
}
dt {
  color: $global-secondary-text-color;
  margin-bottom: 0.25rem;
}
dd {
  font-size: 1.5rem;
}
.bordered {
  border-left: 0.75rem solid transparent;
  padding-left: 0.25rem;
}
.skeleton-link {
  display: inline-block;
  margin-bottom: 0.25rem;
}
.description {
  margin: 0.5rem 0;
}
</style>
