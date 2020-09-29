<template>
  <div :class="b()">
    <div :class="b('content')">
      <slot>{{ titleName }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockTitle',
  bem: {
    b: 'st-block-title'
  },
  props: {
    titleName: {
      type: String,
      default: ''
    }
  }
}
</script>
