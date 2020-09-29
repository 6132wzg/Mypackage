<template>
  <div :class="b()">
    <span :class="b('label')">{{ label }}</span>
    {{ colon ? '：' : '' }}
    <span :class="b('value')">{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'StDescItem',
  bem: {
    b: 'st-desc-item'
  },
  props: {
    label: String,
    colon: Boolean,
    value: [String, Number]
  }
}
</script>

<style></style>
