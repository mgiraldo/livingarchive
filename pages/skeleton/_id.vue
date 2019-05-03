<template>
  <div class="viewer">
    <section class="list">
      <h1 class="label">Individual: {{identifier}}</h1>
      <ul>
        <li v-for="(bone, index) in skeleton" :key="index">{{bone.bone}} ({{bone.preserved}})</li>
      </ul>
    </section>
    <skeleton-front/>
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
</style>

