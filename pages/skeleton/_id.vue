<template>
  <div class="viewer">
    <h1 class="title">{{ identifier }}</h1>
    <section class="list">
      <ul>
        <li v-for="(preserved, bone, index) in skeleton" :key="index">
          <span class="bone">{{ bone }}</span>
          <span class="preservation">{{ preserved }}</span>
        </li>
      </ul>
    </section>
    <section class="skeleton-container">
      <skeleton-front id="skeleton" />
    </section>
    <section class="bones-find-container">
      <bones-find-view :shape="shape" />
    </section>
  </div>
</template>

<script>
import SkeletonFront from '~/assets/skeleton-front.svg'
import BonesFindView from '~/components/BonesFindView'

import { getSkeletonShape } from '~/utils/rdf'
import { BONE_FILL_COLOR, BONE_FILL_PARTIAL_COLOR } from '~/utils/constants'

export default {
  components: { SkeletonFront, BonesFindView },
  head() {
    return { title: `Skeleton - ${this.identifier} - Living Archive` }
  },
  validate({ params }) {
    return /^[a-zA-Z\d.]+$/.test(params.id)
  },
  async asyncData({ params }) {
    let { skeleton, shape } = await getSkeletonShape(params.id)
    return {
      identifier: params.id,
      skeleton,
      shape
    }
  },
  mounted() {
    let prefix = '#skeleton-front-'
    let skeletonElement = document.querySelector('#skeleton')
    skeletonElement.querySelectorAll('path').forEach(elem => {
      elem.style.fill = 'gray'
      elem.style.opacity = 0.1
    })
    for (let boneName in this.skeleton) {
      let boneElem = document.querySelector(prefix + boneName)
      if (boneElem) {
        boneElem.querySelectorAll('path').forEach(elem => {
          if (this.skeleton[boneName] === 'fullyPreservedA') {
            elem.style.fill = BONE_FILL_COLOR
          } else {
            elem.style.fill = BONE_FILL_PARTIAL_COLOR
          }
          elem.style.opacity = 0.9
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  display: grid;
  grid-template-columns: 20rem 1fr 30rem;
  grid-template-rows: 4rem 1fr 20rem 1fr;
  height: 100vh;
  margin: auto;
  padding: 1rem;
  width: 80vw;
}
.title {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}
.list {
  grid-column: 3 / 4;
  grid-row: 2 / 5;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  border-bottom: 0.1rem solid $global-border-color;
  display: flex;
  margin-bottom: 0.5rem;
}
.bone {
  flex-basis: 65%;
}
.skeleton-container {
  grid-column: 2 / 3;
  grid-row: 2 / 5;
}
#skeleton {
  height: 100%;
  width: 100%;
}
.bones-find-container {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}
</style>
