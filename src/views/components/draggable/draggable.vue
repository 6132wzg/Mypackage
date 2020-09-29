<template>
  <draggable v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'StDraggable',
  components: {
    draggable
  },
  data() {
    return {}
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(newVal) {}
    }
  },
  mounted() {
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  destroyed() {
    document.body.ondrop = null
  }
}
</script>
