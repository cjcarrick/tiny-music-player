<template>
  <div class="chip">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <slot name="text"></slot>
  </div>
</template>

<style scoped lang="scss">
.chip {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  min-width: 22rem;
  max-width: calc(50% - $pad);
  @include bordered;
  padding: $pad;
  gap: 1em;
  border-radius: $br;
  flex: 1;
}

.icon {
  display: flex;
  gap: $pad;
}
</style>
