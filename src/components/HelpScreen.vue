<script setup lang="ts">
import SmallChip from './SmallChip.vue'
import FloatContainer from './FloatContainer.vue'
import { KeyMapping } from '../lib'

defineProps<{ mappings: KeyMapping[] }>()
</script>

<template>
  <FloatContainer class="help constrain">
    <h2>Mappings</h2>
    <div class="mappings">
      <SmallChip class="mapping" v-for="(a, i) in mappings" :key="i">
        <template #icon class="keys">
          <kbd v-for="(key, j) in a.keys" :key="j">{{ key }}</kbd>
        </template>
        <template #text>{{ a.description }}</template>
      </SmallChip>
    </div>
  </FloatContainer>
</template>

<style scoped lang="scss">
h2 {
  text-align: center;
}

.mappings {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: $pad * 2;
}

.mapping {
  flex: 1;
}

.keys {
  display: flex;
  flex-direction: row;
  gap: $pad;
}
</style>
