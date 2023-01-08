<script setup lang="ts">
import type { Track } from '../spotify.types'
import {
  ClockIcon,
  ForwardIcon,
  MusicalNoteIcon,
  SpeakerWaveIcon
} from '@heroicons/vue/24/solid'
import Spot from '../spotify'
import SmallChip from './SmallChip.vue'
import { Duration } from '../lib'

const props = defineProps<{ track: Track; spot: Spot }>()

const data = await props.spot.analysis(props.track.id)
</script>

<template>
  <div class="info">
    <h1>{{ track.name }}</h1>
    <SmallChip>
      <ForwardIcon #icon />
      <template #text>
        <p>Tempo: {{ data.track.tempo }}</p>
        <p>Duration: {{ new Duration(data.track.duration).colons() }}</p>
        <p>Time signature: {{ data.track.time_signature }}</p>
      </template>
    </SmallChip>

    <SmallChip>
      <MusicalNoteIcon #icon />
      <template #text>
        <p>Key: {{ data.track.key }}</p>
        <p>Mode: {{ data.track.mode == 1 ? 'major' : 'minor' }}</p>
      </template>
    </SmallChip>

    <SmallChip>
      <SpeakerWaveIcon #icon />
      <template #text>
        <p>Loudness: {{ data.track.loudness }}</p>
      </template>
    </SmallChip>

    <h2>Segments</h2>
    <template v-for="(segment, i) in data.segments">
      <h3>{{ new Duration(segment.start).colons() }} - {{ new
      Duration(segment.duration + segment.start).colons() }}</h3>
      <SmallChip></SmallChip>
    </template>

  </div>
</template>
