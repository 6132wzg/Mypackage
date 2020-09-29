<template>
  <div
    :class="{
      [b()]: true,
      [b(type || 'normal')]: true
    }"
  >
    <div :class="b('title')" v-if="!$slots.left">
      <slot name="title" />
    </div>
    <div :class="b('left')" v-if="!$slots.title">
      <slot name="left" />
    </div>
    <div :class="b('right')">
      <slot name="right" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'StHeaderActions',
  bem: {
    b: 'st-container-header-actions'
  },
  props: {
    // small 或 'normal'
    type: {
      type: String,
      default: 'normal'
    }
  }
}
</script>
