<template>
  <li
    :key="individual.identifier"
    class="list-item"
    :identifier="individual.identifier"
  >
    <div class="basic-info">
      <div class="individual">
        {{ individual.individual }}
      </div>
      <div class="age">{{ individual.age }}</div>
      <div class="sex">{{ individual.sex }}</div>
    </div>
    <div class="discussion">
      {{
        longDiscussion && !discussionToggled
          ? truncatedDiscussion
          : individual.discussion
      }}
      <button
        v-if="longDiscussion"
        class="link-button"
        @click="toggleDiscussion"
      >
        {{ !discussionToggled ? 'more' : 'less' }}
      </button>
    </div>
    <div class="actions">
      <button class="link-button" @click="cellClick(individual)">
        show on map
      </button>
      <button class="link-button">
        show hole
      </button>
      <button class="link-button">
        show area
      </button>
      <button class="link-button">
        show building
      </button>
      <nuxt-link :to="`/skeleton/${individual.identifier}`" target="_blank"
        >open skeleton</nuxt-link
      >
    </div>
  </li>
</template>

<script>
let maxLength = 80 // for the discussion
export default {
  props: {
    individual: { type: Object, required: true },
    vars: { type: Array, required: true },
    cellClick: { type: Function, required: true }
  },
  data() {
    return { discussionToggled: false }
  },
  computed: {
    longDiscussion() {
      return this.individual.discussion.length > maxLength
    },
    truncatedDiscussion() {
      return this.individual.discussion.substring(0, maxLength) + '…'
    }
  },
  methods: {
    toggleDiscussion() {
      this.discussionToggled = !this.discussionToggled
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0.2rem 0.2rem 1.5rem;

  &:hover {
    background-color: lighten($color: $global-background-color, $amount: 10%);
  }
}
.basic-info {
  display: flex;
  font-size: 1.25rem;
}
.individual,
.age {
  margin-right: 1rem;
}
.discussion {
  margin-bottom: 0.5rem;
}
.link-button {
  background: none;
  border: none;
  text-decoration: underline;
  color: $global-link-color;
  cursor: pointer;
  font: inherit;
  margin-right: 0.5rem;
  padding: 0;

  &:hover {
    text-decoration: none;
  }
}
</style>
