<template>
  <div :class="b()">
    <label :class="b('label')">
      {{ label }}
      <slot name="label"></slot>
    </label>
    <div :class="b('content')">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StSearchPanelItem',
  bem: {
    b: 'st-search-panel-item'
  },
  props: {
    label: {
      type: String,
      default: ' '
    }
  }
}
</script>
