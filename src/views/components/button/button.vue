<template>
  <a-button
    v-bind="bindProps"
    :type="type"
    :class="[
      'st-button',
      `st-button--${size}`,
      {
        'st-button--pill': pill
      }
    ]"
    v-on="$listeners"
  >
    <st-icon v-if="icon" :type="icon"></st-icon>
    <slot></slot>
  </a-button>
</template>

<script>
export default {
  name: 'StButton',
  props: {
    pill: {
      type: Boolean,
      default: false
    },
    // 新增了 size medium 对应按钮高度为 28px
    size: {
      type: String,
      default: 'default'
    },
    // 支持st-icon的图标直接使用
    icon: {
      type: String,
      default: ''
    },
    // 一定需要props的type来指定a-button类型，使产出的按钮的dom type==='button'
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    bindProps() {
      if (this.size === 'medium') {
        return { ...this.$attrs }
      } else {
        return {
          ...this.$attrs,
          size: this.size
        }
      }
    }
  }
}
</script>
