<script setup lang="ts">
import {
  ChevronRightIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon
} from '@heroicons/vue/24/solid'
import type { OK } from '../spotify.types'
import SmallChip from './SmallChip.vue'
import FloatContainer from './FloatContainer.vue'
const props = defineProps<{
  devices: () => Promise<OK['/me/player/devices']>
}>()

const devicesAwaited = await props.devices()
console.log(devicesAwaited)


</script>

<template>
  <FloatContainer>
    <div class="devices">
      <span v-if="devicesAwaited.devices.length == 0">
        <i> No devices avalible. </i>
      </span>

      <SmallChip
        class="device"
        v-for="a in devicesAwaited.devices"
        :key="a.id"
        :class="{ active: a.is_active }"
      >
        <template #icon>
          <ChevronRightIcon class="active_indicator icon" />
          <DevicePhoneMobileIcon v-if="a.type == 'Smartphone'" class="icon" />
          <ComputerDesktopIcon v-else-if="a.type == 'Computer'" class="icon" />
          <template v-else> {{ a.type }} </template>
        </template>
        <template #text>
          <span> {{ a.name }} </span>
        </template>
      </SmallChip>
    </div>
  </FloatContainer>
</template>

<style scoped lang="scss">
.icon {
  font-size: 2rem;
}
.devices {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 16rem;
  overflow: scroll;

  align-items: stretch;
  display: flex;
  flex-direction: column;
}

.active_indicator {
  width: 1em;
  height: 1em;
  opacity: 0;
}
.active {
  .active_indicator {
    opacity: 1;
  }
}
</style>
