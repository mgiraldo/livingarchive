<template>
  <div class="viewer">
    <section class="list">
      <h1 class="label">Individual: {{identifier}}</h1>
      <ul>
        <li v-for="(preserved, bone, index) in skeleton" :key="index">{{bone}} ({{preserved}})</li>
      </ul>
    </section>
    <skeleton-front id="skeleton"/>
  </div>
</template>

<script>
import SkeletonFront from '~/assets/skeleton-front.svg'
import { getSkeleton } from '~/utils/rdf'

export default {
  components: { SkeletonFront },
  head() {
    return { title: 'skeleton' }
  },
  validate({ params }) {
    return /^[a-zA-Z\d\.]+$/.test(params.id)
  },
  async asyncData({ params }) {
    let skeleton = await getSkeleton(params.id)
    return { identifier: params.id, skeleton: skeleton }
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
          elem.style.fill = '#F3D48C'
        })
      }
    }
  }
}
</script>

<style>
.viewer {
  display: flex;
  height: 100vh;
}
.list {
  height: 100vh;
  overflow-y: scroll;
  position: fixed;
}
svg {
  height: 100vh;
  width: 100vw;
}
</style>

