<template>
  <div class="viewer">
    <section class="list">
      <h1 class="label">Individual: {{ identifier }}</h1>
      <ul>
        <li v-for="(preserved, bone, index) in skeleton" :key="index">
          {{ bone }} ({{ preserved }})
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

import { getSkeleton } from '~/utils/rdf'
import { BONE_FILL_COLOR, BONE_FILL_PARTIAL_COLOR } from '~/utils/constants'

export default {
  components: { SkeletonFront, BonesFindView },
  head() {
    return { title: 'skeleton' }
  },
  validate({ params }) {
    return /^[a-zA-Z\d.]+$/.test(params.id)
  },
  async asyncData({ params }) {
    let { skeleton, shape } = await getSkeleton(params.id)
    return {
      identifier: params.id,
      skeleton: skeleton,
      shape: shape
    }
  },
  mounted() {
    let prefix = '#skeleton-front-'
    let skeletonElement = document.querySelector('#skeleton')
    skeletonElement.querySelectorAll('path').forEach(elem => {
      elem.style.fill = 'white'
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
        })
      }
    }
  }
}
</script>

<style scoped>
.viewer {
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr 1fr 20rem 10rem;
  grid-template-rows: 1fr 20rem 1fr;
  padding: 1rem;
}
.list {
  overflow-y: scroll;
  grid-column: 1 / 2;
  grid-row: 1 / 4;
  -webkit-overflow-scrolling: touch;
}
.skeleton-container {
  grid-column: 2 / 3;
  grid-row: 1 / 4;
}
#skeleton {
  height: 100%;
  width: 100%;
}
.bones-find-container {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}
</style>
