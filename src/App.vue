<script setup lang="ts">
import TheLoader from './components/TheLoader.vue'
import HelpScreen from './components/HelpScreen.vue'
import { keymap, KeyMapping } from './lib'
import SongPlayer from './components/SongPlayer.vue'
import SearchScreen from './components/SearchScreen.vue'
import { ref } from 'vue'
import Spot from './spotify'
import OutputDevice from './components/OutputDevice.vue'

// This api is used for fetching data
const spot = new Spot({
  client_id: 'e04fcca3b62c45e381da0d21a2e69b41',
  scopes: [
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-playback-position',
    'user-read-playback-state',
    'user-read-recently-played',
    'user-top-read',
    'user-read-private',
    'user-read-email',
    'streaming'
  ]
})

if (spot.authenticated()) {
  console.log('auth ok')
} else {
  spot.implicitGrant()
}

const playerState = ref<undefined | Spotify.PlaybackState>(undefined)

let player: Spotify.Player

// This api is for interacting with the player
window.onSpotifyWebPlaybackSDKReady = () => {
  console.log('ready')
  console.log(spot.access_token)
  player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => cb(spot.access_token!),
    volume: 0.5
  })

  player.addListener('initialization_error', a => console.error(a.message))
  player.addListener('authentication_error', a => console.error(a.message))
  player.addListener('account_error', a => console.error(a.message))

  // Ready
  player.addListener('ready', a => {
    console.log('Ready with Device ID', a.device_id)

    setInterval(() => {
      if (!playerState.value) return
      if (playerState.value.paused) return
      playerState.value.position += 500
    }, 500)

    player.on('player_state_changed', state => {
      console.log('state changed')

      playerState.value = state
    })

    player.togglePlay()
  })

  // Not Ready
  player.addListener('not_ready', a => {
    console.log('Device ID has gone offline', a.device_id)
  })

  player.connect()
}

const helpShown = ref(false)
const searchShown = ref(false)
const devicesShown = ref(false)

const mappings: KeyMapping[] = [
  {
    keys: ['?'],
    description: 'Show this help',
    callback: () => (helpShown.value = !helpShown.value)
  },
  {
    keys: ['s'],
    description: 'Toggle search',
    callback: () => (searchShown.value = !searchShown.value)
  },
  {
    keys: ['p'],
    description: 'Toggle Play/Pause',
    callback: () => player.togglePlay()
  },
  {
    keys: ['r'],
    description: 'Toggle repeat'
  },
  {
    keys: ['s'],
    description: 'Toggle shuffle'
  },
  {
    keys: ['d', 'o'],
    description: 'Select output device',
    callback: () => (devicesShown.value = !devicesShown.value)
  },
  {
    keys: ['esc'],
    description: 'Close current float',
    callback: () => {
      const openFloats = document.querySelectorAll('body > .float')

      if (openFloats.length == 0) return

      const topMostFloatClasses = Array.from(
        openFloats[openFloats.length - 1].classList
      )

      if (topMostFloatClasses.find(a => a == 'help')) {
        helpShown.value = false
      } else if (topMostFloatClasses.find(a => a == 'devices')) {
        searchShown.value = false
      } else if (topMostFloatClasses.find(a => a == 'search')) {
        searchShown.value = false
      } else {
        console.warn('Unhandled float', topMostFloatClasses)
      }
    }
  },
  {
    keys: ['h'],
    description: 'Skip backwards/navigate left'
  },
  {
    keys: ['j'],
    description: 'Volume down/navigate down'
  },
  {
    keys: ['k'],
    description: 'Volume up/navigate up'
  },
  {
    keys: ['l'],
    description: 'Skip forwards/navigate right'
  }
]
keymap(mappings)
</script>

<template>
  <SongPlayer
    :title="playerState?.track_window.current_track.name"
    :artists="playerState?.track_window.current_track.artists.map(a => a.name)"
    :img="playerState?.track_window.current_track.album.images[0].url"
    :shuffle="playerState?.shuffle"
    :repeat="playerState?.repeat_mode"
    :paused="playerState?.paused"
    :position="playerState?.position"
    :length="playerState?.track_window.current_track.duration_ms"
    @seek="pos => player.seek(pos)"
  />
  <HelpScreen v-if="helpShown" :mappings="mappings" />
  <SearchScreen v-if="searchShown" />

  <TheLoader v-if="devicesShown">
    <OutputDevice :devices="spot.devices" />
  </TheLoader>
</template>

<style lang="scss">
// lksjdflk
</style>
