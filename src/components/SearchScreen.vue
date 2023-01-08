<script setup lang="ts">
import FloatContainer from './FloatContainer.vue'
import { ref } from 'vue'

const query = ref('')
const type = ref('')
const searchArtists = ref(true)
const searchTracks = ref(true)
const searchPlaylists = ref(true)

document.body.addEventListener('keyup', ev => {
  if (ev.target) {

  }
})
</script>

<template>
  <FloatContainer>
    <div class="search constrain">
      <input type="search" v-model="query" placeholder="Search" />
    </div>

    <div class="radio">
      <label>
        <input type="checkbox" v-model="searchPlaylists" />
        <div class="label">Playlists</div>
      </label>
      <label>
        <input type="checkbox" v-model="searchArtists" />
        <div class="label">Artists</div>
      </label>
      <label>
        <input type="checkbox" v-model="searchTracks" />
        <div class="label">Tracks</div>
      </label>
    </div>

    <div class="results"></div>
  </FloatContainer>
</template>

<style scoped lang="scss">
.search {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 1rem;
}
input[type='search'] {
  display: block;
  width: 100%;
  max-width: 32rem;
}
</style>
