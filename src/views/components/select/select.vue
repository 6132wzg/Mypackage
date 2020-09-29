<template>
  <div :class="b()" :style="{ width }">
    <a-select
      :mode="mode"
      :placeholder="placeholder"
      :value="cValue"
      :defaultValue="defaultValue"
      :disabled="disabled"
      @change="onChange"
      :options="shopOptions"
      v-bind="{
        ...(useBodyContainer
          ? {}
          : {
              getPopupContainer: triggerNode => {
                return triggerNode.parentNode
              }
            }),
        ...$attrs
      }"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash-es'
export default {
  name: 'StSelect',
  bem: {
    b: 'st-select'
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    mode: {
      type: String
    },
    placeholder: {
      type: String
    },
    type: {
      type: String
    },
    width: {
      type: String,
      default: '150px'
    },
    value: {
      type: [Number, String, Array]
    },
    query: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    },
    defaultValue: Number,
    defaultLabel: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // useBodyContainer 是否使用body作为父级定位，默认为组件父级定位
    useBodyContainer: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    query: {
      deep: true,
      handler(newValue, oldValue) {
        if (isEqual(newValue, oldValue)) return
        this.cValue = this.defaultOption.length
          ? this.defaultOption[0].value
          : ''
        this.$emit('refresh', newValue)
      }
    }
  },
  computed: {
    cValue: {
      set(newValue, oldValue) {
        if (isEqual(newValue, oldValue)) return
        this.$emit('change', newValue)
      },
      get() {
        return this.value || this.defaultValue
      }
    },
    defaultOption() {
      return this.defaultLabel ? [{ title: this.defaultLabel, value: -1 }] : []
    },
    shopOptions() {
      return [
        ...this.defaultOption,
        ...this.options.filter(
          item =>
            !this.defaultOption[0] || item.value !== this.defaultOption[0].value
        )
      ]
    },
    filterOption(input, option) {
      console.log(input, option)
      return true
    }
  },

  methods: {
    onChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>
