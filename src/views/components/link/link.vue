<template>
  <div @click="onClick">
    <st-overflow-text v-if="disabled" :value="value" :maxWidth="maxWidth">
      <slot></slot>
    </st-overflow-text>
    <a v-else>
      <st-overflow-text :value="value" :maxWidth="maxWidth" />
    </a>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  name: 'StLink',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 可以把普通的文本理解为超链接的禁用状态
     */
    disabled: {
      type: [Boolean],
      default: false
    },
    maxWidth: {
      type: String,
      default: '1000px'
    },
    to: {
      type: [Object, null],
      default: null
    },
    _blank: {
      type: Boolean,
      default: false
    }
  },
  bem: {
    b: 'st-link'
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return
      }
      if (this._blank && this.to && this.to.path) {
        const queryStr = qs.stringify(this.to.query)
        const url =
          this.to.path.indexOf('?') >= 0
            ? this.to.path + '&' + queryStr
            : this.to.path + '?' + queryStr
        window.open(url)
      } else if (this.to) {
        this.$router.push(this.to)
      }

      this.$emit('click')
    }
  }
}
</script>
