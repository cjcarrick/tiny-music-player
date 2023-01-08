<script setup lang="ts">
import { Teleport } from 'vue'
</script>

<template>
  <Teleport to="body">
    <div class="float">
      <slot />
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.float {
  background-color: rgba($color: $bg, $alpha: 0.5);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
}
</style>
