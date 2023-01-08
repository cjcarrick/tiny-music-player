<script setup lang="ts">
import { Duration } from '../lib'
import { MusicalNoteIcon } from '@heroicons/vue/24/solid'

defineProps<{
  img?: string
  title?: string
  artists?: string[]
  playlist?: string
  repeat?: number
  shuffle?: boolean
  paused?: boolean
  length?: number
  position?: number
}>()

const emit = defineEmits(['seek'])
</script>

<template>
  <div class="player">
    <div class="albumArt">
      <img v-if="img" :src="img" ref="img" />
      <div v-else class="noteIcon"><MusicalNoteIcon /></div>
    </div>

    <h2 class="title">{{ title }}</h2>
    <h3 class="artist">{{ artists?.join(', ') }}</h3>
    <h4 class="playlist">{{ playlist }}</h4>

    <div class="slider" v-if="position && length">
      <span> {{ new Duration(position / 1000).colons() }} </span>
      <input
        type="range"
        :value="position"
        :max="length || 0"
        min="0"
        @input="(ev) => emit('seek', parseInt((ev.target as HTMLInputElement).value))"
      />
      <span> {{ new Duration(length / 1000).colons() }} </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider {
  display: flex;
  flex-direction: row;
  input {
    flex: 1;
  }
}
.player {
  display: grid;
  grid-template: 2rem 2rem 2rem auto / 8rem auto;
  height: 8rem;
  gap: $pad 2rem;

  position: absolute;
  max-width: 32rem;
  width: 100vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h2,
h3 {
  margin: 0;
}

.albumArt {
  grid-row: 1/5;
  grid-column: 1/2;
  @include bordered();
  border-radius: $br;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .noteIcon {
    padding: 2.75rem;
    text-align: center;
  }
}
</style>
